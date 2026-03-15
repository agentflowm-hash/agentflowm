import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

export const PUT = createHandler({ auth: true }, async (data, _ctx, request) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!);
  const { error } = await db.from('project_templates').update(data as any).eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
});

export const DELETE = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!);
  const { error } = await db.from('project_templates').delete().eq('id', id);
  if (error) return { error: error.message };
  return { success: true };
});
