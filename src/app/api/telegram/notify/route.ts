import { NextRequest, NextResponse } from 'next/server';
import { getReferralById, updateReferralStatus } from '@/lib/database';

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM NOTIFICATION API
// Sendet Status-Updates an Empfehler
// ═══════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId: number, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
    return (await res.json()).ok === true;
  } catch {
    return false;
  }
}

// POST - Sende Status-Update an Empfehler
export async function POST(request: NextRequest) {
  try {
    const { referralId, status, message, commission } = await request.json();

    if (!referralId || !status) {
      return NextResponse.json({ error: 'referralId und status erforderlich' }, { status: 400 });
    }

    const referral = await getReferralById(referralId);
    if (!referral) {
      return NextResponse.json({ error: 'Empfehlung nicht gefunden' }, { status: 404 });
    }

    if (!referral.referrer_chat_id) {
      return NextResponse.json({ error: 'Kein Telegram Chat für Empfehler' }, { status: 400 });
    }

    // Update Status in DB
    await updateReferralStatus(referralId, status, message);

    // Erstelle Nachricht basierend auf Status
    let notificationText = '';

    switch (status) {
      case 'contacted':
        notificationText =
          `*Update zu deiner Empfehlung*\n\n` +
          `Wir haben *${referral.referred_name}* kontaktiert!\n\n` +
          `Wir halten dich über den weiteren Verlauf auf dem Laufenden.`;
        break;

      case 'converted':
        notificationText =
          `*Tolle Neuigkeiten!*\n\n` +
          `Deine Empfehlung *${referral.referred_name}* ist jetzt Kunde!\n\n` +
          `${commission ? `Deine Provision: *${commission}€*\n\n` : ''}` +
          `Vielen Dank für deine Empfehlung!`;
        break;

      case 'rejected':
        notificationText =
          `*Update zu deiner Empfehlung*\n\n` +
          `Leider hat sich *${referral.referred_name}* gegen eine Zusammenarbeit entschieden.\n\n` +
          `${message ? `Grund: ${message}\n\n` : ''}` +
          `Danke trotzdem für deine Empfehlung! Jede Empfehlung zählt.`;
        break;

      default:
        notificationText =
          `*Update zu deiner Empfehlung*\n\n` +
          `Status für *${referral.referred_name}*: ${status}\n` +
          `${message ? `\n${message}` : ''}`;
    }

    // Sende Nachricht
    const sent = await sendMessage(referral.referrer_chat_id, notificationText);

    if (sent) {
      console.log(`Notification sent for referral #${referralId} to chat ${referral.referrer_chat_id}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Nachricht konnte nicht gesendet werden' }, { status: 500 });
    }

  } catch (error) {
    console.error('Notify error:', error);
    return NextResponse.json({ error: 'Fehler beim Senden' }, { status: 500 });
  }
}
