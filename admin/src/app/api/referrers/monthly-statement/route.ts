/**
 * ═══════════════════════════════════════════════════════════════
 *           MONTHLY REFERRER COMMISSION STATEMENT
 * ═══════════════════════════════════════════════════════════════
 *
 * POST: Generate monthly statement for a referrer
 * GET:  List all payouts/statements
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
}) : null;

const GenerateStatementSchema = z.object({
  referrer_id: z.number().int().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM
  send_email: z.boolean().default(false),
});

type GenerateStatementInput = z.infer<typeof GenerateStatementSchema>;

const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

// ─────────────────────────────────────────────────────────────────
// GET - List all monthly payouts
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({ auth: true }, async () => {
  const { data: payouts, error } = await db
    .from('referrer_payouts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  // Enrich with referrer names
  const enriched = await Promise.all((payouts || []).map(async (p) => {
    const { data: referrer } = await db.from('referrers').select('name, email').eq('id', p.referrer_id).single();
    return { ...p, referrer_name: referrer?.name || 'Unbekannt', referrer_email: referrer?.email || '' };
  }));

  return { payouts: enriched };
});

// ─────────────────────────────────────────────────────────────────
// POST - Generate monthly statement
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: GenerateStatementSchema,
}, async (data: GenerateStatementInput) => {
  const { referrer_id, month, send_email } = data;
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr);
  const monthNum = parseInt(monthStr);
  const monthName = MONTH_NAMES[monthNum - 1];

  // Get referrer
  const { data: referrer } = await db.from('referrers').select('*').eq('id', referrer_id).single();
  if (!referrer) throw new DatabaseError('Empfehlungsgeber nicht gefunden');

  // Get all commissions for this referrer in this month that are approved or paid
  const startDate = `${month}-01T00:00:00`;
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const endDate = `${month}-${String(daysInMonth).padStart(2, '0')}T23:59:59`;

  const { data: commissions } = await db
    .from('referral_commissions')
    .select('*')
    .eq('referrer_id', referrer_id)
    .in('status', ['approved', 'paid'])
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true });

  if (!commissions || commissions.length === 0) {
    return { error: 'Keine genehmigten Provisionen in diesem Monat' };
  }

  const totalAmount = commissions.reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0);
  const commissionIds = commissions.map(c => c.id);

  // Check if payout already exists
  const { data: existing } = await db
    .from('referrer_payouts')
    .select('id')
    .eq('referrer_id', referrer_id)
    .eq('month', monthStr)
    .eq('year', year)
    .single();

  let payout;
  if (existing) {
    // Update existing
    const { data: updated, error } = await db
      .from('referrer_payouts')
      .update({
        commission_ids: commissionIds,
        total_amount: totalAmount,
        net_amount: totalAmount,
        tax_rate: 0,
        tax_amount: 0,
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw new DatabaseError(error.message);
    payout = updated;
  } else {
    // Create new
    const { data: created, error } = await db
      .from('referrer_payouts')
      .insert({
        referrer_id,
        month: monthStr,
        year,
        commission_ids: commissionIds,
        total_amount: totalAmount,
        net_amount: totalAmount,
        tax_rate: 0,
        tax_amount: 0,
        status: 'draft',
      })
      .select()
      .single();
    if (error) throw new DatabaseError(error.message);
    payout = created;
  }

  // Send email if requested
  if (send_email && transporter && referrer.email) {
    const firstName = referrer.name.split(' ')[0];
    const totalFormatted = totalAmount.toLocaleString('de-DE', { minimumFractionDigits: 2 });

    const commissionRows = commissions.map(c => {
      const dealVal = parseFloat(String(c.deal_value)).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      const commVal = parseFloat(String(c.commission_amount)).toLocaleString('de-DE', { minimumFractionDigits: 2 });
      const date = new Date(c.created_at).toLocaleDateString('de-DE');
      return `
        <tr>
          <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:13px;">${date}</td>
          <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:13px;">${c.notes || 'Empfehlung'}</td>
          <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:#ffffff;font-size:13px;text-align:right;">${dealVal}€</td>
          <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:#ffffff;font-size:13px;text-align:center;">${c.commission_rate}%</td>
          <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);color:#FC682C;font-size:13px;font-weight:600;text-align:right;">${commVal}€</td>
        </tr>`;
    }).join('');

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F19;padding:40px 20px;">
    <tr><td align="center">
      <table width="650" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(252,104,44,0.15),transparent);border-bottom:1px solid rgba(255,255,255,0.06);">
            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Monatliche Abrechnung</p>
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Provisionsabrechnung ${monthName} ${year}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0 0 8px;">Hallo ${firstName},</p>
            <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;margin:0 0 24px;">
              hier ist deine Provisionsabrechnung für ${monthName} ${year}.
            </p>

            <!-- Referrer Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px 20px;">
                  <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0 0 4px;text-transform:uppercase;">Empfehlungsgeber</p>
                  <p style="color:#ffffff;font-size:15px;font-weight:600;margin:0;">${referrer.name}</p>
                  <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:4px 0 0;">${referrer.email}${referrer.company ? ` &bull; ${referrer.company}` : ''}</p>
                </td>
              </tr>
            </table>

            <!-- Commission Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
              <tr style="background:rgba(255,255,255,0.04);">
                <th style="padding:12px 16px;text-align:left;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-transform:uppercase;">Datum</th>
                <th style="padding:12px 16px;text-align:left;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-transform:uppercase;">Beschreibung</th>
                <th style="padding:12px 16px;text-align:right;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-transform:uppercase;">Deal-Wert</th>
                <th style="padding:12px 16px;text-align:center;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-transform:uppercase;">Rate</th>
                <th style="padding:12px 16px;text-align:right;color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;text-transform:uppercase;">Provision</th>
              </tr>
              ${commissionRows}
              <tr style="background:rgba(252,104,44,0.08);">
                <td colspan="4" style="padding:16px;color:#FC682C;font-size:14px;font-weight:700;">Gesamtbetrag</td>
                <td style="padding:16px;color:#FC682C;font-size:18px;font-weight:800;text-align:right;">${totalFormatted}€</td>
              </tr>
            </table>

            <p style="color:rgba(255,255,255,0.4);font-size:12px;margin:16px 0 0;">
              Abrechnungsnummer: ABR-${year}-${monthStr}-${referrer_id} &bull; Erstellt am ${new Date().toLocaleDateString('de-DE')}
            </p>

            <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:24px 0 0;">
              Beste Grüße,<br><strong style="color:#ffffff;">Das AgentFlowMarketing Team</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);">
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;text-align:center;">
              AgentFlowMarketing &bull; Achillesstraße 69A, 13125 Berlin &bull; kontakt@agentflowm.de
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      await transporter.sendMail({
        from: `AgentFlowMarketing <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
        to: referrer.email,
        subject: `Provisionsabrechnung ${monthName} ${year} — ${totalFormatted}€`,
        html,
      });

      // Update payout status to sent
      await db.from('referrer_payouts').update({ status: 'sent' }).eq('id', payout.id);
    } catch (e) {
      console.error('Monthly statement email error:', e);
    }
  }

  return { payout, commissions_count: commissions.length, total_amount: totalAmount };
});
