import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

export const PATCH = createHandler({ auth: true }, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const { _type, ...rest } = data;
  const { data: contract, error } = await db.from('employee_contracts').update(rest).eq('id', id).select().single();
  if (error) throw new DatabaseError(error.message);
  return { contract };
});

export const DELETE = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const { error } = await db.from('employee_contracts').delete().eq('id', id);
  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
