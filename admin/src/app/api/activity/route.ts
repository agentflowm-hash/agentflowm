/**
 * ═══════════════════════════════════════════════════════════════
 *                    ACTIVITY LOG API
 * ═══════════════════════════════════════════════════════════════
 *
 * GET  /api/activity — List activities (with optional filters)
 * POST /api/activity — Log a new activity
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/activity - List activities with optional filters
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (params: Record<string, string>) => {
  const { entity_type, entity_id, limit } = params;

  let query = db
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false });

  if (entity_type) {
    query = query.eq('entity_type', entity_type);
  }

  if (entity_id) {
    query = query.eq('entity_id', parseInt(entity_id, 10));
  }

  query = query.limit(parseInt(limit, 10) || 50);

  const { data, error } = await query;

  if (error) throw new DatabaseError(error.message);

  return { activities: data ?? [] };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/activity - Log a new activity
// ─────────────────────────────────────────────────────────────────

interface LogActivityBody {
  action: string;
  entity_type: string;
  entity_id?: number;
  entity_name?: string;
  details?: Record<string, unknown>;
  user_name?: string;
}

export const POST = createHandler({
  auth: true,
}, async (data: LogActivityBody) => {
  const { action, entity_type, entity_id, entity_name, details, user_name } = data;

  if (!action || !entity_type) {
    throw new DatabaseError('action and entity_type are required');
  }

  const { data: activity, error } = await db
    .from('activity_log')
    .insert({
      action,
      entity_type,
      entity_id: entity_id ?? null,
      entity_name: entity_name ?? null,
      details: details ?? {},
      user_name: user_name ?? 'Admin',
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { activity };
});
