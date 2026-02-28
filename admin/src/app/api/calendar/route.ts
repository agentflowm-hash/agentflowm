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

  // Simple select without FK joins
  let query = db
    .from('calendar_events')
    .select('*')
    .order('start_date', { ascending: true });

  // Apply filters
  if (startDate) {
    query = query.gte('start_date', startDate);
  }
  if (endDate) {
    query = query.lte('end_date', endDate);
  }
  if (clientId) {
    query = query.eq('client_id', clientId);
  }
  if (eventType) {
    query = query.eq('type', eventType);
  }

  const { data: events, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Enrich with client/project names
  const enrichedEvents = await Promise.all((events || []).map(async (event) => {
    let clientName = null;
    let projectName = null;
    
    if (event.client_id) {
      const { data: client } = await db
        .from('portal_clients')
        .select('name, company')
        .eq('id', event.client_id)
        .single();
      if (client) clientName = client.name;
    }
    
    if (event.project_id) {
      const { data: project } = await db
        .from('portal_projects')
        .select('name')
        .eq('id', event.project_id)
        .single();
      if (project) projectName = project.name;
    }
    
    return { ...event, client_name: clientName, project_name: projectName };
  }));

  return { events: enrichedEvents };
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
  } = data;

  const { data: event, error } = await db
    .from('calendar_events')
    .insert({
      title,
      description: description || null,
      start_date: start_time,
      end_date: end_time || null,
      client_id: client_id || null,
      project_id: project_id || null,
      type: event_type || 'event',
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
