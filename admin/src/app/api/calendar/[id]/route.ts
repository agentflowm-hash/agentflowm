/**
 * ═══════════════════════════════════════════════════════════════
 *                    CALENDAR EVENT BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  UpdateEventSchema,
  NotFoundError,
  DatabaseError,
  type UpdateEventInput,
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
    .select(`
      *,
      portal_clients (
        id,
        name,
        company
      ),
      portal_projects (
        id,
        name
      )
    `)
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
  schema: UpdateEventSchema,
}, async (data: UpdateEventInput, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Check if event exists
  const { data: existing } = await db
    .from('calendar_events')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Event');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Only include defined fields
  const fields = [
    'title', 'description', 'start_time', 'end_time',
    'client_id', 'project_id', 'event_type', 'color'
  ] as const;
  
  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

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
