import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

// IONOS SMTP Transporter
const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp.ionos.de
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true für 465, false für 587
  auth: {
    user: process.env.SMTP_USER, // deine@email.de
    pass: process.env.SMTP_PASS, // dein Passwort
  },
}) : null;

// GET - Email History mit Tracking
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const client_id = searchParams.get("client_id");

    // Simple query without FK joins
    let query = db.from("portal_emails")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(limit);

    if (client_id) {
      query = query.eq("client_id", parseInt(client_id, 10));
    }

    const { data: emails, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Enrich with client names
    const enrichedEmails = await Promise.all((emails || []).map(async (email) => {
      let clientName = null;
      if (email.client_id) {
        const { data: client } = await db
          .from('portal_clients')
          .select('name, email')
          .eq('id', email.client_id)
          .single();
        if (client) clientName = client.name;
      }
      return { ...email, client_name: clientName };
    }));

    // Stats
    const stats = {
      total: enrichedEmails.length,
      opened: enrichedEmails.filter(e => e.opened_at).length,
      clicked: enrichedEmails.filter(e => e.clicked_at).length,
      openRate: enrichedEmails.length ? Math.round((enrichedEmails.filter(e => e.opened_at).length / enrichedEmails.length) * 100) : 0,
    };

    return NextResponse.json({ emails: enrichedEmails, stats });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Email senden
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      to, 
      subject, 
      html, 
      text,
      template_id,
      client_id,
      variables,
      schedule_at,
      track_opens,
      track_clicks
    } = body;

    if (!to || !subject) {
      return NextResponse.json({ error: "To and subject required" }, { status: 400 });
    }

    // Importiere Premium-Wrapper
    const { wrapEmailHTML } = await import('@/lib/email-templates');

    let emailHtml = html;
    let emailSubject = subject;

    // Client-Daten laden fuer Platzhalter-Ersetzung
    let clientVars: Record<string, string> = {};
    if (client_id) {
      const { data: client } = await db.from('portal_clients').select('name, email, company').eq('id', client_id).single();
      if (client) {
        clientVars = {
          name: client.name || '',
          firma: client.company || '',
          email: client.email || '',
        };
      }
    }
    // Manuelle Variablen ueberschreiben Client-Daten
    const allVars: Record<string, string> = { ...clientVars, ...(variables || {}) };

    // Template laden wenn angegeben
    if (template_id) {
      const { data: template } = await db
        .from("email_templates")
        .select("*")
        .eq("id", template_id)
        .single();

      if (template) {
        emailHtml = template.body;
        emailSubject = template.subject;
      }
    }

    // Platzhalter in Body + Subject ersetzen
    for (const [key, value] of Object.entries(allVars)) {
      if (value) {
        emailHtml = emailHtml.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
        emailSubject = emailSubject.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
      }
    }

    // Premium-Wrapper anwenden wenn Body kein vollstaendiges HTML ist
    if (emailHtml && !emailHtml.trim().startsWith('<!DOCTYPE') && !emailHtml.trim().startsWith('<html')) {
      emailHtml = wrapEmailHTML(emailHtml);
    }

    // Tracking Pixel einfuegen
    const trackingId = `email-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (track_opens !== false && emailHtml) {
      emailHtml += `<img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de'}/api/emails/track/${trackingId}/open" width="1" height="1" style="display:none" />`;
    }

    // Email in DB speichern (nur existierende Spalten)
    const { data: emailRecord, error: dbError } = await db
      .from("portal_emails")
      .insert({
        tracking_id: trackingId,
        to_email: Array.isArray(to) ? to.join(", ") : to,
        subject: emailSubject,
        body: emailHtml,
        client_id: client_id || null,
        sent_at: new Date().toISOString(),
        status: "sending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Email DB error:", dbError);
      return NextResponse.json({ error: "Database error: " + dbError.message }, { status: 500 });
    }

    // Email senden via SMTP
    if (transporter) {
      try {
        const result = await transporter.sendMail({
          from: process.env.EMAIL_FROM ? `AgentFlowMarketing <${process.env.EMAIL_FROM}>` : "AgentFlowMarketing <kontakt@agentflowm.de>",
          to: Array.isArray(to) ? to.join(", ") : to,
          subject: emailSubject,
          html: emailHtml,
          text: text || undefined,
        });

        // Status aktualisieren
        await db
          .from("portal_emails")
          .update({ status: "sent" })
          .eq("id", emailRecord.id);

        return NextResponse.json({
          success: true,
          email: emailRecord,
          message_id: result.messageId
        });
      } catch (sendError) {
        console.error("SMTP send error:", sendError);
        await db
          .from("portal_emails")
          .update({ status: "failed" })
          .eq("id", emailRecord.id);

        return NextResponse.json({ error: "SMTP Fehler: " + String(sendError) }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "SMTP nicht konfiguriert" }, { status: 500 });
    }
  } catch (error) {
    console.error("Email POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
