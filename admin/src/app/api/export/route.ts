/**
 * ═══════════════════════════════════════════════════════════════
 *                    DATA EXPORT API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

const TABLE_MAP: Record<string, string> = {
  leads: 'leads',
  clients: 'portal_clients',
  invoices: 'invoices',
  accounting: 'accounting_transactions',
};

// Sensitive Spalten die nicht exportiert werden sollen
const HIDDEN_COLUMNS = new Set([
  'encrypted_password', 'password_hash', 'access_code', 'session_token',
  'api_key', 'secret', 'token', 'portal_code',
]);

function toCsv(data: any[]): string {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]).filter(h => !HIDDEN_COLUMNS.has(h));
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(';') || str.includes('\n') || str.includes('"')
        ? `"${str.replace(/"/g, '""')}"` : str;
    }).join(';')
  );
  return '\uFEFF' + [headers.join(';'), ...rows].join('\n');
}

export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') || 'leads';
  const format = searchParams.get('format') || 'csv';

  if (type === 'all') {
    const result: Record<string, any[]> = {};
    for (const [key, table] of Object.entries(TABLE_MAP)) {
      const { data, error } = await db.from(table).select('*').order('created_at', { ascending: false });
      if (error) throw new DatabaseError(error.message);
      result[key] = data || [];
    }
    return { export: result, format: 'json', tables: Object.keys(result) };
  }

  const table = TABLE_MAP[type];
  if (!table) throw new DatabaseError(`Unbekannter Export-Typ: ${type}`);

  const { data, error } = await db.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw new DatabaseError(error.message);

  // Sensitive Spalten aus den Daten entfernen
  const hiddenArr = Array.from(HIDDEN_COLUMNS);
  const cleanData = (data || []).map((row: any) => {
    const clean = { ...row };
    hiddenArr.forEach(col => delete clean[col]);
    return clean;
  });

  if (format === 'json') {
    return { export: cleanData, type, count: cleanData.length };
  }

  // CSV
  const csv = toCsv(cleanData);
  return { export: csv, type, format: 'csv', count: cleanData.length };
});
