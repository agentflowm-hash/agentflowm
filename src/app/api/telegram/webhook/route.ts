import { NextRequest, NextResponse } from 'next/server';
import { authenticatedUsers, pendingLogins } from '@/lib/auth-store';
import { createPortalClient, getPortalClientByTelegram } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM WEBHOOK
// Empfängt Updates vom Telegram Bot
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Telegram Update-Struktur
    const message = body.message;
    
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text || '';
    const from = message.from;

    // /start Command mit Login-Parameter
    if (text.startsWith('/start login_')) {
      const requestedUsername = text.replace('/start login_', '').trim();
      
      // Prüfe ob der Telegram-Username übereinstimmt
      if (from.username && from.username.toLowerCase() === requestedUsername.toLowerCase()) {
        // Speichere authentifizierten User
        authenticatedUsers.set(from.username.toLowerCase(), {
          telegramId: from.id,
          username: from.username,
          firstName: from.first_name,
          authDate: new Date(),
        });

        // Markiere pending Login als verifiziert
        pendingLogins.set(from.username.toLowerCase(), {
          requestedAt: new Date(),
          verified: true,
          telegramId: from.id,
          firstName: from.first_name,
        });

        // Portal-Client erstellen oder abrufen
        let portalInfo: { accessCode: string; isNew: boolean } = { accessCode: '', isNew: false };
        try {
          const existingClient = await getPortalClientByTelegram(from.username.toLowerCase());
          if (existingClient) {
            portalInfo = { accessCode: existingClient.access_code, isNew: false };
          } else {
            const newClient = await createPortalClient({
              name: from.first_name || from.username,
              telegramUsername: from.username.toLowerCase(),
              firstName: from.first_name,
              telegramId: from.id,
            });
            portalInfo = { accessCode: newClient.accessCode, isNew: true };
          }
        } catch (err) {
          console.error('Failed to create portal client:', err);
        }

        // Sende Bestätigung mit Portal-Zugangscode
        const portalMessage = portalInfo.accessCode
          ? (portalInfo.isNew
            ? `\n\n🎉 *Dein Kundenportal wurde erstellt!*\n` +
              `Portal: portal.agentflowm.com\n` +
              `Zugangscode: \`${portalInfo.accessCode}\`\n\n` +
              `Speichere diesen Code sicher!`
            : `\n\n📋 *Dein Kundenportal*\n` +
              `Portal: portal.agentflowm.com\n` +
              `Zugangscode: \`${portalInfo.accessCode}\``)
          : '';

        await sendTelegramMessage(chatId,
          `✅ *Anmeldung erfolgreich!*\n\n` +
          `Hallo ${from.first_name || from.username}! Du bist jetzt angemeldet.\n\n` +
          `Du erhältst hier Updates zu:\n` +
          `• Neuen Projekten\n` +
          `• Status-Updates\n` +
          `• Wichtigen Benachrichtigungen` +
          portalMessage +
          `\n\nKehre jetzt zur Website zurück.`
        );
      } else {
        // Username stimmt nicht überein
        await sendTelegramMessage(chatId,
          `❌ *Anmeldung fehlgeschlagen*\n\n` +
          `Der angeforderte Username (@${requestedUsername}) stimmt nicht mit deinem Telegram-Account überein.\n\n` +
          `Dein Telegram-Username: @${from.username || 'nicht gesetzt'}\n\n` +
          `Bitte versuche es erneut mit dem korrekten Username.`
        );
      }
    }
    
    // /start ohne Parameter - Willkommensnachricht
    else if (text === '/start') {
      await sendTelegramMessage(chatId,
        `👋 *Willkommen bei AgentFlow!*\n\n` +
        `Ich bin der AgentFlow Bot. Über mich kannst du:\n\n` +
        `• Dich auf der Website anmelden\n` +
        `• Updates zu deinen Projekten erhalten\n` +
        `• Benachrichtigungen bekommen\n\n` +
        `Um dich anzumelden, gehe auf:\n` +
        `🔗 agentflowm.com/anmelden`
      );
    }

    // /status - Zeige Anmeldestatus
    else if (text === '/status') {
      const user = from.username ? authenticatedUsers.get(from.username.toLowerCase()) : null;
      
      if (user) {
        await sendTelegramMessage(chatId,
          `✅ *Du bist angemeldet*\n\n` +
          `Username: @${user.username}\n` +
          `Angemeldet seit: ${user.authDate.toLocaleDateString('de-DE')}`
        );
      } else {
        await sendTelegramMessage(chatId,
          `❌ *Du bist nicht angemeldet*\n\n` +
          `Gehe auf agentflowm.com/anmelden um dich anzumelden.`
        );
      }
    }

    // /hilfe - Hilfe anzeigen
    else if (text === '/hilfe' || text === '/help') {
      await sendTelegramMessage(chatId,
        `ℹ️ *Hilfe*\n\n` +
        `Verfügbare Befehle:\n\n` +
        `/start - Willkommensnachricht\n` +
        `/status - Anmeldestatus prüfen\n` +
        `/hilfe - Diese Hilfe anzeigen\n\n` +
        `Bei Fragen: kontakt@agentflowm.com`
      );
    }

    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// Hilfsfunktion zum Senden von Telegram-Nachrichten
async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
  }
}

// GET - Für Webhook-Verifizierung
export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram webhook active',
    info: 'POST requests are processed for Telegram updates'
  });
}
