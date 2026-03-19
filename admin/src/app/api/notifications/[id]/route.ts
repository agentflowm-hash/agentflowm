/**
 * ═══════════════════════════════════════════════════════════════
 *                    NOTIFICATION [ID] API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// PATCH /api/notifications/[id] - Mark single as read
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async (data: any, _ctx: any, request: any) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!, 10);

  const { error } = await db
    .from('notifications')
    .update({ read: data.read ?? true })
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);
  return { updated: true };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/notifications/[id] - Delete notification
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data: any, _ctx: any, request: any) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!, 10);

  const { error } = await db
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
