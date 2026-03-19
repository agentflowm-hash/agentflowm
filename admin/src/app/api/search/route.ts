/**
 * ═══════════════════════════════════════════════════════════════
 *                    GLOBAL SEARCH API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const q = request.nextUrl.searchParams.get('q');
  if (!q || q.length < 2 || q.length > 100) return { results: [], total: 0 };

  // Escape SQL wildcards in user input
  const escaped = q.replace(/[%_\\]/g, '\\$&');
  const pattern = `%${escaped}%`;
  const results: { type: string; id: number; title: string; subtitle: string }[] = [];

  // Leads
  const { data: leads } = await db.from('leads').select('id, name, email, company, source')
    .or(`name.ilike.${pattern},email.ilike.${pattern},company.ilike.${pattern}`).limit(5);
  (leads || []).forEach(l => results.push({ type: 'lead', id: l.id, title: l.name, subtitle: [l.email, l.company, l.source].filter(Boolean).join(' · ') }));

  // Clients
  const { data: clients } = await db.from('portal_clients').select('id, name, email, company')
    .or(`name.ilike.${pattern},email.ilike.${pattern},company.ilike.${pattern}`).limit(5);
  (clients || []).forEach(c => results.push({ type: 'client', id: c.id, title: c.name, subtitle: [c.email, c.company].filter(Boolean).join(' · ') }));

  // Invoices
  const { data: invoices } = await db.from('invoices').select('id, invoice_number, client_name, total, status')
    .or(`invoice_number.ilike.${pattern},client_name.ilike.${pattern}`).limit(5);
  (invoices || []).forEach(i => results.push({ type: 'invoice', id: i.id, title: i.invoice_number, subtitle: `${i.client_name || ''} · €${i.total} · ${i.status}` }));

  // Vault (nur Titel + Kategorie, KEINE URLs oder Passwoerter)
  const { data: vault } = await db.from('vault_entries').select('id, title, category')
    .ilike('title', pattern).limit(5);
  (vault || []).forEach(v => results.push({ type: 'vault', id: v.id, title: v.title, subtitle: v.category || 'Tresor' }));

  return { results: results.slice(0, 20), total: results.length };
});
