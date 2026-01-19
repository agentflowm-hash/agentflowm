import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase, checkRateLimit, hashIP } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { leadSchema, validateInput } from '@/lib/validations';
import { sendEmail } from '@/lib/email';
import { contactAdminTemplate, contactConfirmationTemplate } from '@/lib/email/templates';
import { sendNotification } from '@/lib/notifications';

// Initialisiere DB beim ersten Request
let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    POST /api/contact
//                    Kontaktformular / Lead-Erfassung
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    // DB initialisieren
    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    // Rate Limiting (10 Requests pro Stunde pro IP)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const ipHash = hashIP(ip);
    
    const rateLimit = await checkRateLimit(ipHash, '/api/contact', 10, 60);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
          retryAfter: rateLimit.resetAt.toISOString(),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000)),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // Request Body parsen
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Ungültiges JSON' },
        { status: 400 }
      );
    }

    // Honeypot Check (Spam-Schutz)
    if (body.website && body.website.length > 0) {
      // Silently reject spam
      return NextResponse.json({ success: true, message: 'Nachricht gesendet' });
    }

    // Validierung
    const validation = validateInput(leadSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const createdAt = new Date().toISOString();

    // Lead in Datenbank speichern
    const result = db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      source: data.source,
      packageInterest: data.packageInterest || null,
      message: data.message,
      budget: data.budget || null,
      status: 'new',
      priority: determinePriority(data),
      createdAt,
      updatedAt: createdAt,
    }).returning().get();

    // ═══════════════════════════════════════════════════════════════
    // E-Mail-Benachrichtigungen senden
    // ═══════════════════════════════════════════════════════════════
    
    const emailData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      service: data.packageInterest,
      budget: data.budget,
      message: data.message,
      createdAt,
    };

    // Admin-Benachrichtigung (async, nicht blockierend)
    if (process.env.EMAIL_TO) {
      sendEmail({
        to: process.env.EMAIL_TO,
        subject: `🔥 Neue Anfrage von ${data.name}`,
        html: contactAdminTemplate(emailData),
        replyTo: data.email,
      }).catch(err => console.error('Admin email failed:', err));
    }

    // Bestätigung an Kunde (async, nicht blockierend)
    sendEmail({
      to: data.email,
      subject: 'Ihre Anfrage bei AgentFlow - Bestätigung',
      html: contactConfirmationTemplate(emailData),
    }).catch(err => console.error('Confirmation email failed:', err));

    // Telegram/Discord Notification
    sendNotification({
      type: 'lead',
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        packageInterest: data.packageInterest,
        budget: data.budget,
        message: data.message,
      },
    }).catch(err => console.error('Notification failed:', err));

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank für Ihre Nachricht! Wir melden uns innerhalb von 24 Stunden.',
      id: result.id,
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function determinePriority(data: { packageInterest?: string; budget?: string; message: string }): string {
  // Höhere Priorität für größere Pakete/Budgets
  if (data.packageInterest === 'growth' || data.budget === 'ueber-10000') {
    return 'high';
  }
  if (data.packageInterest === 'business' || data.budget === '5000-10000') {
    return 'high';
  }
  if (data.message.length > 200) {
    return 'medium';
  }
  return 'medium';
}
