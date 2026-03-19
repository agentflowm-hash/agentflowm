/**
 * ═══════════════════════════════════════════════════════════════
 *                    CONTRACT BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  NotFoundError,
  DatabaseError,
} from '@/lib/api';
import { logActivity } from '@/lib/activity';

// ─────────────────────────────────────────────────────────────────
// PATCH /api/contracts/[id] - Update contract
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const body = await request.json();

  const { data: existing } = await db
    .from('contracts')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Contract');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const fields = [
    'title', 'contract_type', 'party_name', 'party_email', 'party_company',
    'content', 'status', 'valid_from', 'valid_until', 'monthly_amount', 'notes'
  ] as const;

  for (const field of fields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  }

  const { data: contract, error } = await db
    .from('contracts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { contract };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/contracts/[id] - Delete contract
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { error } = await db
    .from('contracts')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
