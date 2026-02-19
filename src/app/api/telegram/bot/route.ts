import { NextResponse } from "next/server";
import {
  generateLoginCode,
  saveLoginCode,
  createReferralFromTelegram,
  getReferralsByTelegram,
  getReferralStats,
} from "@/lib/database";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM BOT API
// Login-Codes, Empfehlungen und Benachrichtigungen
// ═══════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || "1744361953"; // Admin Chat ID

let lastUpdateId = 0;

// Speichere aktive Empfehlungs-Sessions (User die gerade eine Empfehlung eingeben)
const referralSessions = new Map<
  number,
  {
    step: "name" | "phone" | "context" | "confirm";
    data: {
      referrerName: string;
      referrerUsername: string;
      referredName?: string;
      referredPhone?: string;
      context?: string;
    };
  }
>();

// Sende Nachricht an User
async function sendMessage(
  chatId: number,
  text: string,
  options?: { reply_markup?: any },
): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
        ...options,
      }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    console.error("Telegram sendMessage error:", error);
    return false;
  }
}

// Beantworte Callback Query (Button-Klick)
async function answerCallbackQuery(
  callbackQueryId: string,
  text?: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: false,
      }),
    });
    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    console.error("Telegram answerCallbackQuery error:", error);
    return false;
  }
}

// Verarbeite Button-Klicks (Callback Queries)
async function processCallbackQuery(callbackQuery: any): Promise<void> {
  const chatId = callbackQuery.message?.chat?.id;
  const callbackId = callbackQuery.id;
  const data = callbackQuery.data;
  const from = callbackQuery.from;

  if (!chatId || !data) return;

  console.log(`🔘 Button click from @${from?.username || "unknown"}: ${data}`);

  // Beantworte den Callback sofort
  await answerCallbackQuery(callbackId);

  // Handle verschiedene Button-Aktionen
  switch (data) {
    case "portal":
    case "portal_zugang":
      await sendMessage(
        chatId,
        `🔐 *Portal-Zugang*\n\n` +
          `Dein Kundenportal: https://portal-agentflowm.de\n\n` +
          `Tippe /code um einen Login-Code zu erhalten.`,
      );
      break;

    case "pakete":
    case "pakete_ansehen":
      await sendMessage(
        chatId,
        `📦 *Unsere Pakete*\n\n` +
          `Entdecke unsere Automatisierungs-Pakete:\n` +
          `👉 https://agentflowm.de/pakete\n\n` +
          `• *Starter* - Für den Einstieg\n` +
          `• *Professional* - Für wachsende Unternehmen\n` +
          `• *Enterprise* - Für maximale Automatisierung`,
      );
      break;

    case "website_check":
    case "websitecheck":
      await sendMessage(
        chatId,
        `🔍 *Kostenloser Website-Check*\n\n` +
          `Lass deine Website analysieren:\n` +
          `👉 https://agentflowm.de/website-check\n\n` +
          `Du erhältst einen detaillierten Bericht über:\n` +
          `• Performance\n` +
          `• SEO-Optimierung\n` +
          `• Verbesserungspotential`,
      );
      break;

    case "termin":
    case "termin_buchen":
      await sendMessage(
        chatId,
        `📅 *Termin buchen*\n\n` +
          `Buche ein kostenloses Beratungsgespräch:\n` +
          `👉 https://calendly.com/agentflowm/15min\n\n` +
          `Wir besprechen deine Anforderungen und zeigen dir, wie Automatisierung dein Business voranbringt.`,
      );
      break;

    case "hilfe":
    case "help":
      await sendMessage(
        chatId,
        `ℹ️ *AgentFlow Bot - Hilfe*\n\n` +
          `*Login:*\n` +
          `/start - Willkommen & Login-Code\n` +
          `/code - Neuer Login-Code\n\n` +
          `*Empfehlungen:*\n` +
          `/empfehlen - Neue Empfehlung abgeben\n` +
          `/status - Deine Empfehlungen anzeigen\n\n` +
          `*Sonstiges:*\n` +
          `/hilfe - Diese Hilfe\n\n` +
          `Bei Fragen: kontakt@agentflowm.com`,
      );
      break;

    case "faq":
      await sendMessage(
        chatId,
        `❓ *Häufige Fragen*\n\n` +
          `*Was ist AgentFlow?*\n` +
          `Wir automatisieren Geschäftsprozesse mit KI und n8n Workflows.\n\n` +
          `*Was kostet es?*\n` +
          `Pakete ab 499€/Monat. Details: /pakete\n\n` +
          `*Wie lange dauert die Umsetzung?*\n` +
          `Je nach Projekt 1-4 Wochen.\n\n` +
          `*Kann ich vorher testen?*\n` +
          `Ja! Buche ein kostenloses Beratungsgespräch.`,
      );
      break;

    case "kontakt":
    case "contact":
      await sendMessage(
        chatId,
        `📞 *Kontakt*\n\n` +
          `*E-Mail:* kontakt@agentflowm.com\n` +
          `*Termin:* https://calendly.com/agentflowm/15min\n` +
          `*Website:* https://agentflowm.de\n\n` +
          `Oder schreib einfach hier im Chat!`,
      );
      break;

    default:
      await sendMessage(
        chatId,
        `👋 Tippe /hilfe für alle Befehle.`,
      );
  }
}

