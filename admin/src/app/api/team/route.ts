import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('team_members').select('*').order('role', { ascending: true });
  if (error) return { members: [], error: error.message };
  return { members: data || [] };
});

export const POST = createHandler({ auth: true }, async (data) => {
  const { name, email, role, phone, avatar_url } = data as any;
  const { data: member, error } = await db
    .from('team_members')
    .insert({ name, email, role: role || 'member', phone, avatar_url })
    .select().single();
  if (error) return { error: error.message };
  return { member };
});
