import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import { z } from 'zod';

const CreateFolderSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().max(50).optional().default('folder'),
  color: z.string().max(20).optional().default('#FC682C'),
  parent_id: z.number().int().optional().nullable(),
});

export const GET = createHandler({ auth: true }, async () => {
  const { data: folders, error } = await db.from('vault_folders').select('*').order('sort_order').order('name');
  if (error) throw new DatabaseError(error.message);
  return { folders: folders || [] };
});

export const POST = createHandler({ auth: true, schema: CreateFolderSchema }, async (data) => {
  const { data: folder, error } = await db.from('vault_folders').insert(data).select().single();
  if (error) throw new DatabaseError(error.message);
  return { folder };
});
