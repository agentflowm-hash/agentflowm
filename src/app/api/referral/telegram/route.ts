import { NextRequest, NextResponse } from 'next/server';
import { validateSession, createReferralFromTelegram, getClientByTelegram } from '@/lib/database';

// ═══════════════════════════════════════════════════════════════
//                    REFERRAL VIA WEBSITE (TELEGRAM USER)
// Erstellt Empfehlung für eingeloggte Telegram-User
// ═══════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '1744361953';

async function sendTelegramMessage(chatId: number, text: string): Promise<boolean> {
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

export async function POST(request: NextRequest) {
  try {
    // Prüfe Session
    const token = request.cookies.get('portal_session')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 });
    }

    const client = await validateSession(token);
    if (!client || !client.telegram_username) {
      return NextResponse.json({ error: 'Ungültige Session' }, { status: 401 });
    }

    // Parse Body
    const { referredName, referredPhone, referredEmail, referredCompany, context } = await request.json();

    if (!referredName || !referredPhone || !context) {
      return NextResponse.json({ error: 'Name, Telefon und Kontext sind erforderlich' }, { status: 400 });
    }

    // Hole Chat ID für Telegram
    const fullClient = await getClientByTelegram(client.telegram_username);
    const chatId = fullClient?.telegram_id || client.telegram_id;

    if (!chatId) {
      return NextResponse.json({ error: 'Telegram nicht verknüpft' }, { status: 400 });
    }

    // Erstelle Empfehlung
    const referral = await createReferralFromTelegram({
      referrerTelegram: client.telegram_username,
      referrerChatId: chatId,
      referrerName: client.name,
      referredName,
      referredPhone,
      referredEmail,
      referredCompany,
      context,
    });

    console.log(`Referral #${referral.id} created via website by @${client.telegram_username}`);

    // Bestätigung an User per Telegram
    await sendTelegramMessage(chatId,
      `*Empfehlung erfolgreich!*\n\n` +
      `Deine Empfehlung wurde über die Website eingereicht.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*${referral.referred_name}*\n` +
      `${referral.referred_phone}\n` +
      `${referral.referred_company ? `${referral.referred_company}\n` : ''}` +
      `${referral.context}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Wir halten dich über den Status auf dem Laufenden!`
    );

    // Benachrichtige Admin
    await sendTelegramMessage(parseInt(ADMIN_CHAT_ID),
      `*Neue Empfehlung (Website)*\n\n` +
      `Von: @${client.telegram_username} (${client.name})\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `*${referral.referred_name}*\n` +
      `${referral.referred_phone}\n` +
      `${referral.referred_email ? `${referral.referred_email}\n` : ''}` +
      `${referral.referred_company ? `${referral.referred_company}\n` : ''}` +
      `${referral.context}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `ID: #${referral.id}`
    );

    return NextResponse.json({
      success: true,
      referral: {
        id: referral.id,
        referredName: referral.referred_name,
      },
    });

  } catch (error) {
    console.error('Referral error:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 });
  }
}
