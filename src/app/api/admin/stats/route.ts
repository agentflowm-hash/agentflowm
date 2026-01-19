import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/stats
//                    Dashboard Statistiken
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    // Alle Daten parallel laden
    const [leadsResult, referralsResult, checksResult, subscribersResult] = await Promise.all([
      supabaseAdmin.from('leads').select('*'),
      supabaseAdmin.from('referrals').select('*'),
      supabaseAdmin.from('website_checks').select('*'),
      supabaseAdmin.from('subscribers').select('*'),
    ]);

    const allLeads = leadsResult.data || [];
    const allReferrals = referralsResult.data || [];
    const allChecks = checksResult.data || [];
    const allSubscribers = subscribersResult.data || [];

    // Zeitfilter für "diese Woche" und "diesen Monat"
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Leads Stats
    const leadsStats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new').length,
      thisWeek: allLeads.filter(l => new Date(l.created_at) >= weekAgo).length,
      thisMonth: allLeads.filter(l => new Date(l.created_at) >= monthAgo).length,
      byStatus: {
        new: allLeads.filter(l => l.status === 'new').length,
        contacted: allLeads.filter(l => l.status === 'contacted').length,
        qualified: allLeads.filter(l => l.status === 'qualified').length,
        converted: allLeads.filter(l => l.status === 'converted').length,
        lost: allLeads.filter(l => l.status === 'lost').length,
      },
      byPriority: {
        high: allLeads.filter(l => l.priority === 'high').length,
        medium: allLeads.filter(l => l.priority === 'medium').length,
        low: allLeads.filter(l => l.priority === 'low').length,
      },
    };

    // Referrals Stats
    const referralsStats = {
      total: allReferrals.length,
      pending: allReferrals.filter(r => r.status === 'pending').length,
      thisWeek: allReferrals.filter(r => new Date(r.created_at) >= weekAgo).length,
      thisMonth: allReferrals.filter(r => new Date(r.created_at) >= monthAgo).length,
      byStatus: {
        pending: allReferrals.filter(r => r.status === 'pending').length,
        contacted: allReferrals.filter(r => r.status === 'contacted').length,
        converted: allReferrals.filter(r => r.status === 'converted').length,
        rejected: allReferrals.filter(r => r.status === 'rejected').length,
      },
    };

    // Website Checks Stats
    const scores = allChecks.map(c => c.score_overall).filter((s): s is number => s !== null);
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const checksStats = {
      total: allChecks.length,
      thisWeek: allChecks.filter(c => new Date(c.created_at) >= weekAgo).length,
      thisMonth: allChecks.filter(c => new Date(c.created_at) >= monthAgo).length,
      avgScore,
      byScoreRange: {
        excellent: allChecks.filter(c => (c.score_overall || 0) >= 80).length,
        good: allChecks.filter(c => (c.score_overall || 0) >= 60 && (c.score_overall || 0) < 80).length,
        needsWork: allChecks.filter(c => (c.score_overall || 0) < 60 && c.score_overall !== null).length,
      },
    };

    // Subscribers Stats
    const subscribersStats = {
      total: allSubscribers.length,
      confirmed: allSubscribers.filter(s => s.status === 'confirmed').length,
      thisWeek: allSubscribers.filter(s => new Date(s.created_at) >= weekAgo).length,
      thisMonth: allSubscribers.filter(s => new Date(s.created_at) >= monthAgo).length,
      byStatus: {
        pending: allSubscribers.filter(s => s.status === 'pending').length,
        confirmed: allSubscribers.filter(s => s.status === 'confirmed').length,
        unsubscribed: allSubscribers.filter(s => s.status === 'unsubscribed').length,
      },
    };

    // Letzte 7 Tage Trend
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      return {
        date: date.toISOString().split('T')[0],
        leads: allLeads.filter(l => {
          const created = new Date(l.created_at);
          return created >= date && created < nextDay;
        }).length,
        checks: allChecks.filter(c => {
          const created = new Date(c.created_at);
          return created >= date && created < nextDay;
        }).length,
      };
    });

    return NextResponse.json({
      leads: leadsStats,
      referrals: referralsStats,
      websiteChecks: checksStats,
      subscribers: subscribersStats,
      trend: last7Days,
      lastUpdated: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
