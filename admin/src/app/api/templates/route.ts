import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('project_templates').select('*').order('is_default', { ascending: false });
  if (error) return { templates: [], error: error.message };
  return { templates: data || [] };
});

export const POST = createHandler({ auth: true }, async (data) => {
  const { name, package: pkg, description, default_price, milestones, services, is_default } = data as any;
  const { data: template, error } = await db
    .from('project_templates')
    .insert({ name, package: pkg, description, default_price, milestones: milestones || [], services: services || [], is_default: is_default || false })
    .select().single();
  if (error) return { error: error.message };
  return { template };
});
