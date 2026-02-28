/**
 * ═══════════════════════════════════════════════════════════════
 *                    CALENDAR API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateEventSchema,
  DatabaseError,
  type CreateEventInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/calendar - List events with optional filters
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const clientId = searchParams.get('clientId');
  const eventType = searchParams.get('eventType');

  let query = db
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
    .order('start_time', { ascending: true });

  // Apply filters
  if (startDate) {
    query = query.gte('start_time', startDate);
  }
  if (endDate) {
    query = query.lte('end_time', endDate);
  }
  if (clientId) {
    query = query.eq('client_id', clientId);
  }
  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  const { data: events, error } = await query;

  if (error) throw new DatabaseError(error.message);

  return { events: events || [] };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/calendar - Create new event
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateEventSchema,
}, async (data: CreateEventInput) => {
  const {
    title,
    description,
    start_time,
    end_time,
    client_id,
    project_id,
    event_type,
    color,
  } = data;

  const { data: event, error } = await db
    .from('calendar_events')
    .insert({
      title,
      description: description || null,
      start_time,
      end_time,
      client_id: client_id || null,
      project_id: project_id || null,
      event_type,
      color: color || getDefaultColor(event_type),
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { event };
});

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function getDefaultColor(eventType: string): string {
  const colors: Record<string, string> = {
    meeting: '#3B82F6',   // blue
    deadline: '#EF4444',  // red
    milestone: '#10B981', // green
    reminder: '#F59E0B',  // amber
  };
  return colors[eventType] || '#6B7280';
}
