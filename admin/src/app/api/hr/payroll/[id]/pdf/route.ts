/**
 * PAYROLL PDF API — Gehaltsabrechnung als PDF
 */

import { db } from '@/lib/db';
import { createHandler, NotFoundError } from '@/lib/api';
import { htmlToPdf, pdfResponse } from '@/lib/pdf';

export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').slice(-2)[0];

  const { data: payroll, error } = await db
    .from('payroll')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !payroll) throw new NotFoundError('Gehaltsabrechnung');

  // Load company info
  const { data: settings } = await db.from('admin_settings').select('value').eq('key', 'company').single();
  const company = settings?.value || {};

  const html = generatePayrollHTML(payroll, company);
  const format = request.nextUrl.searchParams.get('format');

  if (format === 'html') {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const pdf = await htmlToPdf(html);
    return pdfResponse(pdf, `Gehaltsabrechnung-${payroll.month || id}.pdf`);
  } catch {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
});

function generatePayrollHTML(payroll: any, company: any): string {
  const companyName = company.name || 'AgentFlowMarketing';
  const companyAddress = company.address || '';
  const gross = parseFloat(payroll.gross_salary) || 0;
  const tax = parseFloat(payroll.tax_amount) || 0;
  const social = parseFloat(payroll.social_contributions) || 0;
  const net = parseFloat(payroll.net_salary) || gross - tax - social;
  const month = payroll.month || '';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a2e; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #FC682C; }
    .company { font-size: 22px; font-weight: 700; color: #FC682C; }
    .company-address { font-size: 11px; color: #888; margin-top: 4px; }
    .doc-type { font-size: 24px; font-weight: 700; color: #1a1a2e; text-align: right; }
    .doc-month { font-size: 14px; color: #666; text-align: right; margin-top: 4px; }
    .employee-info { background: #f8f9fc; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
    .employee-name { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .employee-detail { font-size: 13px; color: #666; margin-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    th { text-align: left; padding: 12px 16px; background: #f0f0f5; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #666; }
    td { padding: 14px 16px; border-bottom: 1px solid #eee; font-size: 14px; }
    td:last-child { text-align: right; font-variant-numeric: tabular-nums; }
    .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #1a1a2e; border-bottom: none; }
    .net-row td { color: #FC682C; font-size: 18px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">${companyName}</div>
      ${companyAddress ? `<div class="company-address">${companyAddress}</div>` : ''}
    </div>
    <div>
      <div class="doc-type">Gehaltsabrechnung</div>
      <div class="doc-month">${month}</div>
    </div>
  </div>

  <div class="employee-info">
    <div class="employee-name">${payroll.employee_name || 'Mitarbeiter'}</div>
    ${payroll.position ? `<div class="employee-detail">Position: ${payroll.position}</div>` : ''}
    ${payroll.employee_id ? `<div class="employee-detail">Personalnummer: ${payroll.employee_id}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr><th>Position</th><th style="text-align:right">Betrag</th></tr>
    </thead>
    <tbody>
      <tr><td>Bruttogehalt</td><td>${gross.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td></tr>
      <tr><td>Lohnsteuer</td><td>-${tax.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td></tr>
      <tr><td>Sozialabgaben</td><td>-${social.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td></tr>
      ${payroll.bonus ? `<tr><td>Bonus/Zuschlag</td><td>+${parseFloat(payroll.bonus).toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td></tr>` : ''}
      <tr class="total-row net-row"><td>Nettogehalt</td><td>${net.toLocaleString('de-DE', { minimumFractionDigits: 2 })} EUR</td></tr>
    </tbody>
  </table>

  ${payroll.notes ? `<p style="font-size:13px;color:#666;margin-bottom:20px;">Hinweise: ${payroll.notes}</p>` : ''}

  <div class="footer">
    <p>${companyName} — Diese Abrechnung wurde maschinell erstellt.</p>
  </div>
</body>
</html>`;
}
