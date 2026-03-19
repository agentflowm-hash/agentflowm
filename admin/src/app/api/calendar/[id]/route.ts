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
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const body = await request.json();

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
  if (body.title !== undefined) updateData.title = body.title;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.start_time !== undefined) updateData.start_date = body.start_time;
  if (body.start_date !== undefined) updateData.start_date = body.start_date;
  if (body.end_time !== undefined) updateData.end_date = body.end_time;
  if (body.end_date !== undefined) updateData.end_date = body.end_date;
  if (body.event_type !== undefined) updateData.type = body.event_type;
  if (body.type !== undefined) updateData.type = body.type;
  if (body.client_id !== undefined) updateData.client_id = body.client_id;
  if (body.client_name !== undefined) updateData.client_name = body.client_name;
  if (body.project_id !== undefined) updateData.project_id = body.project_id;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.location !== undefined) updateData.location = body.location;
  if (body.all_day !== undefined) updateData.all_day = body.all_day;

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
