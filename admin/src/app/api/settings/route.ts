import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

// GET /api/settings
export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('admin_settings').select('*');
  if (error) return { settings: {}, error: error.message };
  const settings: Record<string, any> = {};
  (data || []).forEach((row: any) => { settings[row.key] = row.value; });
  return { settings };
});

// PUT /api/settings
export const PUT = createHandler({ auth: true }, async (data) => {
  const { key, value } = data as any;
  if (!key) return { error: 'Key is required' };

  const { error } = await db
    .from('admin_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

  if (error) return { error: error.message };
  return { success: true };
});
