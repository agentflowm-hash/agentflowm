import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

// Maximale Nachrichtenlänge
const MAX_MESSAGE_LENGTH = 5000;

// GET - Alle Nachrichten eines Projekts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    const messages = db
      .prepare(
        `
      SELECT * FROM portal_messages WHERE project_id = ? ORDER BY created_at DESC
    `,
      )
      .all(projectId);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Messages GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neue Nachricht senden (vom Admin)
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
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { message, sender_name } = body;

    // Validierung
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 },
      );
    }
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)` },
        { status: 400 },
      );
    }

    const senderName =
      sender_name && typeof sender_name === "string"
        ? sender_name.trim().slice(0, 100)
        : "Alex Shaer";

    const db = getSqliteDb();

    // Prüfen ob Projekt existiert
    const project = db
      .prepare("SELECT * FROM portal_projects WHERE id = ?")
      .get(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Nachricht erstellen
    const result = db
      .prepare(
        `
      INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
      VALUES (?, 'admin', ?, ?, 0)
    `,
      )
      .run(projectId, senderName, trimmedMessage);

    const newMessage = db
      .prepare("SELECT * FROM portal_messages WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("Message POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
