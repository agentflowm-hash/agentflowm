/**
 * ═══════════════════════════════════════════════════════════════
 *                    NOTIFICATIONS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/notifications - List notifications
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const unreadOnly = searchParams.get('unread') === 'true';
  const typeFilter = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let query = db
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  if (typeFilter) {
    query = query.eq('type', typeFilter);
  }

  const { data: notifications, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Get unread count
  const { count: unreadCount } = await db
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

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
}, async (data: any) => {
  const { title, message, type, link } = data;

  if (!title || !message) {
    throw new DatabaseError('title and message are required');
  }

  const { data: notification, error } = await db
    .from('notifications')
    .insert({
      title,
      message,
      type: type || 'info',
      link: link || null,
      read: false,
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
    .update({ read: true })
    .eq('read', false);

  if (error) throw new DatabaseError(error.message);

  return { updated: true };
});
