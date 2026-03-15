import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('pipelines').select('*').order('is_default', { ascending: false });
  if (error) return { pipelines: [], error: error.message };
  return { pipelines: data || [] };
});

export const POST = createHandler({ auth: true }, async (data) => {
  const { name, stages, color, is_default } = data as any;
  const { data: pipeline, error } = await db
    .from('pipelines')
    .insert({ name, stages: stages || [], color: color || '#FC682C', is_default: is_default || false })
    .select().single();
  if (error) return { error: error.message };
  return { pipeline };
});
