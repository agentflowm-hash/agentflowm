import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM POLLING (PORTAL)
// Pollt den Haupt-Bot und verarbeitet Nachrichten
// ═══════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is not set");
}
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

let lastUpdateId = 0;

function getDb() {
  const dbPath = path.join(process.cwd(), "..", "data", "agentflow.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendMessage(chatId: number, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });
    return (await res.json()).ok === true;
  } catch {
    return false;
  }
}

async function processMessage(message: any): Promise<void> {
  const chatId = message.chat?.id;
  const text = message.text || "";
  const from = message.from;

  if (!chatId || !from) return;

  // /start oder /code
  if (
    text === "/start" ||
    text.startsWith("/start ") ||
    text === "/code" ||
    text === "/login"
  ) {
    if (!from.username) {
      await sendMessage(
        chatId,
        `❌ *Kein Telegram-Username*\n\nDu benötigst einen Username um dich anzumelden.`,
      );
      return;
    }

    const db = getDb();
    const code = generateCode();

    // Lösche alte Codes
    db.prepare(
      `DELETE FROM login_codes WHERE telegram_username = ? OR expires_at < datetime('now')`,
    ).run(from.username.toLowerCase());

    // Neuer Code
    db.prepare(
      `
      INSERT INTO login_codes (code, telegram_id, telegram_username, first_name, chat_id, expires_at)
      VALUES (?, ?, ?, ?, ?, datetime('now', '+5 minutes'))
    `,
    ).run(
      code,
      from.id,
      from.username.toLowerCase(),
      from.first_name || null,
      chatId,
    );

    db.close();

    await sendMessage(
      chatId,
      `🔐 *Dein Login-Code:*\n\n\`${code}\`\n\nGib diesen Code im Portal ein.\nGültig für 5 Minuten.`,
    );

    console.log(`📱 Code ${code} sent to @${from.username}`);
    return;
  }

  // /hilfe
  if (text === "/hilfe" || text === "/help") {
    await sendMessage(
      chatId,
      `ℹ️ *AgentFlow Bot*\n\n/start - Login-Code anfordern\n/code - Neuen Code\n/hilfe - Diese Hilfe`,
    );
    return;
  }

  // Default
  await sendMessage(chatId, `👋 Tippe /start für einen Login-Code.`);
}

export async function GET() {
  try {
    const res = await fetch(
      `${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=0`,
    );
    const data = await res.json();

    if (!data.ok) {
      return NextResponse.json(
        { error: "Telegram API error" },
        { status: 500 },
      );
    }

    let processed = 0;
    for (const update of data.result || []) {
      lastUpdateId = Math.max(lastUpdateId, update.update_id);
      if (update.message) {
        await processMessage(update.message);
        processed++;
      }
    }

    return NextResponse.json({ success: true, processed });
  } catch (error) {
    console.error("Poll error:", error);
    return NextResponse.json({ error: "Poll failed" }, { status: 500 });
  }
}
