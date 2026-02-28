/**
 * ═══════════════════════════════════════════════════════════════
 *                    LEADS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateLeadSchema,
  ConflictError,
  DatabaseError,
  type CreateLeadInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/leads - List all leads
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const source = searchParams.get('source');

  let query = db
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (source) {
    query = query.eq('source', source);
  }

  const { data: leads, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Get counts by status
  const { data: statusCounts } = await db
    .from('leads')
    .select('status')
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      (data || []).forEach((l: any) => {
        counts[l.status] = (counts[l.status] || 0) + 1;
      });
      return { data: counts };
    });

  return {
    leads: leads || [],
    counts: statusCounts || {},
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/leads - Create new lead (can be public)
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: false, // Public endpoint for contact forms
  schema: CreateLeadSchema,
}, async (data: CreateLeadInput) => {
  const { name, email, company, phone, message, source, package_interest } = data;

  // Check for duplicate email in last 24h (prevent spam)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  
  const { data: recent } = await db
    .from('leads')
    .select('id')
    .eq('email', email)
    .gte('created_at', oneDayAgo)
    .single();

  if (recent) {
    throw new ConflictError('A request with this email was submitted recently');
  }

  const { data: lead, error } = await db
    .from('leads')
    .insert({
      name,
      email,
      company: company || null,
      phone: phone || null,
      message: message || null,
      source: source || 'website',
      package_interest: package_interest || null,
      status: 'new',
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  // Create notification for new lead
  await db.from('notifications').insert({
    title: 'Neue Anfrage',
    message: `${name} hat eine Anfrage gesendet`,
    type: 'info',
    link: `/leads/${lead.id}`,
    is_read: false,
  });

  return { lead };
});
