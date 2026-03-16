/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRERS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
  ConflictError,
} from '@/lib/api';
import { z } from 'zod';

const CreateReferrerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  commission_rate: z.number().min(0).max(100).default(10),
  notes: z.string().max(1000).optional().nullable(),
});

type CreateReferrerInput = z.infer<typeof CreateReferrerSchema>;

// ─────────────────────────────────────────────────────────────────
// GET /api/referrers - List all referrers with stats
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search');

  let query = db
    .from('referrers')
    .select('*')
    .order('total_commission', { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  }

  const { data: referrers, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Ranking berechnen
  const ranked = (referrers || []).map((r, i) => ({
    ...r,
    rank: i + 1,
  }));

  return {
    referrers: ranked,
    stats: {
      total: ranked.length,
      active: ranked.filter((r: any) => r.status === 'active').length,
      totalCommission: ranked.reduce((sum: number, r: any) => sum + (parseFloat(r.total_commission) || 0), 0),
      totalReferrals: ranked.reduce((sum: number, r: any) => sum + (r.total_referrals || 0), 0),
      totalConverted: ranked.reduce((sum: number, r: any) => sum + (r.converted_referrals || 0), 0),
    },
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/referrers - Create new referrer
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateReferrerSchema,
}, async (data: CreateReferrerInput) => {
  const { name, email, phone, company, commission_rate, notes } = data;

  // Check duplicate
  const { data: existing } = await db
    .from('referrers')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    throw new ConflictError('Ein Empfehlungsgeber mit dieser E-Mail existiert bereits');
  }

  // Unique referral code generieren
  const prefix = name.split(' ')[0].toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralCode = `${prefix}-${random}`;

  const { data: referrer, error } = await db
    .from('referrers')
    .insert({
      name,
      email,
      phone: phone || null,
      company: company || null,
      commission_rate: commission_rate || 10,
      notes: notes || null,
      referral_code: referralCode,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { referrer };
});
