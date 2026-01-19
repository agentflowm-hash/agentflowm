import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase, checkRateLimit, hashIP } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { subscriberSchema, validateInput } from '@/lib/validations';
import { sendEmail } from '@/lib/email';
import { newsletterWelcomeTemplate, newsletterAdminTemplate } from '@/lib/email/templates';
import { sendNotification } from '@/lib/notifications';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    POST /api/subscribe
//                    Newsletter-Anmeldung
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
    
    const rateLimit = await checkRateLimit(ipHash, '/api/subscribe', 5, 60);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen.' },
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
    const validation = validateInput(subscriberSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data;
    const createdAt = new Date().toISOString();

    // Prüfen ob E-Mail schon existiert
    const existing = db.select()
      .from(subscribers)
      .where(eq(subscribers.email, data.email))
      .get();

    if (existing) {
      if (existing.status === 'confirmed') {
        return NextResponse.json({
          success: true,
          message: 'Diese E-Mail ist bereits angemeldet.',
        });
      }
      // Bestätigung erneut senden - aber hier senden wir die Welcome-Email nochmal
      sendEmail({
        to: data.email,
        subject: 'Willkommen beim AgentFlow Newsletter!',
        html: newsletterWelcomeTemplate({ email: data.email, createdAt }),
      }).catch(err => console.error('Welcome email failed:', err));

      return NextResponse.json({
        success: true,
        message: 'Bestätigungs-E-Mail wurde erneut gesendet.',
      });
    }

    // Confirm Token generieren
    const confirmToken = crypto.randomBytes(32).toString('hex');

    // Subscriber speichern
    db.insert(subscribers).values({
      email: data.email,
      name: data.name || null,
      topics: data.topics ? JSON.stringify(data.topics) : null,
      status: 'pending',
      confirmToken,
      createdAt,
    }).run();

    // ═══════════════════════════════════════════════════════════════
    // E-Mail-Benachrichtigungen senden
    // ═══════════════════════════════════════════════════════════════
    
    const emailData = { email: data.email, createdAt };

    // Welcome-Email an Subscriber
    sendEmail({
      to: data.email,
      subject: 'Willkommen beim AgentFlow Newsletter!',
      html: newsletterWelcomeTemplate(emailData),
    }).catch(err => console.error('Welcome email failed:', err));

    // Admin-Benachrichtigung
    if (process.env.EMAIL_TO) {
      sendEmail({
        to: process.env.EMAIL_TO,
        subject: `📬 Neuer Newsletter-Subscriber: ${data.email}`,
        html: newsletterAdminTemplate(emailData),
      }).catch(err => console.error('Admin email failed:', err));
    }

    // Telegram/Discord Notification
    sendNotification({
      type: 'subscriber',
      data: { email: data.email },
    }).catch(err => console.error('Notification failed:', err));

    return NextResponse.json({
      success: true,
      message: 'Willkommen! Sie erhalten jetzt unseren Newsletter.',
    });

  } catch (error) {
    console.error('Subscribe API Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
//                    GET /api/subscribe?token=xxx
//                    E-Mail-Bestätigung
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json({ error: 'Token fehlt' }, { status: 400 });
    }

    // Subscriber mit Token finden
    const subscriber = db.select()
      .from(subscribers)
      .where(eq(subscribers.confirmToken, token))
      .get();

    if (!subscriber) {
      return NextResponse.json({ error: 'Ungültiger Token' }, { status: 404 });
    }

    if (subscriber.status === 'confirmed') {
      return NextResponse.json({ message: 'E-Mail bereits bestätigt' });
    }

    // Bestätigen
    db.update(subscribers)
      .set({
        status: 'confirmed',
        confirmToken: null,
        confirmedAt: new Date().toISOString(),
      })
      .where(eq(subscribers.id, subscriber.id))
      .run();

    return NextResponse.json({
      success: true,
      message: 'E-Mail erfolgreich bestätigt! Willkommen.',
    });

  } catch (error) {
    console.error('Confirm API Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten.' },
      { status: 500 }
    );
  }
}
