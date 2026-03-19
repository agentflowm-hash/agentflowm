/**
 * ═══════════════════════════════════════════════════════════════
 *                    VAULT API — Datentresor
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import { z } from 'zod';
import crypto from 'crypto';

const VAULT_KEY = process.env.VAULT_ENCRYPTION_KEY || process.env.ADMIN_PASSWORD || 'FALLBACK_CHANGE_ME';

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(VAULT_KEY, 'salt', 32), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  try {
    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(VAULT_KEY, 'salt', 32), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '***ENTSCHLÜSSELUNG FEHLGESCHLAGEN***';
  }
}

const CreateEntrySchema = z.object({
  folder_id: z.number().int().optional().nullable(),
  client_id: z.number().int().optional().nullable(),
  title: z.string().min(1).max(200),
  category: z.enum(['login', 'api_key', 'link', 'note', 'server', 'payment', 'snippet', 'other']).default('login'),
  url: z.string().max(500).optional().nullable(),
  username: z.string().max(200).optional().nullable(),
  password: z.string().max(500).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  is_favorite: z.boolean().optional().default(false),
  snippet_code: z.string().max(50000).optional().nullable(),
  snippet_language: z.string().max(50).optional().default('text'),
});

type CreateEntryInput = z.infer<typeof CreateEntrySchema>;

// GET /api/vault
export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const folder_id = searchParams.get('folder_id');
  const category = searchParams.get('category');
  const client_id = searchParams.get('client_id');
  const search = searchParams.get('search');
  const favorites = searchParams.get('favorites');

  let query = db.from('vault_entries').select('*').order('is_favorite', { ascending: false }).order('updated_at', { ascending: false });

  if (folder_id) query = query.eq('folder_id', parseInt(folder_id));
  if (category) query = query.eq('category', category);
  if (client_id) query = query.eq('client_id', parseInt(client_id));
  if (favorites === 'true') query = query.eq('is_favorite', true);
  if (search) query = query.or(`title.ilike.%${search}%,username.ilike.%${search}%,url.ilike.%${search}%,notes.ilike.%${search}%`);

  const { data: entries, error } = await query;
  if (error) throw new DatabaseError(error.message);

  // Decrypt passwords for response
  const decrypted = (entries || []).map(e => ({
    ...e,
    password: e.encrypted_password ? decrypt(e.encrypted_password) : null,
    encrypted_password: undefined,
  }));

  // Enrich with client names
  const enriched = await Promise.all(decrypted.map(async (e) => {
    if (e.client_id) {
      const { data: client } = await db.from('portal_clients').select('name').eq('id', e.client_id).single();
      return { ...e, client_name: client?.name || null };
    }
    return { ...e, client_name: null };
  }));

  // Stats
  const stats = {
    total: enriched.length,
    logins: enriched.filter(e => e.category === 'login').length,
    api_keys: enriched.filter(e => e.category === 'api_key').length,
    links: enriched.filter(e => e.category === 'link').length,
    favorites: enriched.filter(e => e.is_favorite).length,
  };

  return { entries: enriched, stats };
});

// POST /api/vault
export const POST = createHandler({
  auth: true,
  schema: CreateEntrySchema,
}, async (data: CreateEntryInput) => {
  const { password, ...rest } = data;

  const insertData: Record<string, unknown> = {
    ...rest,
    encrypted_password: password ? encrypt(password) : null,
    tags: data.tags || [],
  };
  // Remove password field (we use encrypted_password)
  delete (insertData as any).password;

  const { data: entry, error } = await db
    .from('vault_entries')
    .insert(insertData)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { entry: { ...entry, password: password || null, encrypted_password: undefined } };
});
