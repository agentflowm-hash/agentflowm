/**
 * ═══════════════════════════════════════════════════════════════
 *                    TASKS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/tasks - List tasks with optional filters
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const assignee = searchParams.get('assignee');

  let query = db
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (priority) {
    query = query.eq('priority', priority);
  }
  if (assignee) {
    query = query.eq('assignee', assignee);
  }

  const { data: tasks, error } = await query;

  if (error) throw new DatabaseError(error.message);

  return { tasks: tasks || [] };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/tasks - Create new task
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const body = await request.json();

  const { data: task, error } = await db
    .from('tasks')
    .insert({
      title: body.title,
      description: body.description || null,
      assignee: body.assignee || null,
      due_date: body.due_date || null,
      status: body.status || 'open',
      priority: body.priority || 'medium',
      linked_entity: body.linked_entity || null,
      linked_id: body.linked_id || null,
      tags: body.tags || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { task };
});
