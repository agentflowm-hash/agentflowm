/**
 * ═══════════════════════════════════════════════════════════════
 *                    ACCOUNTING PDF EXPORT API
 * ═══════════════════════════════════════════════════════════════
 *
 * GET /api/accounting/export-pdf?month=3&year=2026
 * Returns an HTML page styled for print/PDF
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import { NextResponse } from 'next/server';

const MONTH_NAMES = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export const GET = createHandler({
  auth: true,
}, async (params: any, _ctx: any) => {
  const month = parseInt(params.month, 10);
  const year = parseInt(params.year, 10);

  if (isNaN(month) || isNaN(year)) {
    throw new DatabaseError('month and year are required');
  }

  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const endDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

  const { data: transactions, error } = await db
    .from('accounting_transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });

  if (error) throw new DatabaseError(error.message);

  const rows = transactions || [];
  const incomeRows = rows.filter((t: any) => t.type === 'income');
  const expenseRows = rows.filter((t: any) => t.type === 'expense');

  const totalIncome = incomeRows.reduce((s: number, t: any) => s + Number(t.amount), 0);
  const totalExpenses = expenseRows.reduce((s: number, t: any) => s + Number(t.amount), 0);
  const totalIncomeNet = incomeRows.reduce((s: number, t: any) => s + Number(t.net_amount), 0);
  const totalExpensesNet = expenseRows.reduce((s: number, t: any) => s + Number(t.net_amount), 0);
  const totalIncomeTax = incomeRows.reduce((s: number, t: any) => s + Number(t.tax_amount), 0);
  const totalExpensesTax = expenseRows.reduce((s: number, t: any) => s + Number(t.tax_amount), 0);
  const profit = totalIncome - totalExpenses;
  const taxLiability = totalIncomeTax - totalExpensesTax;

  const fmt = (n: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('de-DE');

  const tableRows = rows.map((t: any) => `
    <tr>
      <td>${fmtDate(t.date)}</td>
      <td>${t.description}</td>
      <td>${t.category}</td>
      <td style="color: ${t.type === 'income' ? '#16a34a' : '#dc2626'}">${t.type === 'income' ? 'Einnahme' : 'Ausgabe'}</td>
      <td class="num">${fmt(t.net_amount)}</td>
      <td class="num">${fmt(t.tax_amount)} (${t.tax_rate}%)</td>
      <td class="num" style="font-weight:600">${fmt(t.amount)}</td>
    </tr>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Buchhaltung ${MONTH_NAMES[month]} ${year}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1a1a2e; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #FC682C; }
    .header h1 { font-size: 24px; color: #1a1a2e; }
    .header h1 span { color: #FC682C; }
    .header .meta { text-align: right; color: #666; font-size: 13px; }
    .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .summary-card { padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5; }
    .summary-card .label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .summary-card .value { font-size: 20px; font-weight: 700; }
    .green { color: #16a34a; }
    .red { color: #dc2626; }
    .orange { color: #FC682C; }
    .purple { color: #7c3aed; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; font-size: 13px; }
    th { background: #f8f8f8; padding: 10px 12px; text-align: left; font-weight: 600; color: #555; border-bottom: 2px solid #e0e0e0; }
    td { padding: 8px 12px; border-bottom: 1px solid #f0f0f0; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .totals { background: #fafafa; }
    .totals td { font-weight: 600; border-top: 2px solid #e0e0e0; padding: 12px; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; display: flex; justify-content: space-between; }
    @media print { body { padding: 20px; } .summary { grid-template-columns: repeat(4, 1fr); } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Buchhaltungsübersicht <span>${MONTH_NAMES[month]} ${year}</span></h1>
      <p style="color:#888; font-size:14px; margin-top:4px">AgentFlowMarketing</p>
    </div>
    <div class="meta">
      <p>Erstellt: ${new Date().toLocaleDateString('de-DE')}</p>
      <p>${rows.length} Buchungen</p>
    </div>
  </div>

  <div class="summary">
    <div class="summary-card">
      <div class="label">Einnahmen (Brutto)</div>
      <div class="value green">${fmt(totalIncome)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Ausgaben (Brutto)</div>
      <div class="value red">${fmt(totalExpenses)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Gewinn</div>
      <div class="value orange">${fmt(profit)}</div>
    </div>
    <div class="summary-card">
      <div class="label">USt-Zahllast</div>
      <div class="value purple">${fmt(taxLiability)}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Datum</th>
        <th>Beschreibung</th>
        <th>Kategorie</th>
        <th>Typ</th>
        <th class="num">Netto</th>
        <th class="num">USt</th>
        <th class="num">Brutto</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
      <tr class="totals">
        <td colspan="4">Einnahmen Gesamt</td>
        <td class="num green">${fmt(totalIncomeNet)}</td>
        <td class="num">${fmt(totalIncomeTax)}</td>
        <td class="num green">${fmt(totalIncome)}</td>
      </tr>
      <tr class="totals">
        <td colspan="4">Ausgaben Gesamt</td>
        <td class="num red">${fmt(totalExpensesNet)}</td>
        <td class="num">${fmt(totalExpensesTax)}</td>
        <td class="num red">${fmt(totalExpenses)}</td>
      </tr>
      <tr class="totals">
        <td colspan="4" style="font-size:14px">Gewinn / Verlust</td>
        <td class="num orange" style="font-size:14px">${fmt(totalIncomeNet - totalExpensesNet)}</td>
        <td class="num purple">${fmt(taxLiability)}</td>
        <td class="num orange" style="font-size:14px">${fmt(profit)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <span>AgentFlowMarketing — Buchhaltungsübersicht ${MONTH_NAMES[month]} ${year}</span>
    <span>Alle Beträge in EUR inkl. MwSt. wo angegeben</span>
  </div>
</body>
</html>`;

  return {
    html,
    month: MONTH_NAMES[month],
    year,
    summary: {
      totalIncome,
      totalExpenses,
      profit,
      taxLiability,
      transactionCount: rows.length,
    },
  };
});
