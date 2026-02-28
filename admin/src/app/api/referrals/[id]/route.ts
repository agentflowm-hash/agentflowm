/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRAL BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  UpdateReferralSchema,
  NotFoundError,
  DatabaseError,
  type UpdateReferralInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/referrals/[id] - Get single referral
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { data: referral, error } = await db
    .from('referrals')
    .select(`
      *,
      referrer:portal_clients!referrer_id (
        id,
        name,
        email,
        company
      )
    `)
    .eq('id', id)
    .single();

  if (error || !referral) {
    throw new NotFoundError('Referral');
  }

  return { referral };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/referrals/[id] - Update referral status
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
  schema: UpdateReferralSchema,
}, async (data: UpdateReferralInput, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Check if referral exists
  const { data: existing } = await db
    .from('referrals')
    .select('id, status, referrer_id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Referral');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.status !== undefined) {
    updateData.status = data.status;
    
    // If converted, set conversion date
    if (data.status === 'converted') {
      updateData.converted_at = new Date().toISOString();
      
      // Create notification
      await db.from('notifications').insert({
        title: 'Empfehlung konvertiert',
        message: 'Eine Empfehlung wurde erfolgreich konvertiert',
        type: 'success',
        link: `/referrals/${id}`,
        is_read: false,
      });
    }
  }

  if (data.reward_status !== undefined) {
    updateData.reward_status = data.reward_status;
    
    if (data.reward_status === 'paid') {
      updateData.reward_paid_at = new Date().toISOString();
    }
  }

  const { data: referral, error } = await db
    .from('referrals')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { referral };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/referrals/[id] - Delete referral
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { error } = await db
    .from('referrals')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
