import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

export const PATCH = createHandler({ auth: true }, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const updateData: Record<string, unknown> = {};
  if (data.status) { updateData.status = data.status; if (data.status === 'paid') updateData.paid_at = new Date().toISOString(); }
  if (data.net_amount !== undefined) updateData.net_amount = data.net_amount;
  if (data.notes !== undefined) updateData.notes = data.notes;
  const { data: entry, error } = await db.from('payroll').update(updateData).eq('id', id).select().single();
  if (error) throw new DatabaseError(error.message);
  return { payroll: entry };
});

export const DELETE = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const { error } = await db.from('payroll').delete().eq('id', id);
  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
