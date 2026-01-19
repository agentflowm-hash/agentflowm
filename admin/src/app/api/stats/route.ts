import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getSqliteDb();
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Leads stats
    const leadsTotal = db
      .prepare("SELECT COUNT(*) as count FROM leads")
      .get() as { count: number };
    const leadsNew = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'")
      .get() as { count: number };
    const leadsContacted = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'contacted'")
      .get() as { count: number };
    const leadsQualified = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'qualified'")
      .get() as { count: number };
    const leadsProposal = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'proposal'")
      .get() as { count: number };
    const leadsWon = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'won'")
      .get() as { count: number };
    const leadsLost = db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'lost'")
      .get() as { count: number };
    const leadsThisWeek = db
      .prepare(
        "SELECT COUNT(*) as count FROM leads WHERE date(created_at) >= ?",
      )
      .get(weekAgo) as { count: number };

    // Website checks stats
    const checksTotal = db
      .prepare("SELECT COUNT(*) as count FROM website_checks")
      .get() as { count: number };
    const checksToday = db
      .prepare(
        "SELECT COUNT(*) as count FROM website_checks WHERE date(created_at) = ?",
      )
      .get(today) as { count: number };
    const checksThisWeek = db
      .prepare(
        "SELECT COUNT(*) as count FROM website_checks WHERE date(created_at) >= ?",
      )
      .get(weekAgo) as { count: number };
    const avgScoreResult = db
      .prepare("SELECT AVG(score_overall) as avg FROM website_checks")
      .get() as { avg: number | null };
    const avgScore = Math.round(avgScoreResult?.avg || 0);
    const topScoreResult = db
      .prepare("SELECT MAX(score_overall) as max FROM website_checks")
      .get() as { max: number | null };
    const topScore = topScoreResult?.max || 0;

    // Referrals stats
    const referralsTotal = db
      .prepare("SELECT COUNT(*) as count FROM referrals")
      .get() as { count: number };
    const referralsPending = db
      .prepare(
        "SELECT COUNT(*) as count FROM referrals WHERE status = 'pending'",
      )
      .get() as { count: number };
    const referralsConverted = db
      .prepare(
        "SELECT COUNT(*) as count FROM referrals WHERE status = 'converted'",
      )
      .get() as { count: number };

    // Subscribers stats
    const subscribersTotal = db
      .prepare("SELECT COUNT(*) as count FROM subscribers")
      .get() as { count: number };
    const subscribersConfirmed = db
      .prepare(
        "SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'",
      )
      .get() as { count: number };
    const subscribersThisWeek = db
      .prepare(
        "SELECT COUNT(*) as count FROM subscribers WHERE date(created_at) >= ?",
      )
      .get(weekAgo) as { count: number };

    // Recent leads (last 5)
    const recentLeads = db
      .prepare(
        `
      SELECT id, name, email, company, package_interest, status, priority, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 5
    `,
      )
      .all() as any[];

    // Recent activity (combining leads, checks, referrals)
    const recentActivity: any[] = [];

    // Add recent leads to activity
    const latestLeads = db
      .prepare(
        `
      SELECT 'lead' as type, id, name as title, email as subtitle, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT 3
    `,
      )
      .all() as any[];
    recentActivity.push(...latestLeads);

    // Add recent checks to activity
    const latestChecks = db
      .prepare(
        `
      SELECT 'check' as type, id, url as title, score_overall as subtitle, created_at
      FROM website_checks
      ORDER BY created_at DESC
      LIMIT 3
    `,
      )
      .all() as any[];
    recentActivity.push(...latestChecks);

    // Sort by date
    recentActivity.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    // Calculate conversion rate
    const conversionRate =
      leadsTotal.count > 0
        ? Math.round((leadsWon.count / leadsTotal.count) * 100)
        : 0;

    return NextResponse.json({
      leads: {
        total: leadsTotal.count,
        new: leadsNew.count,
        contacted: leadsContacted.count,
        qualified: leadsQualified.count,
        proposal: leadsProposal.count,
        won: leadsWon.count,
        lost: leadsLost.count,
        thisWeek: leadsThisWeek.count,
        conversionRate: conversionRate,
      },
      checks: {
        total: checksTotal.count,
        today: checksToday.count,
        thisWeek: checksThisWeek.count,
        avgScore: avgScore,
        topScore: topScore,
      },
      referrals: {
        total: referralsTotal.count,
        pending: referralsPending.count,
        converted: referralsConverted.count,
        conversionRate:
          referralsTotal.count > 0
            ? Math.round(
                (referralsConverted.count / referralsTotal.count) * 100,
              )
            : 0,
      },
      subscribers: {
        total: subscribersTotal.count,
        confirmed: subscribersConfirmed.count,
        thisWeek: subscribersThisWeek.count,
        growthRate: 0,
      },
      recentLeads: recentLeads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        packageInterest: lead.package_interest,
        status: lead.status,
        priority: lead.priority || "medium",
        createdAt: lead.created_at,
      })),
      recentActivity: recentActivity.slice(0, 5),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
