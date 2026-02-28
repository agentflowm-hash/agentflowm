/**
 * ═══════════════════════════════════════════════════════════════
 *                    NOTIFICATIONS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateNotificationSchema,
  DatabaseError,
  type CreateNotificationInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/notifications - List notifications
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let query = db
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('is_read', false);
  }

  const { data: notifications, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Get unread count
  const { count: unreadCount } = await db
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/notifications - Create notification
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateNotificationSchema,
}, async (data: CreateNotificationInput) => {
  const { title, message, type, link, metadata } = data;

  const { data: notification, error } = await db
    .from('notifications')
    .insert({
      title,
      message,
      type,
      link: link || null,
      metadata: metadata || null,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { notification };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/notifications - Mark all as read
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async () => {
  const { error } = await db
    .from('notifications')
    .update({ is_read: true })
    .eq('is_read', false);

  if (error) throw new DatabaseError(error.message);

  return { success: true };
});
