import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

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

    const { data: messages, error } = await db
      .from("portal_messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
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
        : "M. Ashaer";

    // Prüfen ob Projekt existiert
    const { data: project, error: projectError } = await db
      .from("portal_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Nachricht erstellen
    const { data: newMessage, error: insertError } = await db
      .from("portal_messages")
      .insert({
        project_id: projectId,
        sender_type: "admin",
        sender_name: senderName,
        message: trimmedMessage,
        is_read: false,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // E-Mail-Benachrichtigung an Kunden senden
    if (process.env.SMTP_HOST && project.client_id) {
      try {
        const { data: client } = await db.from('portal_clients').select('email, name').eq('id', project.client_id).single();
        if (client?.email) {
          const nodemailer = (await import('nodemailer')).default;
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });
          await transporter.sendMail({
            from: `"AgentFlowMarketing" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
            to: client.email,
            subject: `Neue Nachricht zu Ihrem Projekt "${project.name}"`,
            html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#111827;color:#fff;border-radius:16px;">
              <h2 style="color:#FC682C;margin:0 0 16px;">Neue Nachricht</h2>
              <p>Hallo ${client.name.split(' ')[0]},</p>
              <p style="color:rgba(255,255,255,0.7);">${senderName} hat Ihnen eine Nachricht zu Ihrem Projekt <strong>"${project.name}"</strong> geschickt:</p>
              <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;margin:16px 0;">
                <p style="color:rgba(255,255,255,0.8);margin:0;white-space:pre-wrap;">${trimmedMessage.slice(0, 500)}</p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.agentflowm.de'}/login/${''}" style="display:inline-block;background:#FC682C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">Im Portal antworten</a>
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:24px;">AgentFlowMarketing</p>
            </div>`,
          });
        }
      } catch {
        // E-Mail-Fehler soll Nachricht nicht blockieren
      }
    }

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
