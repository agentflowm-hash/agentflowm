import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Batch: Alle Daten in wenigen Queries holen
    const [leadsRes, checksRes, referralsRes, subscribersRes, invoicesRes] = await Promise.all([
      db.from('leads').select('id, name, email, company, package_interest, status, priority, created_at').order('created_at', { ascending: false }),
      db.from('website_checks').select('id, url, score_overall, created_at').order('created_at', { ascending: false }),
      db.from('referrals').select('id, status'),
      db.from('subscribers').select('id, status, created_at'),
      db.from('invoices').select('total, status, paid_at, created_at'),
    ]);

    const leads = leadsRes.data || [];
    const checks = checksRes.data || [];
    const referrals = referralsRes.data || [];
    const subscribers = subscribersRes.data || [];
    const invoices = invoicesRes.data || [];

    // Leads stats -- alles in JS berechnen
    const leadsTotal = leads.length;
    const leadsNew = leads.filter(l => l.status === 'new').length;
    const leadsContacted = leads.filter(l => l.status === 'contacted').length;
    const leadsQualified = leads.filter(l => l.status === 'qualified').length;
    const leadsProposal = leads.filter(l => l.status === 'proposal').length;
    const leadsWon = leads.filter(l => l.status === 'won').length;
    const leadsLost = leads.filter(l => l.status === 'lost').length;
    const leadsThisWeek = leads.filter(l => l.created_at >= weekAgo).length;
    const conversionRate = leadsTotal > 0 ? Math.round((leadsWon / leadsTotal) * 100) : 0;

    // Checks stats
    const checksTotal = checks.length;
    const checksToday = checks.filter(c => c.created_at >= today).length;
    const checksThisWeek = checks.filter(c => c.created_at >= weekAgo).length;
    const avgScore = checksTotal > 0
      ? Math.round(checks.reduce((s, c) => s + (c.score_overall || 0), 0) / checksTotal)
      : 0;
    const topScore = checksTotal > 0
      ? Math.max(...checks.map(c => c.score_overall || 0))
      : 0;

    // Referrals stats
    const referralsTotal = referrals.length;
    const referralsPending = referrals.filter(r => r.status === 'pending').length;
    const referralsConverted = referrals.filter(r => r.status === 'converted').length;

    // Subscribers stats
    const subscribersTotal = subscribers.length;
    const subscribersConfirmed = subscribers.filter(s => s.status === 'confirmed').length;
    const subscribersThisWeek = subscribers.filter(s => s.created_at >= weekAgo).length;

    // Revenue
    const paidInvoices = invoices.filter(i => i.status === 'paid');
    const revenueTotal = paidInvoices.reduce((s, i) => s + (parseFloat(i.total) || 0), 0);
    const revenueThisMonth = paidInvoices
      .filter(i => (i.paid_at && i.paid_at >= thisMonthStart) || i.created_at >= thisMonthStart)
      .reduce((s, i) => s + (parseFloat(i.total) || 0), 0);

    // Recent leads (top 5)
    const recentLeads = leads.slice(0, 5).map((l: any) => ({
      id: l.id, name: l.name, email: l.email, company: l.company,
      packageInterest: l.package_interest, status: l.status,
      priority: l.priority || "medium", createdAt: l.created_at,
    }));

    // Recent activity
    const recentActivity = [
      ...leads.slice(0, 3).map(l => ({ type: 'lead', id: l.id, title: l.name, subtitle: l.email, created_at: l.created_at })),
      ...checks.slice(0, 3).map(c => ({ type: 'check', id: c.id, title: c.url, subtitle: c.score_overall, created_at: c.created_at })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

    // 7-day trends -- berechnen aus den bereits geladenen Daten
    const trends = { leads: [] as number[], checks: [] as number[] };
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const dayEnd = new Date(Date.now() - (i - 1) * 86400000).toISOString().split('T')[0];
      trends.leads.push(leads.filter(l => l.created_at >= dayStart && l.created_at < dayEnd).length);
      trends.checks.push(checks.filter(c => c.created_at >= dayStart && c.created_at < dayEnd).length);
    }

    return NextResponse.json({
      leads: {
        total: leadsTotal, new: leadsNew, contacted: leadsContacted,
        qualified: leadsQualified, proposal: leadsProposal,
        won: leadsWon, lost: leadsLost, thisWeek: leadsThisWeek, conversionRate,
      },
      checks: { total: checksTotal, today: checksToday, thisWeek: checksThisWeek, avgScore, topScore },
      referrals: {
        total: referralsTotal, pending: referralsPending, converted: referralsConverted,
        conversionRate: referralsTotal > 0 ? Math.round((referralsConverted / referralsTotal) * 100) : 0,
      },
      subscribers: { total: subscribersTotal, confirmed: subscribersConfirmed, thisWeek: subscribersThisWeek, growthRate: 0 },
      revenue: { total: revenueTotal, thisMonth: revenueThisMonth },
      recentLeads,
      recentActivity,
      trends,
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
