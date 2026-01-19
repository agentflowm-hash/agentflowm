import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/portal/auth";
import {
  getClientProject,
  getProjectMessages,
  addMessage,
  markMessagesAsRead,
} from "@/lib/portal/db";

// GET - Alle Nachrichten abrufen
export async function GET() {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = getClientProject(client.id);

    if (!project) {
      return NextResponse.json(
        { error: "Kein Projekt gefunden" },
        { status: 404 },
      );
    }

    const messages = getProjectMessages(project.id);

    // Format messages for frontend
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      from: msg.sender_type === "client" ? "Sie" : msg.sender_name,
      senderType: msg.sender_type,
      text: msg.message,
      time: formatTime(msg.created_at),
      unread: msg.is_read === 0 && msg.sender_type === "admin",
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Gerade eben";
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tagen`;
    return date.toLocaleDateString("de-DE");
  } catch {
    return dateStr;
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Nachricht erforderlich" },
        { status: 400 },
      );
    }

    const project = getClientProject(client.id);

    if (!project) {
      return NextResponse.json(
        { error: "Kein Projekt gefunden" },
        { status: 404 },
      );
    }

    const newMessage = addMessage(
      project.id,
      "client",
      client.name,
      message.trim(),
    );

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        from: "Sie",
        senderType: "client",
        text: newMessage.message,
        time: "Gerade eben",
        unread: false,
      },
    });
  } catch (error) {
    console.error("Message send error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

export async function PATCH() {
  try {
    const client = await getSession();

    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = getClientProject(client.id);

    if (!project) {
      return NextResponse.json(
        { error: "Kein Projekt gefunden" },
        { status: 404 },
      );
    }

    markMessagesAsRead(project.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
