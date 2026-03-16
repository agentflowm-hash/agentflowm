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

const CreateCommissionSchema = z.object({
  referrer_id: z.number().int().positive(),
  lead_id: z.number().int().positive().optional().nullable(),
  deal_value: z.number().positive(),
  notes: z.string().max(1000).optional().nullable(),
});

type CreateCommissionInput = z.infer<typeof CreateCommissionSchema>;

// ─────────────────────────────────────────────────────────────────
// GET /api/referrers/commissions - List all commissions
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async () => {
  const { data: commissions, error } = await db
    .from('referral_commissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  return { commissions: commissions || [] };
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
    .select('id, commission_rate, total_commission')
    .eq('id', referrer_id)
    .single();

  if (!referrer) throw new DatabaseError('Empfehlungsgeber nicht gefunden');

  const rate = parseFloat(String(referrer.commission_rate)) || 10;
  const commissionAmount = Math.round(deal_value * rate) / 100;

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