// Sende Nachricht an Admin
async function notifyAdmin(text: string): Promise<void> {
  if (ADMIN_CHAT_ID) {
    await sendMessage(parseInt(ADMIN_CHAT_ID), text);
  }
}

// Status-Emoji
function getStatusEmoji(status: string): string {
  switch (status) {
    case "pending":
      return "⏳";
    case "contacted":
      return "📞";
    case "converted":
      return "✅";
    case "rejected":
      return "❌";
    default:
      return "❓";
  }
}

// Status-Text
function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "Ausstehend";
    case "contacted":
      return "Kontaktiert";
    case "converted":
      return "Erfolgreich";
    case "rejected":
      return "Abgelehnt";
    default:
      return status;
  }
}

// Verarbeite eingehende Nachricht
async function processMessage(message: any): Promise<void> {
  const chatId = message.chat?.id;
  const text = message.text || "";
  const from = message.from;

  if (!chatId || !from) return;

  console.log(
    `📨 Telegram message from @${from.username || "unknown"}: ${text}`,
  );

  // Prüfe ob User in einer Empfehlungs-Session ist
  const session = referralSessions.get(chatId);
  if (session && !text.startsWith("/")) {
    await handleReferralSession(chatId, from, text, session);
    return;
  }

  // ════════════════════════════════════════════════════════════
  //                         COMMANDS
  // ════════════════════════════════════════════════════════════

  // /start Command
  if (text === "/start" || text.startsWith("/start ")) {
    if (!from.username) {
      await sendMessage(
        chatId,
        `❌ *Kein Telegram-Username*\n\n` +
          `Du benötigst einen Telegram-Username um dich anzumelden.\n\n` +
          `So richtest du ihn ein:\n` +
          `1. Öffne Telegram Einstellungen\n` +
          `2. Tippe auf "Benutzername"\n` +
          `3. Wähle einen Namen\n\n` +
          `Danach komm zurück und tippe /start`,
      );
      return;
    }

    const code = generateLoginCode();
    const saved = await saveLoginCode({
      code,
      telegramId: from.id,
      telegramUsername: from.username,
      firstName: from.first_name,
      chatId,
    });

    if (saved) {
      await sendMessage(
        chatId,
        `👋 *Willkommen bei AgentFlow!*\n\n` +
          `Dein Login-Code: \`${code}\`\n` +
          `_(5 Minuten gültig)_\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `*Verfügbare Befehle:*\n\n` +
          `🔐 /code - Neuer Login-Code\n` +
          `🎁 /empfehlen - Jemanden empfehlen\n` +
          `📊 /status - Deine Empfehlungen\n` +
          `❓ /hilfe - Alle Befehle`,
      );
    }
    return;
  }

  // /code oder /login Command
  if (text === "/code" || text === "/login") {
    if (!from.username) {
      await sendMessage(chatId, `❌ Du benötigst einen Telegram-Username.`);
      return;
    }

    const code = generateLoginCode();
    const saved = await saveLoginCode({
      code,
      telegramId: from.id,
      telegramUsername: from.username,
      firstName: from.first_name,
      chatId,
    });

    if (saved) {
      await sendMessage(
        chatId,
        `🔐 *Neuer Login-Code:*\n\n\`${code}\`\n\n_Gültig für 5 Minuten._`,
      );
    }
    return;
  }

  // /empfehlen Command - Starte Empfehlungs-Flow
  if (text === "/empfehlen" || text === "/refer" || text === "/empfehlung") {
    if (!from.username) {
      await sendMessage(
        chatId,
        `❌ Du benötigst einen Telegram-Username um Empfehlungen abzugeben.`,
      );
      return;
    }

    // Starte Session
    referralSessions.set(chatId, {
      step: "name",
      data: {
        referrerName: from.first_name || from.username,
        referrerUsername: from.username,
      },
    });

    await sendMessage(
      chatId,
      `🎁 *Neue Empfehlung*\n\n` +
        `Super, dass du jemanden empfehlen möchtest!\n` +
        `Für erfolgreiche Empfehlungen erhältst du eine Provision.\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `*Schritt 1/3*\n` +
        `Wie heißt die Person, die du empfehlen möchtest?\n\n` +
        `_(Tippe /abbrechen zum Beenden)_`,
    );
    return;
  }

  // /status Command - Zeige Empfehlungs-Status
  if (text === "/status" || text === "/meine" || text === "/empfehlungen") {
    if (!from.username) {
      await sendMessage(chatId, `❌ Du benötigst einen Telegram-Username.`);
      return;
    }

    const referrals = await getReferralsByTelegram(from.username);
    const stats = await getReferralStats(from.username);

    if (referrals.length === 0) {
      await sendMessage(
        chatId,
        `📊 *Deine Empfehlungen*\n\n` +
          `Du hast noch keine Empfehlungen abgegeben.\n\n` +
          `Tippe /empfehlen um jemanden zu empfehlen und Provision zu verdienen! 💰`,
      );
      return;
    }

    let statusMessage = `📊 *Deine Empfehlungen*\n\n`;
    statusMessage += `Gesamt: *${stats.total}*\n`;
    statusMessage += `Erfolgreich: *${stats.converted}*\n`;
    statusMessage += `Ausstehend: *${stats.pending}*\n`;
    if (stats.commission > 0) {
      statusMessage += `Verdient: *${stats.commission}€*\n`;
    }
    statusMessage += `\n━━━━━━━━━━━━━━━━━━━━\n\n`;

    // Zeige letzte 5 Empfehlungen
    const recentReferrals = referrals.slice(0, 5);
    for (const ref of recentReferrals) {
      statusMessage += `${getStatusEmoji(ref.status)} *${ref.referred_name}*\n`;
      statusMessage += `   Status: ${getStatusText(ref.status)}\n`;
      if (ref.commission_amount && ref.commission_status === "paid") {
        statusMessage += `   Provision: ${ref.commission_amount}€ ✅\n`;
      }
      statusMessage += `\n`;
    }

    if (referrals.length > 5) {
      statusMessage += `_...und ${referrals.length - 5} weitere_\n`;
    }

    await sendMessage(chatId, statusMessage);
    return;
  }

  // /abbrechen Command
  if (text === "/abbrechen" || text === "/cancel") {
    if (referralSessions.has(chatId)) {
      referralSessions.delete(chatId);
      await sendMessage(chatId, `❌ Empfehlung abgebrochen.`);
    } else {
      await sendMessage(chatId, `ℹ️ Es gibt nichts abzubrechen.`);
    }
    return;
  }

  // /hilfe Command
  if (text === "/hilfe" || text === "/help") {
    await sendMessage(
      chatId,
      `ℹ️ *AgentFlow Bot - Hilfe*\n\n` +
        `*Login:*\n` +
        `/start - Willkommen & Login-Code\n` +
        `/code - Neuer Login-Code\n\n` +
        `*Empfehlungen:*\n` +
        `/empfehlen - Neue Empfehlung abgeben\n` +
        `/status - Deine Empfehlungen anzeigen\n` +
        `/abbrechen - Aktuelle Eingabe abbrechen\n\n` +
        `*Sonstiges:*\n` +
        `/hilfe - Diese Hilfe\n\n` +
        `Bei Fragen: kontakt@agentflowm.com`,
    );
    return;
  }

  // ════════════════════════════════════════════════════════════
  //              REPLY KEYBOARD BUTTONS (Text-basiert)
  // ════════════════════════════════════════════════════════════

  // Portal-Zugang Button
  if (text.includes("Portal-Zugang") || text.includes("Portal")) {
    await sendMessage(
      chatId,
      `🔐 *Portal-Zugang*\n\n` +
        `Dein Kundenportal: https://portal-agentflowm.de\n\n` +
        `Tippe /code um einen Login-Code zu erhalten.`,
    );
    return;
  }

  // Pakete ansehen Button
  if (text.includes("Pakete ansehen") || text.includes("Pakete")) {
    await sendMessage(
      chatId,
      `📦 *Unsere Pakete*\n\n` +
        `Entdecke unsere Automatisierungs-Pakete:\n` +
        `👉 https://agentflowm.de/pakete\n\n` +
        `• *Starter* - Für den Einstieg\n` +
        `• *Professional* - Für wachsende Unternehmen\n` +
        `• *Enterprise* - Für maximale Automatisierung`,
    );
    return;
  }

  // Website-Check Button
  if (text.includes("Website-Check") || text.includes("Websitecheck")) {
    await sendMessage(
      chatId,
      `🔍 *Kostenloser Website-Check*\n\n` +
        `Lass deine Website analysieren:\n` +
        `👉 https://agentflowm.de/website-check\n\n` +
        `Du erhältst einen detaillierten Bericht über:\n` +
        `• Performance\n` +
        `• SEO-Optimierung\n` +
        `• Verbesserungspotential`,
    );
    return;
  }

  // Termin buchen Button
  if (text.includes("Termin buchen") || text.includes("Termin")) {
    await sendMessage(
      chatId,
      `📅 *Termin buchen*\n\n` +
        `Buche ein kostenloses Beratungsgespräch:\n` +
        `👉 https://calendly.com/agentflowm/15min\n\n` +
        `Wir besprechen deine Anforderungen und zeigen dir, wie Automatisierung dein Business voranbringt.`,
    );
    return;
  }

  // Kontakt Button
  if (text.includes("Kontakt")) {
    await sendMessage(
      chatId,
      `📞 *Kontakt*\n\n` +
        `*E-Mail:* kontakt@agentflowm.com\n` +
        `*Termin:* https://calendly.com/agentflowm/15min\n` +
        `*Website:* https://agentflowm.de\n\n` +
        `Oder schreib einfach hier im Chat!`,
    );
    return;
  }

  // FAQ Button
  if (text.includes("FAQ")) {
    await sendMessage(
      chatId,
      `❓ *Häufige Fragen*\n\n` +
        `*Was ist AgentFlow?*\n` +
        `Wir automatisieren Geschäftsprozesse mit KI und n8n Workflows.\n\n` +
        `*Was kostet es?*\n` +
        `Pakete ab 499€/Monat. Details: https://agentflowm.de/pakete\n\n` +
        `*Wie lange dauert die Umsetzung?*\n` +
        `Je nach Projekt 1-4 Wochen.\n\n` +
        `*Kann ich vorher testen?*\n` +
        `Ja! Buche ein kostenloses Beratungsgespräch.`,
    );
    return;
  }

  // Hilfe Button
  if (text.includes("Hilfe") && !text.startsWith("/")) {
    await sendMessage(
      chatId,
      `ℹ️ *AgentFlow Bot - Hilfe*\n\n` +
        `*Login:*\n` +
        `/start - Willkommen & Login-Code\n` +
        `/code - Neuer Login-Code\n\n` +
        `*Empfehlungen:*\n` +
        `/empfehlen - Neue Empfehlung abgeben\n` +
        `/status - Deine Empfehlungen anzeigen\n\n` +
        `*Buttons unten nutzen für:*\n` +
        `🔐 Portal-Zugang\n` +
        `📦 Pakete ansehen\n` +
        `🔍 Website-Check\n` +
        `📅 Termin buchen\n\n` +
        `Bei Fragen: kontakt@agentflowm.com`,
    );
    return;
  }

  // Unbekannte Nachricht
  await sendMessage(
    chatId,
    `👋 Hallo ${from.first_name || "dort"}!\n\n` +
      `Tippe /hilfe für alle Befehle oder nutze die Buttons unten.`,
  );
}

