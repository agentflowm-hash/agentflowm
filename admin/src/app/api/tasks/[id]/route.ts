/**
 * ═══════════════════════════════════════════════════════════════
 *                    TASK BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  NotFoundError,
  DatabaseError,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// PATCH /api/tasks/[id] - Update task
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
}, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  // Check if task exists
  const { data: existing } = await db
    .from('tasks')
    .select('id')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Task');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const fields = [
    'title', 'description', 'assignee', 'due_date',
    'status', 'priority', 'linked_entity', 'linked_id', 'tags',
    'subtasks', 'comments'
  ] as const;

  for (const field of fields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  const { data: task, error } = await db
    .from('tasks')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { task };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/tasks/[id] - Delete task
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();

  const { error } = await db
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
