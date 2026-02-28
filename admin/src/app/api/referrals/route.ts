/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRALS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateReferralSchema,
  NotFoundError,
  ConflictError,
  DatabaseError,
  type CreateReferralInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/referrals - List all referrals
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const referrerId = searchParams.get('referrerId');

  let query = db
    .from('referrals')
    .select(`
      *,
      referrer:portal_clients!referrer_id (
        id,
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (referrerId) {
    query = query.eq('referrer_id', referrerId);
  }

  const { data: referrals, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Calculate stats
  const stats = {
    total: referrals?.length || 0,
    pending: referrals?.filter((r: any) => r.status === 'pending').length || 0,
    converted: referrals?.filter((r: any) => r.status === 'converted').length || 0,
    pendingRewards: referrals?.filter((r: any) => 
      r.status === 'converted' && r.reward_status === 'pending'
    ).length || 0,
  };

  return {
    referrals: referrals || [],
    stats,
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/referrals - Create referral
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateReferralSchema,
}, async (data: CreateReferralInput) => {
  const { referrer_id, referred_email, referred_name, notes } = data;

  // Verify referrer exists
  const { data: referrer } = await db
    .from('portal_clients')
    .select('id, name')
    .eq('id', referrer_id)
    .single();

  if (!referrer) {
    throw new NotFoundError('Referrer client');
  }

  // Check for duplicate referral
  const { data: existing } = await db
    .from('referrals')
    .select('id')
    .eq('referrer_id', referrer_id)
    .eq('referred_email', referred_email)
    .single();

  if (existing) {
    throw new ConflictError('This referral already exists');
  }

  // Generate referral code
  const referralCode = `REF-${referrer.name.split(' ')[0].toUpperCase().slice(0, 4)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { data: referral, error } = await db
    .from('referrals')
    .insert({
      referrer_id,
      referred_email,
      referred_name,
      referral_code: referralCode,
      notes: notes || null,
      status: 'pending',
      reward_status: 'pending',
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { referral };
});
