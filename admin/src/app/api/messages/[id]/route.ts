/**
 * ═══════════════════════════════════════════════════════════════
 *                    MESSAGE BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, NotFoundError, DatabaseError, ValidationError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/messages/[id] - Get single message
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const messageId = parseInt(id || '', 10);

  if (isNaN(messageId)) {
    throw new ValidationError('Invalid message ID');
  }

  const { data: message, error } = await db
    .from('portal_messages')
    .select('*')
    .eq('id', messageId)
    .single();

  if (error || !message) {
    throw new NotFoundError('Message');
  }

  return { message };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/messages/[id] - Mark message as read
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const messageId = parseInt(id || '', 10);

  if (isNaN(messageId)) {
    throw new ValidationError('Invalid message ID');
  }

  const { data: message, error } = await db
    .from('portal_messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { message };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/messages/[id] - Delete message
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const messageId = parseInt(id || '', 10);

  if (isNaN(messageId)) {
    throw new ValidationError('Invalid message ID');
  }

  const { error } = await db
    .from('portal_messages')
    .delete()
    .eq('id', messageId);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
