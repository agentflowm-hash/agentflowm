/**
 * ═══════════════════════════════════════════════════════════════
 *                    CALENDAR API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/calendar - List events with optional filters
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('startDate') || searchParams.get('start');
  const endDate = searchParams.get('endDate') || searchParams.get('end');
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
    query = query.lte('start_date', endDate);
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
}, async (_data, _ctx, request) => {
  const body = await request.json();

  const { data: event, error } = await db
    .from('calendar_events')
    .insert({
      title: body.title,
      description: body.description || null,
      start_date: body.start_time || body.start_date,
      end_date: body.end_time || body.end_date || null,
      client_id: body.client_id || null,
      project_id: body.project_id || null,
      type: body.event_type || body.type || 'meeting',
      color: body.color || '#FC682C',
      location: body.location || null,
      client_name: body.client_name || null,
      all_day: body.all_day || false,
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
