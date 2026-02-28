import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    let query = db.from("portal_emails")
      .select(`*, client:portal_clients(id, name, email)`)
      .order("sent_at", { ascending: false })
      .limit(limit);

    if (client_id) {
      query = query.eq("client_id", parseInt(client_id, 10));
    }

    const { data: emails, error } = await query;

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Stats
    const stats = {
      total: emails?.length || 0,
      opened: emails?.filter(e => e.opened_at).length || 0,
      clicked: emails?.filter(e => e.clicked_at).length || 0,
      openRate: emails?.length ? Math.round((emails.filter(e => e.opened_at).length / emails.length) * 100) : 0,
    };

    return NextResponse.json({ emails: emails || [], stats });
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

    let emailHtml = html;
    let emailSubject = subject;

    // Template laden wenn angegeben
    if (template_id) {
      const { data: template } = await db
        .from("portal_email_templates")
        .select("*")
        .eq("id", template_id)
        .single();

      if (template) {
        emailHtml = template.body;
        emailSubject = template.subject;

        // Variablen ersetzen
        if (variables) {
          for (const [key, value] of Object.entries(variables)) {
            emailHtml = emailHtml.replace(new RegExp(`{{${key}}}`, "g"), value as string);
            emailSubject = emailSubject.replace(new RegExp(`{{${key}}}`, "g"), value as string);
          }
        }
      }
    }

    // Tracking Pixel einfügen
    const trackingId = `email-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    if (track_opens !== false && emailHtml) {
      emailHtml += `<img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de'}/api/emails/track/${trackingId}/open" width="1" height="1" style="display:none" />`;
    }

    // Email in DB speichern
    const { data: emailRecord, error: dbError } = await db
      .from("portal_emails")
      .insert({
        tracking_id: trackingId,
        to_email: Array.isArray(to) ? to.join(", ") : to,
        subject: emailSubject,
        body: emailHtml,
        client_id: client_id || null,
        template_id: template_id || null,
        scheduled_at: schedule_at || null,
        sent_at: schedule_at ? null : new Date().toISOString(),
        status: schedule_at ? "scheduled" : "sending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Email DB error:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Email senden (wenn nicht geplant)
    if (!schedule_at && resend) {
      try {
        const result = await resend.emails.send({
          from: "AgentFlowMarketing <noreply@agentflowm.de>",
          to: Array.isArray(to) ? to : [to],
          subject: emailSubject,
          html: emailHtml,
          text: text || undefined,
        });

        // Status aktualisieren
        await db
          .from("portal_emails")
          .update({ status: "sent", resend_id: result.data?.id })
          .eq("id", emailRecord.id);

        return NextResponse.json({ 
          success: true, 
          email: emailRecord,
          resend_id: result.data?.id 
        });
      } catch (sendError) {
        await db
          .from("portal_emails")
          .update({ status: "failed", error: String(sendError) })
          .eq("id", emailRecord.id);

        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, email: emailRecord });
  } catch (error) {
    console.error("Email POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
