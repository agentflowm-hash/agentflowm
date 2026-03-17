import { db } from '@/lib/db';
import { createHandler, DatabaseError, NotFoundError } from '@/lib/api';
import { z } from 'zod';
import crypto from 'crypto';

const VAULT_KEY = process.env.VAULT_ENCRYPTION_KEY || process.env.ADMIN_PASSWORD || 'agentflow-vault-key-2026';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(VAULT_KEY, 'salt', 32), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

const UpdateEntrySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: z.enum(['login', 'api_key', 'link', 'note', 'server', 'payment', 'snippet', 'other']).optional(),
  folder_id: z.number().int().optional().nullable(),
  client_id: z.number().int().optional().nullable(),
  url: z.string().max(500).optional().nullable(),
  username: z.string().max(200).optional().nullable(),
  password: z.string().max(500).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).optional(),
  is_favorite: z.boolean().optional(),
  snippet_code: z.string().max(50000).optional().nullable(),
  snippet_language: z.string().max(50).optional().nullable(),
});

export const PATCH = createHandler({ auth: true, schema: UpdateEntrySchema }, async (data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const { data: existing } = await db.from('vault_entries').select('id').eq('id', id).single();
  if (!existing) throw new NotFoundError('Vault entry');

  const { password, ...rest } = data as any;
  const updateData: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() };
  if (password !== undefined) {
    updateData.encrypted_password = password ? encrypt(password) : null;
  }
  delete updateData.password;

  const { data: entry, error } = await db.from('vault_entries').update(updateData).eq('id', id).select().single();
  if (error) throw new DatabaseError(error.message);
  return { entry };
});

export const DELETE = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/').pop();
  const { error } = await db.from('vault_entries').delete().eq('id', id);
  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
