import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// ═══════════════════════════════════════════════════════════════
//                    SEND ACCESS CODE VIA TELEGRAM
// Sendet den Portal-Zugangscode an den Kunden per Telegram
// ═══════════════════════════════════════════════════════════════

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const PORTAL_URL = process.env.PORTAL_URL || "https://portal.agentflowm.com";

async function sendTelegramMessage(
  chatId: number,
  text: string,
): Promise<boolean> {
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
    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    return false;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    // Hole Kunden-Daten
    const { data: client, error: clientError } = await db
      .from("portal_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (!client.telegram_id) {
      return NextResponse.json(
        {
          error:
            "Kunde hat keine Telegram-ID. Der Kunde muss sich erst mit Telegram verbinden.",
        },
        { status: 400 },
      );
    }

    // Sende Zugangscode + Portal-Link per Telegram
    const portalLink = `${PORTAL_URL}/login/${client.access_code}`;

    const message = `🔐 *Willkommen im AgentFlow Kundenportal!*

Hallo ${client.name}!

Dein Projekt wurde eingerichtet. Hier ist dein persönlicher Zugang:

📋 *Zugangscode:* \`${client.access_code}\`

🔗 *Dein Portal-Link:*
${portalLink}

Klicke einfach auf den Link oben um dich einzuloggen!

Im Portal kannst du:
• Den Projektfortschritt verfolgen
• Nachrichten senden
• Dateien hochladen
• Designs freigeben

Bei Fragen sind wir für dich da.

Dein AgentFlow Team`;

    const sent = await sendTelegramMessage(client.telegram_id, message);

    if (sent) {
      return NextResponse.json({
        success: true,
        message: "Zugangscode wurde per Telegram gesendet",
      });
    } else {
      return NextResponse.json(
        {
          error:
            "Nachricht konnte nicht gesendet werden. Telegram-Verbindung prüfen.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
