/**
 * ═══════════════════════════════════════════════════════════════
 *                    ANALYTICS DASHBOARD API
 * ═══════════════════════════════════════════════════════════════
 *
 * GET /api/analytics/dashboard
 * Aggregates real data from leads, invoices, clients tables
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/analytics/dashboard - Aggregated analytics
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async () => {
  // a) Leads pro Monat (letzte 6 Monate)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: leadsRaw, error: leadsErr } = await db
    .from('leads')
    .select('created_at')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (leadsErr) throw new DatabaseError(leadsErr.message);

  const leadsPerMonth: Record<string, number> = {};
  (leadsRaw || []).forEach((l: any) => {
    const month = new Date(l.created_at).toISOString().slice(0, 7);
    leadsPerMonth[month] = (leadsPerMonth[month] || 0) + 1;
  });

  // Generate last 6 months labels
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }

  const leadsMonthly = months.map((m) => ({
    month: m,
    count: leadsPerMonth[m] || 0,
  }));

  // b) Revenue pro Monat (bezahlte Rechnungen)
  const { data: invoicesRaw, error: invErr } = await db
    .from('invoices')
    .select('total, created_at')
    .eq('status', 'paid')
    .gte('created_at', sixMonthsAgo.toISOString());

  if (invErr) throw new DatabaseError(invErr.message);

  const revenuePerMonth: Record<string, number> = {};
  (invoicesRaw || []).forEach((inv: any) => {
    const month = new Date(inv.created_at).toISOString().slice(0, 7);
    revenuePerMonth[month] = (revenuePerMonth[month] || 0) + (inv.total || 0);
  });

  const revenueMonthly = months.map((m) => ({
    month: m,
    total: revenuePerMonth[m] || 0,
  }));

  // c) Top Lead-Quellen
  const { data: allLeads, error: srcErr } = await db
    .from('leads')
    .select('source');

  if (srcErr) throw new DatabaseError(srcErr.message);

  const sourceCounts: Record<string, number> = {};
  (allLeads || []).forEach((l: any) => {
    const src = l.source || 'Unbekannt';
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const topSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));

  // d) Conversion Funnel
  const { data: statusLeads, error: statusErr } = await db
    .from('leads')
    .select('status');

  if (statusErr) throw new DatabaseError(statusErr.message);

  const statusCounts: Record<string, number> = {};
  (statusLeads || []).forEach((l: any) => {
    const s = l.status || 'neu';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const funnel = {
    neu: statusCounts['neu'] || statusCounts['new'] || 0,
    kontaktiert: statusCounts['kontaktiert'] || statusCounts['contacted'] || 0,
    qualifiziert: statusCounts['qualifiziert'] || statusCounts['qualified'] || 0,
    angebot: statusCounts['angebot'] || statusCounts['proposal'] || 0,
    gewonnen: statusCounts['gewonnen'] || statusCounts['won'] || 0,
    verloren: statusCounts['verloren'] || statusCounts['lost'] || 0,
  };

  // e) Aktive Kunden
  const { count: activeClients, error: clientsErr } = await db
    .from('portal_clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  if (clientsErr) throw new DatabaseError(clientsErr.message);

  return {
    leadsMonthly,
    revenueMonthly,
    topSources,
    funnel,
    activeClients: activeClients || 0,
  };
});
