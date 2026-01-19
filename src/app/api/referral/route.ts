import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase, checkRateLimit, hashIP } from '@/lib/db';
import { referrals } from '@/lib/db/schema';
import { referralSchema, validateInput } from '@/lib/validations';
import { sendEmail } from '@/lib/email';
import { referralAdminTemplate, referralConfirmationTemplate } from '@/lib/email/templates';
import { sendNotification } from '@/lib/notifications';

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    POST /api/referral
//                    Empfehlungsprogramm
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    // Rate Limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const ipHash = hashIP(ip);
    
    const rateLimit = await checkRateLimit(ipHash, '/api/referral', 5, 60);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 });
    }

    // Honeypot
    if (body.website && body.website.length > 0) {
      return NextResponse.json({ success: true });
    }

    // Validierung
    const validation = validateInput(referralSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const createdAt = new Date().toISOString();

    // Referral speichern
    const result = db.insert(referrals).values({
      referrerName: data.referrerName,
      referrerEmail: data.referrerEmail,
      referrerPhone: data.referrerPhone || null,
      referredName: data.referredName,
      referredEmail: data.referredEmail || null,
      referredPhone: data.referredPhone || null,
      referredCompany: data.referredCompany || null,
      context: data.context || null,
      status: 'pending',
      createdAt,
      updatedAt: createdAt,
    }).returning().get();

    // ═══════════════════════════════════════════════════════════════
    // E-Mail-Benachrichtigungen senden
    // ═══════════════════════════════════════════════════════════════
    
    const emailData = {
      referrerName: data.referrerName,
      referrerEmail: data.referrerEmail,
      referrerPhone: data.referrerPhone,
      referredName: data.referredName,
      referredEmail: data.referredEmail || '',
      referredPhone: data.referredPhone,
      referredCompany: data.referredCompany,
      notes: data.context,
      createdAt,
    };

    // Admin-Benachrichtigung
    if (process.env.EMAIL_TO) {
      sendEmail({
        to: process.env.EMAIL_TO,
        subject: `💜 Neue Empfehlung von ${data.referrerName}`,
        html: referralAdminTemplate(emailData),
        replyTo: data.referrerEmail,
      }).catch(err => console.error('Admin email failed:', err));
    }

    // Bestätigung an Empfehlenden
    sendEmail({
      to: data.referrerEmail,
      subject: 'Ihre Empfehlung bei AgentFlow - Bestätigung',
      html: referralConfirmationTemplate(emailData),
    }).catch(err => console.error('Confirmation email failed:', err));

    // Telegram/Discord Notification
    sendNotification({
      type: 'referral',
      data: {
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        referredName: data.referredName,
        referredEmail: data.referredEmail,
        referredCompany: data.referredCompany,
      },
    }).catch(err => console.error('Notification failed:', err));

    return NextResponse.json({
      success: true,
      message: 'Vielen Dank für Ihre Empfehlung! Wir melden uns bei Ihrem Kontakt.',
      id: result.id,
    });

  } catch (error) {
    console.error('Referral API Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
