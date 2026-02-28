/**
 * ═══════════════════════════════════════════════════════════════
 *                    CLIENT BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  UpdateClientSchema,
  NotFoundError,
  DatabaseError,
  type UpdateClientInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/clients/[id] - Get single client
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { data: client, error } = await db
    .from('portal_clients')
    .select(`
      *,
      portal_projects (
        id,
        name,
        package,
        status,
        status_label,
        progress,
        manager
      )
    `)
    .eq('id', id)
    .single();

  if (error || !client) {
    throw new NotFoundError('Client');
  }

  return { client };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/clients/[id] - Update client
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
  schema: UpdateClientSchema,
}, async (data: UpdateClientInput, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Check if client exists
  const { data: existing } = await db
    .from('portal_clients')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Client');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.company !== undefined) updateData.company = data.company;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.status !== undefined) updateData.status = data.status;

  const { data: client, error } = await db
    .from('portal_clients')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { client };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/clients/[id] - Delete client (soft delete)
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Soft delete by setting status to archived
  const { error } = await db
    .from('portal_clients')
    .update({ 
      status: 'archived',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