// Handle Empfehlungs-Session
async function handleReferralSession(
  chatId: number,
  from: any,
  text: string,
  session: { step: string; data: any },
): Promise<void> {
  switch (session.step) {
    case "name":
      // Name der empfohlenen Person
      session.data.referredName = text.trim();
      session.step = "phone";
      referralSessions.set(chatId, session as any);

      await sendMessage(
        chatId,
        `✅ *${session.data.referredName}*\n\n` +
          `*Schritt 2/3*\n` +
          `Wie ist die Telefonnummer von ${session.data.referredName}?\n\n` +
          `_(Tippe /abbrechen zum Beenden)_`,
      );
      break;

    case "phone":
      // Telefonnummer
      session.data.referredPhone = text.trim();
      session.step = "context";
      referralSessions.set(chatId, session as any);

      await sendMessage(
        chatId,
        `✅ Telefon: *${session.data.referredPhone}*\n\n` +
          `*Schritt 3/3*\n` +
          `Warum denkst du, dass ${session.data.referredName} Interesse hat?\n` +
          `(z.B. "Braucht neue Website", "Sucht Automatisierung")\n\n` +
          `_(Tippe /abbrechen zum Beenden)_`,
      );
      break;

    case "context":
      // Kontext/Grund
      session.data.context = text.trim();

      // Erstelle Empfehlung in DB
      try {
        const referral = await createReferralFromTelegram({
          referrerTelegram: session.data.referrerUsername,
          referrerChatId: chatId,
          referrerName: session.data.referrerName,
          referredName: session.data.referredName,
          referredPhone: session.data.referredPhone,
          context: session.data.context,
        });

        // Lösche Session
        referralSessions.delete(chatId);

        // Bestätigung an User
        await sendMessage(
          chatId,
          `🎉 *Empfehlung erfolgreich!*\n\n` +
            `Vielen Dank für deine Empfehlung!\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 *${referral.referred_name}*\n` +
            `📱 ${referral.referred_phone}\n` +
            `💬 ${referral.context}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `Wir melden uns bei ${referral.referred_name} und halten dich über den Status auf dem Laufenden.\n\n` +
            `Tippe /status um deine Empfehlungen zu sehen.`,
        );

        // Benachrichtige Admin
        await notifyAdmin(
          `🎁 *Neue Empfehlung!*\n\n` +
            `Von: @${session.data.referrerUsername} (${session.data.referrerName})\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 *${referral.referred_name}*\n` +
            `📱 ${referral.referred_phone}\n` +
            `💬 ${referral.context}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━\n\n` +
            `ID: #${referral.id}`,
        );

        console.log(
          `✅ Referral #${referral.id} created by @${session.data.referrerUsername}`,
        );
      } catch (error) {
        console.error("Failed to create referral:", error);
        referralSessions.delete(chatId);
        await sendMessage(
          chatId,
          `❌ Fehler beim Speichern. Bitte versuche es erneut mit /empfehlen`,
        );
      }
      break;
  }
}

// GET - Poll für neue Updates
export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: "Bot token not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=0&allowed_updates=["message"]`,
    );
    const data = await res.json();

    if (!data.ok) {
      console.error("Telegram API error:", data);
      return NextResponse.json(
        { error: "Telegram API error", details: data },
        { status: 500 },
      );
    }

    const updates = data.result || [];
    let processed = 0;

    for (const update of updates) {
      lastUpdateId = Math.max(lastUpdateId, update.update_id);
      if (update.message) {
        await processMessage(update.message);
        processed++;
      }
    }

    return NextResponse.json({ success: true, processed, lastUpdateId });
  } catch (error) {
    console.error("Polling error:", error);
    return NextResponse.json({ error: "Polling failed" }, { status: 500 });
  }
}

// POST - Webhook
export async function POST(request: Request) {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { error: "Bot token not configured" },
      { status: 500 },
    );
  }

  try {
    const update = await request.json();

    // Verarbeite Nachrichten
    if (update.message) {
      await processMessage(update.message);
    }

    // Verarbeite Button-Klicks (Callback Queries)
    if (update.callback_query) {
      await processCallbackQuery(update.callback_query);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
