/**
 * ═══════════════════════════════════════════════════════════════
 *                    CALENDAR EVENT BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  NotFoundError,
  DatabaseError,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/calendar/[id] - Get single event
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { data: event, error } = await db
    .from('calendar_events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    throw new NotFoundError('Event');
  }

  return { event };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/calendar/[id] - Update event
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { data: existing } = await db
    .from('calendar_events')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Event');
  }

  const updateData: Record<string, unknown> = {};

  // Map frontend field names to DB column names
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.start_time !== undefined) updateData.start_date = data.start_time;
  if (data.start_date !== undefined) updateData.start_date = data.start_date;
  if (data.end_time !== undefined) updateData.end_date = data.end_time;
  if (data.end_date !== undefined) updateData.end_date = data.end_date;
  if (data.event_type !== undefined) updateData.type = data.event_type;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.client_id !== undefined) updateData.client_id = data.client_id;
  if (data.client_name !== undefined) updateData.client_name = data.client_name;
  if (data.project_id !== undefined) updateData.project_id = data.project_id;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.all_day !== undefined) updateData.all_day = data.all_day;

  const { data: event, error } = await db
    .from('calendar_events')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { event };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/calendar/[id] - Delete event
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { error } = await db
    .from('calendar_events')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
