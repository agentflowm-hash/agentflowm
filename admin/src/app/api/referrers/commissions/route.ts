/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRAL COMMISSIONS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const CreateCommissionSchema = z.object({
  referrer_id: z.number().int().positive(),
  lead_id: z.number().int().positive().optional().nullable(),
  deal_value: z.number().positive(),
  notes: z.string().max(1000).optional().nullable(),
});

const UpdateCommissionSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(['pending', 'approved', 'paid']),
});

type CreateCommissionInput = z.infer<typeof CreateCommissionSchema>;
type UpdateCommissionInput = z.infer<typeof UpdateCommissionSchema>;

// ─────────────────────────────────────────────────────────────────
// GET /api/referrers/commissions - List all commissions
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const referrer_id = searchParams.get('referrer_id');
  const status = searchParams.get('status');
  const month = searchParams.get('month'); // YYYY-MM

  let query = db
    .from('referral_commissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (referrer_id) query = query.eq('referrer_id', referrer_id);
  if (status) query = query.eq('status', status);
  if (month) {
    const [year, m] = month.split('-');
    const start = `${year}-${m}-01T00:00:00`;
    const daysInMonth = new Date(parseInt(year), parseInt(m), 0).getDate();
    const end = `${year}-${m}-${String(daysInMonth).padStart(2, '0')}T23:59:59`;
    query = query.gte('created_at', start).lte('created_at', end);
  }

  const { data: commissions, error } = await query;
  if (error) throw new DatabaseError(error.message);

  // Enrich with referrer names
  const enriched = await Promise.all((commissions || []).map(async (c) => {
    const { data: referrer } = await db
      .from('referrers')
      .select('name, email')
      .eq('id', c.referrer_id)
      .single();
    return { ...c, referrer_name: referrer?.name || 'Unbekannt', referrer_email: referrer?.email || '' };
  }));

  const stats = {
    total: enriched.length,
    totalAmount: enriched.reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0),
    pending: enriched.filter(c => c.status === 'pending').reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0),
    approved: enriched.filter(c => c.status === 'approved').reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0),
    paid: enriched.filter(c => c.status === 'paid').reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0),
  };

  return { commissions: enriched, stats };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/referrers/commissions - Create commission
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateCommissionSchema,
}, async (data: CreateCommissionInput) => {
  const { referrer_id, lead_id, deal_value, notes } = data;

  // Get referrer's commission rate
  const { data: referrer } = await db
    .from('referrers')
    .select('id, name, commission_rate, total_commission')
    .eq('id', referrer_id)
    .single();

  if (!referrer) throw new DatabaseError('Empfehlungsgeber nicht gefunden');

  const rate = parseFloat(String(referrer.commission_rate)) || 10;
  const commissionAmount = Math.round(deal_value * rate) / 100;

  // Current month for payout grouping
  const now = new Date();
  const payoutMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Insert commission
  const { data: commission, error } = await db
    .from('referral_commissions')
    .insert({
      referrer_id,
      lead_id: lead_id || null,
      deal_value,
      commission_rate: rate,
      commission_amount: commissionAmount,
      notes: notes || null,
      status: 'pending',
      payout_month: payoutMonth,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  // Update referrer total_commission
  const newTotal = (parseFloat(String(referrer.total_commission)) || 0) + commissionAmount;
  await db
    .from('referrers')
    .update({
      total_commission: newTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', referrer_id);

  return { commission };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/referrers/commissions - Update commission status
// with accounting integration
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
  schema: UpdateCommissionSchema,
}, async (data: UpdateCommissionInput) => {
  const { id, status } = data;

  // Get commission
  const { data: commission } = await db
    .from('referral_commissions')
    .select('*')
    .eq('id', id)
    .single();

  if (!commission) throw new DatabaseError('Provision nicht gefunden');

  // Get referrer
  const { data: referrer } = await db
    .from('referrers')
    .select('id, name, email')
    .eq('id', commission.referrer_id)
    .single();

  const updateData: Record<string, unknown> = { status };

  // ── APPROVED: Buchhaltung-Eintrag erstellen ──
  if (status === 'approved' && commission.status === 'pending') {
    updateData.approved_at = new Date().toISOString();

    // Buchung in der Buchhaltung erstellen
    const amount = parseFloat(String(commission.commission_amount));
    const taxRate = 0; // Provisionen sind i.d.R. keine USt-pflichtige Leistung
    const taxAmount = 0;
    const netAmount = amount;

    const { data: entry } = await db
      .from('accounting_transactions')
      .insert({
        date: new Date().toISOString().split('T')[0],
        description: `Empfehlungsprovision — ${referrer?.name || 'Unbekannt'} (Deal: ${parseFloat(String(commission.deal_value)).toLocaleString('de-DE')}€)`,
        category: 'Empfehlungsprovision',
        type: 'expense',
        amount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        net_amount: netAmount,
        account: 'Geschäftskonto',
        reference: `PROV-${id}`,
        notes: commission.notes || null,
      })
      .select()
      .single();

    if (entry) {
      updateData.accounting_entry_id = entry.id;
    }

    // Notification
    await db.from('notifications').insert({
      title: 'Provision genehmigt',
      message: `${amount.toLocaleString('de-DE')}€ Provision für ${referrer?.name} wurde genehmigt`,
      type: 'info',
      is_read: false,
    });
  }

  // ── PAID: Buchung aktualisieren + E-Mail an Empfehlungsgeber ──
  if (status === 'paid' && (commission.status === 'approved' || commission.status === 'pending')) {
    updateData.paid_at = new Date().toISOString();

    // Falls noch keine Buchung → jetzt erstellen
    if (!commission.accounting_entry_id && !updateData.accounting_entry_id) {
      const amount = parseFloat(String(commission.commission_amount));
      const { data: entry } = await db
        .from('accounting_transactions')
        .insert({
          date: new Date().toISOString().split('T')[0],
          description: `Empfehlungsprovision ausgezahlt — ${referrer?.name || 'Unbekannt'}`,
          category: 'Empfehlungsprovision',
          type: 'expense',
          amount,
          tax_rate: 0,
          tax_amount: 0,
          net_amount: amount,
          account: 'Geschäftskonto',
          reference: `PROV-${id}`,
          notes: `Ausgezahlt am ${new Date().toLocaleDateString('de-DE')}`,
        })
        .select()
        .single();
      if (entry) updateData.accounting_entry_id = entry.id;
    }

    // Update existing accounting entry with paid note
    if (commission.accounting_entry_id) {
      await db
        .from('accounting_transactions')
        .update({
          notes: `Ausgezahlt am ${new Date().toLocaleDateString('de-DE')}. ${commission.notes || ''}`.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', commission.accounting_entry_id);
    }

    // Referrer converted_referrals + 1
    try {
      const { data: ref } = await db.from('referrers').select('converted_referrals').eq('id', commission.referrer_id).single();
      if (ref) {
        await db.from('referrers').update({ converted_referrals: (ref.converted_referrals || 0) + 1 }).eq('id', commission.referrer_id);
      }
    } catch { /* ignore */ }

    // Auszahlungs-E-Mail direkt senden
    if (referrer?.email && process.env.SMTP_HOST) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        const amt = parseFloat(String(commission.commission_amount)).toLocaleString('de-DE', { minimumFractionDigits: 2 });
        const dealAmt = parseFloat(String(commission.deal_value)).toLocaleString('de-DE', { minimumFractionDigits: 2 });
        const firstName = referrer.name.split(' ')[0];
        await transporter.sendMail({
          from: `AgentFlowMarketing <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
          to: referrer.email,
          subject: `Deine Provision von ${amt}€ wurde ausgezahlt!`,
          html: `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:24px;background:#111827;color:#fff;border-radius:16px;">
            <h2 style="color:#10B981;margin:0 0 16px;">Provision ausgezahlt!</h2>
            <p>Hallo ${firstName},</p>
            <p style="color:rgba(255,255,255,0.7);">Deine Empfehlungsprovision wurde soeben überwiesen:</p>
            <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;">Deal-Wert: <strong style="color:#fff;">${dealAmt}€</strong></p>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.5);font-size:13px;">Rate: <strong style="color:#fff;">${commission.commission_rate}%</strong></p>
              <p style="margin:12px 0 0;color:#10B981;font-size:20px;font-weight:bold;">Auszahlung: ${amt}€</p>
            </div>
            ${commission.notes ? `<p style="color:rgba(255,255,255,0.4);font-size:12px;">Notiz: ${commission.notes}</p>` : ''}
            <p style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:24px;">Beste Grüße,<br>Das AgentFlowMarketing Team</p>
          </div>`,
        });
      } catch (e) {
        console.error('Payout email failed:', e);
      }
    }

    // Notification
    await db.from('notifications').insert({
      title: 'Provision ausgezahlt',
      message: `${parseFloat(String(commission.commission_amount)).toLocaleString('de-DE')}€ an ${referrer?.name} ausgezahlt`,
      type: 'success',
      is_read: false,
    });
  }

  // Update commission
  const { data: updated, error } = await db
    .from('referral_commissions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { commission: updated };
});
