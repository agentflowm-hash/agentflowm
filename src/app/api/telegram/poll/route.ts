import { NextResponse } from "next/server";
import {
  authenticatedUsers,
  pendingLogins,
  generateLoginCode,
  saveLoginCode,
} from "@/lib/auth-store";
import { createPortalClient, getPortalClientByTelegram } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM POLLING
// Alternative zu Webhooks für lokale Entwicklung
// ═══════════════════════════════════════════════════════════════

let lastUpdateId = 0;

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
  }
}

async function processUpdate(update: any) {
  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || "";
  const from = message.from;

  // /start Command mit Login-Parameter
  if (text.startsWith("/start login_")) {
    const requestedUsername = text.replace("/start login_", "").trim();

    if (
      from.username &&
      from.username.toLowerCase() === requestedUsername.toLowerCase()
    ) {
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
      let portalInfo: { accessCode: string; isNew: boolean } = {
        accessCode: "",
        isNew: false,
      };
      try {
        const existingClient = await getPortalClientByTelegram(
          from.username.toLowerCase(),
        );
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
        console.error("Failed to create portal client:", err);
      }

      const portalMessage = portalInfo.accessCode
        ? portalInfo.isNew
          ? `\n\n*Dein Kundenportal wurde erstellt!*\n` +
            `Portal: portal.agentflowm.com\n` +
            `Zugangscode: \`${portalInfo.accessCode}\`\n\n` +
            `Speichere diesen Code sicher!`
          : `\n\n*Dein Kundenportal*\n` +
            `Portal: portal.agentflowm.com\n` +
            `Zugangscode: \`${portalInfo.accessCode}\``
        : "";

      await sendTelegramMessage(
        chatId,
        `*Anmeldung erfolgreich!*\n\n` +
          `Hallo ${from.first_name || from.username}! Du bist jetzt angemeldet.\n\n` +
          `Du erhältst hier Updates zu:\n` +
          `• Neuen Projekten\n` +
          `• Status-Updates\n` +
          `• Wichtigen Benachrichtigungen` +
          portalMessage +
          `\n\nKehre jetzt zur Website zurück.`,
      );

      console.log(`Login verified for @${from.username}`);
    } else {
      await sendTelegramMessage(
        chatId,
        `*Anmeldung fehlgeschlagen*\n\n` +
          `Der angeforderte Username (@${requestedUsername}) stimmt nicht mit deinem Telegram-Account überein.\n\n` +
          `Dein Telegram-Username: @${from.username || "nicht gesetzt"}\n\n` +
          `Bitte versuche es erneut mit dem korrekten Username.`,
      );
    }
  }
  // /start ohne Parameter - Generiere Login-Code
  else if (text === "/start") {
    if (!from.username) {
      await sendTelegramMessage(
        chatId,
        `*Telegram-Username fehlt*\n\n` +
          `Du benötigst einen Telegram-Username um dich anzumelden.\n\n` +
          `Gehe zu: Einstellungen → Benutzername\n` +
          `Lege einen Username fest und versuche es erneut.`,
      );
      return;
    }

    // Generiere Login-Code
    const code = generateLoginCode();

    // Speichere Code mit User-Daten
    saveLoginCode(code, {
      chatId,
      username: from.username.toLowerCase(),
      firstName: from.first_name,
      telegramId: from.id,
    });

    await sendTelegramMessage(
      chatId,
      `*Dein Login-Code*\n\n` +
        `\`${code}\`\n\n` +
        `Gib diesen Code auf der Website ein.\n` +
        `Der Code ist 5 Minuten gültig.\n\n` +
        `agentflowm.com/anmelden`,
    );

    console.log(`Login code ${code} generated for @${from.username}`);
  }
  // /login oder /code - Auch Code generieren
  else if (text === "/login" || text === "/code") {
    if (!from.username) {
      await sendTelegramMessage(
        chatId,
        `*Telegram-Username fehlt*\n\n` +
          `Du benötigst einen Telegram-Username.`,
      );
      return;
    }

    const code = generateLoginCode();
    saveLoginCode(code, {
      chatId,
      username: from.username.toLowerCase(),
      firstName: from.first_name,
      telegramId: from.id,
    });

    await sendTelegramMessage(
      chatId,
      `*Neuer Login-Code*\n\n` +
        `\`${code}\`\n\n` +
        `Gib diesen Code auf der Website ein.\n` +
        `Der Code ist 5 Minuten gültig.`,
    );
  }
  // /status
  else if (text === "/status") {
    const user = from.username
      ? authenticatedUsers.get(from.username.toLowerCase())
      : null;

    if (user) {
      await sendTelegramMessage(
        chatId,
        `*Du bist angemeldet*\n\n` +
          `Username: @${user.username}\n` +
          `Angemeldet seit: ${user.authDate.toLocaleDateString("de-DE")}`,
      );
    } else {
      await sendTelegramMessage(
        chatId,
        `*Du bist nicht angemeldet*\n\n` +
          `Gehe auf agentflowm.com/anmelden um dich anzumelden.`,
      );
    }
  }
  // /hilfe
  else if (text === "/hilfe" || text === "/help") {
    await sendTelegramMessage(
      chatId,
      `*Hilfe*\n\n` +
        `Verfügbare Befehle:\n\n` +
        `/start - Willkommensnachricht\n` +
        `/status - Anmeldestatus prüfen\n` +
        `/hilfe - Diese Hilfe anzeigen\n\n` +
        `Bei Fragen: kontakt@agentflowm.com`,
    );
  }
}

export async function GET() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN not configured" },
      { status: 500 },
    );
  }

  try {
    // Hole Updates von Telegram
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=0`,
    );
    const data = await response.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: "Telegram API error", details: data },
        { status: 500 },
      );
    }

    const updates = data.result || [];
    let processed = 0;

    for (const update of updates) {
      lastUpdateId = Math.max(lastUpdateId, update.update_id);
      await processUpdate(update);
      processed++;
    }

    return NextResponse.json({
      success: true,
      processed,
      lastUpdateId,
      pendingLogins: Array.from(pendingLogins.entries()).map(([k, v]) => ({
        username: k,
        verified: v.verified,
      })),
    });
  } catch (error) {
    console.error("Polling error:", error);
    return NextResponse.json({ error: "Polling failed" }, { status: 500 });
  }
}
