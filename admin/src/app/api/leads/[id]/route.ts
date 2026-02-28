/**
 * ═══════════════════════════════════════════════════════════════
 *                    LEAD BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  UpdateLeadSchema,
  NotFoundError,
  DatabaseError,
  type UpdateLeadInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/leads/[id] - Get single lead
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { data: lead, error } = await db
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) {
    throw new NotFoundError('Lead');
  }

  return { lead };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/leads/[id] - Update lead
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
  schema: UpdateLeadSchema,
}, async (data: UpdateLeadInput, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Check if lead exists
  const { data: existing } = await db
    .from('leads')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Lead');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const fields = [
    'name', 'email', 'company', 'phone', 'message',
    'source', 'package_interest', 'status', 'notes'
  ] as const;

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const { data: lead, error } = await db
    .from('leads')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { lead };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/leads/[id] - Delete lead
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { error } = await db
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
