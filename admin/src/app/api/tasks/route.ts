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
}, async (data: any) => {
  const { data: task, error } = await db
    .from('tasks')
    .insert({
      title: data.title,
      description: data.description || null,
      assignee: data.assignee || null,
      due_date: data.due_date || null,
      status: data.status || 'open',
      priority: data.priority || 'medium',
      linked_entity: data.linked_entity || null,
      linked_id: data.linked_id || null,
      tags: data.tags || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { task };
});
