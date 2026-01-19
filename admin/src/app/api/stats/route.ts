import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Leads stats - multiple queries
    const { count: leadsTotal } = await db.from('leads').select('*', { count: 'exact', head: true });
    const { count: leadsNew } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new');
    const { count: leadsContacted } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'contacted');
    const { count: leadsQualified } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'qualified');
    const { count: leadsProposal } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'proposal');
    const { count: leadsWon } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'won');
    const { count: leadsLost } = await db.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'lost');
    const { count: leadsThisWeek } = await db.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo);

    // Website checks stats
    const { count: checksTotal } = await db.from('website_checks').select('*', { count: 'exact', head: true });
    const { count: checksToday } = await db.from('website_checks').select('*', { count: 'exact', head: true }).gte('created_at', today);
    const { count: checksThisWeek } = await db.from('website_checks').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo);

    // Average score
    const { data: scoreData } = await db.from('website_checks').select('score_overall');
    const avgScore = scoreData && scoreData.length > 0
      ? Math.round(scoreData.reduce((sum, r) => sum + (r.score_overall || 0), 0) / scoreData.length)
      : 0;
    const topScore = scoreData && scoreData.length > 0
      ? Math.max(...scoreData.map(r => r.score_overall || 0))
      : 0;

    // Referrals stats
    const { count: referralsTotal } = await db.from('referrals').select('*', { count: 'exact', head: true });
    const { count: referralsPending } = await db.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { count: referralsConverted } = await db.from('referrals').select('*', { count: 'exact', head: true }).eq('status', 'converted');

    // Subscribers stats
    const { count: subscribersTotal } = await db.from('subscribers').select('*', { count: 'exact', head: true });
    const { count: subscribersConfirmed } = await db.from('subscribers').select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
    const { count: subscribersThisWeek } = await db.from('subscribers').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo);

    // Recent leads (last 5)
    const { data: recentLeadsRaw } = await db
      .from('leads')
      .select('id, name, email, company, package_interest, status, priority, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Recent activity
    const { data: latestLeads } = await db
      .from('leads')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const { data: latestChecks } = await db
      .from('website_checks')
      .select('id, url, score_overall, created_at')
      .order('created_at', { ascending: false })
      .limit(3);

    const recentActivity: any[] = [
      ...(latestLeads || []).map(l => ({ type: 'lead', id: l.id, title: l.name, subtitle: l.email, created_at: l.created_at })),
      ...(latestChecks || []).map(c => ({ type: 'check', id: c.id, title: c.url, subtitle: c.score_overall, created_at: c.created_at })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    // Calculate conversion rate
    const totalLeads = leadsTotal || 0;
    const wonLeads = leadsWon || 0;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    return NextResponse.json({
      leads: {
        total: leadsTotal || 0,
        new: leadsNew || 0,
        contacted: leadsContacted || 0,
        qualified: leadsQualified || 0,
        proposal: leadsProposal || 0,
        won: leadsWon || 0,
        lost: leadsLost || 0,
        thisWeek: leadsThisWeek || 0,
        conversionRate,
      },
      checks: {
        total: checksTotal || 0,
        today: checksToday || 0,
        thisWeek: checksThisWeek || 0,
        avgScore,
        topScore,
      },
      referrals: {
        total: referralsTotal || 0,
        pending: referralsPending || 0,
        converted: referralsConverted || 0,
        conversionRate: (referralsTotal || 0) > 0
          ? Math.round(((referralsConverted || 0) / (referralsTotal || 0)) * 100)
          : 0,
      },
      subscribers: {
        total: subscribersTotal || 0,
        confirmed: subscribersConfirmed || 0,
        thisWeek: subscribersThisWeek || 0,
        growthRate: 0,
      },
      recentLeads: (recentLeadsRaw || []).map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
        packageInterest: lead.package_interest,
        status: lead.status,
        priority: lead.priority || "medium",
        createdAt: lead.created_at,
      })),
      recentActivity,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
