import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Alle Notifications
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let query = db.from("portal_notifications")
      .select(`*, project:portal_projects(id, name), client:portal_clients(id, name)`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unread) {
      query = query.is("read_at", null);
    }

    const { data: notifications, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const unreadCount = notifications?.filter(n => !n.read_at).length || 0;

    return NextResponse.json({ 
      notifications: notifications || [],
      unread_count: unreadCount
    });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Notification erstellen & senden
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      title, 
      message, 
      type, // info, warning, success, error, deadline, message, approval
      channels, // ["telegram", "email", "push", "whatsapp"]
      project_id,
      client_id,
      action_url,
      priority, // low, normal, high, urgent
      telegram_chat_id,
      email_to
    } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    }

    // Notification in DB speichern
    const { data: notification, error } = await db
      .from("portal_notifications")
      .insert({
        title,
        message,
        type: type || "info",
        channels: channels || ["push"],
        project_id: project_id || null,
        client_id: client_id || null,
        action_url: action_url || null,
        priority: priority || "normal",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const results: Record<string, any> = { notification };

    // Telegram senden
    if (channels?.includes("telegram") && process.env.TELEGRAM_BOT_TOKEN) {
      const chatId = telegram_chat_id || process.env.TELEGRAM_ADMIN_CHAT_ID;
      if (chatId) {
        try {
          const emoji = type === "success" ? "✅" : type === "warning" ? "⚠️" : type === "error" ? "❌" : type === "deadline" ? "⏰" : "📢";
          const text = `${emoji} *${title}*\n\n${message}${action_url ? `\n\n🔗 [Öffnen](${action_url})` : ""}`;
          
          const tgRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "Markdown",
              disable_web_page_preview: true,
            }),
          });
          results.telegram = await tgRes.json();
        } catch (e) {
          results.telegram = { error: String(e) };
        }
      }
    }

    // WhatsApp senden (via ClawdBot Gateway)
    if (channels?.includes("whatsapp") && process.env.CLAWDBOT_GATEWAY_URL) {
      try {
        const waRes = await fetch(`${process.env.CLAWDBOT_GATEWAY_URL}/api/whatsapp/send`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.CLAWDBOT_TOKEN}`
          },
          body: JSON.stringify({
            to: body.whatsapp_to || process.env.WHATSAPP_ADMIN_NUMBER,
            message: `${title}\n\n${message}`,
          }),
        });
        results.whatsapp = await waRes.json();
      } catch (e) {
        results.whatsapp = { error: String(e) };
      }
    }

    return NextResponse.json({ success: true, ...results });
  } catch (error) {
    console.error("Notification POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH - Notifications als gelesen markieren
export async function PATCH(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { ids, all } = body;

    if (all) {
      await db
        .from("portal_notifications")
        .update({ read_at: new Date().toISOString() })
        .is("read_at", null);
    } else if (ids?.length) {
      await db
        .from("portal_notifications")
        .update({ read_at: new Date().toISOString() })
        .in("id", ids);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
