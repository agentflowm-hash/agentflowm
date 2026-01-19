import { NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { leads, referrals, websiteChecks, subscribers } from '@/lib/db/schema';
import { isAuthenticated } from '@/lib/auth';
import { sql } from 'drizzle-orm';

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/stats
//                    Dashboard Statistiken
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    // Alle Daten laden
    const allLeads = db.select().from(leads).all();
    const allReferrals = db.select().from(referrals).all();
    const allChecks = db.select().from(websiteChecks).all();
    const allSubscribers = db.select().from(subscribers).all();

    // Zeitfilter für "diese Woche" und "diesen Monat"
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Leads Stats
    const leadsStats = {
      total: allLeads.length,
      new: allLeads.filter(l => l.status === 'new').length,
      thisWeek: allLeads.filter(l => new Date(l.createdAt) >= weekAgo).length,
      thisMonth: allLeads.filter(l => new Date(l.createdAt) >= monthAgo).length,
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
      thisWeek: allReferrals.filter(r => new Date(r.createdAt) >= weekAgo).length,
      thisMonth: allReferrals.filter(r => new Date(r.createdAt) >= monthAgo).length,
      byStatus: {
        pending: allReferrals.filter(r => r.status === 'pending').length,
        contacted: allReferrals.filter(r => r.status === 'contacted').length,
        converted: allReferrals.filter(r => r.status === 'converted').length,
        rejected: allReferrals.filter(r => r.status === 'rejected').length,
      },
    };

    // Website Checks Stats
    const scores = allChecks.map(c => c.scoreOverall).filter((s): s is number => s !== null);
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;

    const checksStats = {
      total: allChecks.length,
      thisWeek: allChecks.filter(c => new Date(c.createdAt) >= weekAgo).length,
      thisMonth: allChecks.filter(c => new Date(c.createdAt) >= monthAgo).length,
      avgScore,
      byScoreRange: {
        excellent: allChecks.filter(c => (c.scoreOverall || 0) >= 80).length,
        good: allChecks.filter(c => (c.scoreOverall || 0) >= 60 && (c.scoreOverall || 0) < 80).length,
        needsWork: allChecks.filter(c => (c.scoreOverall || 0) < 60 && c.scoreOverall !== null).length,
      },
    };

    // Subscribers Stats
    const subscribersStats = {
      total: allSubscribers.length,
      confirmed: allSubscribers.filter(s => s.status === 'confirmed').length,
      thisWeek: allSubscribers.filter(s => new Date(s.createdAt) >= weekAgo).length,
      thisMonth: allSubscribers.filter(s => new Date(s.createdAt) >= monthAgo).length,
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
          const created = new Date(l.createdAt);
          return created >= date && created < nextDay;
        }).length,
        checks: allChecks.filter(c => {
          const created = new Date(c.createdAt);
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
