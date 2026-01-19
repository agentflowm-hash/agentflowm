import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const notifications: any[] = [];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Neue Leads (letzte 24 Stunden)
    const { data: recentLeads } = await db
      .from('leads')
      .select('id, name, email, created_at')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(10);

    for (const lead of recentLeads || []) {
      notifications.push({
        id: `lead-${lead.id}`,
        type: "lead",
        title: "Neuer Lead",
        description: `${lead.name} hat sich gemeldet`,
        time: formatRelativeTime(lead.created_at),
        createdAt: lead.created_at,
        link: `/leads/${lead.id}`,
      });
    }

    // Neue Website-Checks (letzte 24 Stunden)
    const { data: recentChecks } = await db
      .from('website_checks')
      .select('id, url, score_overall, created_at')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(10);

    for (const check of recentChecks || []) {
      const domain = check.url.replace(/^https?:\/\//, "").split("/")[0];
      notifications.push({
        id: `check-${check.id}`,
        type: "check",
        title: "Website-Check",
        description: `${domain} Score: ${check.score_overall}`,
        time: formatRelativeTime(check.created_at),
        createdAt: check.created_at,
        link: `/checks/${check.id}`,
      });
    }

    // Neue Empfehlungen (letzte 24 Stunden)
    const { data: recentReferrals } = await db
      .from('referrals')
      .select('id, referrer_name, referred_name, created_at')
      .gte('created_at', yesterday)
      .order('created_at', { ascending: false })
      .limit(10);

    for (const referral of recentReferrals || []) {
      notifications.push({
        id: `referral-${referral.id}`,
        type: "referral",
        title: "Neue Empfehlung",
        description: `Von ${referral.referrer_name}`,
        time: formatRelativeTime(referral.created_at),
        createdAt: referral.created_at,
        link: `/referrals/${referral.id}`,
      });
    }

    // Ungelesene Kundennachrichten
    const { data: unreadMessages } = await db
      .from('portal_messages')
      .select(`
        id,
        message,
        sender_name,
        created_at,
        project_id,
        portal_projects (
          id,
          name
        )
      `)
      .eq('sender_type', 'client')
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    for (const msg of unreadMessages || []) {
      const project = (msg as any).portal_projects;
      notifications.push({
        id: `message-${msg.id}`,
        type: "message",
        title: "Neue Kundennachricht",
        description: `${msg.sender_name}: ${msg.message.substring(0, 50)}${msg.message.length > 50 ? "..." : ""}`,
        time: formatRelativeTime(msg.created_at),
        createdAt: msg.created_at,
        link: `/clients?project=${msg.project_id}`,
        projectId: msg.project_id,
      });
    }

    // Sortiere nach Erstellungsdatum (neueste zuerst)
    notifications.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Zähle ungelesene Nachrichten
    const unreadCount = (unreadMessages || []).length;

    return NextResponse.json({
      notifications: notifications.slice(0, 20),
      unreadCount,
      total: notifications.length,
    });
  } catch (error) {
    console.error("Notifications error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Gerade eben";
  if (diffMins < 60) return `Vor ${diffMins} Min`;
  if (diffHours < 24) return `Vor ${diffHours} Std`;
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  return date.toLocaleDateString("de-DE");
}
