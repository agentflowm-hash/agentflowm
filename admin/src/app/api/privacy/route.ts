/**
 * ═══════════════════════════════════════════════════════════════
 *                    PRIVACY / DATENSCHUTZ API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import { z } from 'zod';

const CreateDocSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  category: z.enum(['datenschutz', 'impressum', 'avv', 'loeschkonzept', 'tom', 'einwilligung', 'other']).default('other'),
  content: z.string().max(100000).default(''),
  is_template: z.boolean().optional().default(false),
});

const CreateRequestSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  request_type: z.enum(['access', 'deletion', 'rectification', 'restriction', 'portability', 'objection']),
  description: z.string().max(5000).optional().nullable(),
  deadline: z.string().optional().nullable(),
});

const CreateProcessingSchema = z.object({
  name: z.string().min(1).max(200),
  purpose: z.string().min(1).max(1000),
  legal_basis: z.string().min(1).max(500),
  data_categories: z.string().max(1000).optional().nullable(),
  recipients: z.string().max(1000).optional().nullable(),
  retention: z.string().max(500).optional().nullable(),
  security_measures: z.string().max(1000).optional().nullable(),
});

// GET /api/privacy — returns all data
export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const type = request.nextUrl.searchParams.get('type'); // documents, requests, processing

  if (type === 'requests') {
    const { data, error } = await db.from('privacy_requests').select('*').order('created_at', { ascending: false });
    if (error) throw new DatabaseError(error.message);
    return { requests: data || [] };
  }

  if (type === 'processing') {
    const { data, error } = await db.from('privacy_processing').select('*').order('name');
    if (error) throw new DatabaseError(error.message);
    return { processing: data || [] };
  }

  // Default: documents
  const { data: docs, error: docsErr } = await db.from('privacy_documents').select('*').order('updated_at', { ascending: false });
  if (docsErr) throw new DatabaseError(docsErr.message);

  const { data: requests } = await db.from('privacy_requests').select('*').order('created_at', { ascending: false });
  const { data: processing } = await db.from('privacy_processing').select('*').order('name');

  return {
    documents: docs || [],
    requests: requests || [],
    processing: processing || [],
    stats: {
      documents: (docs || []).length,
      activeDocuments: (docs || []).filter(d => d.status === 'active').length,
      pendingRequests: (requests || []).filter(r => r.status === 'pending' || r.status === 'in_progress').length,
      processingActivities: (processing || []).filter(p => p.status === 'active').length,
    },
  };
});

// POST /api/privacy — create document, request, or processing
export const POST = createHandler({ auth: true }, async (data: any) => {
  const type = data._type; // 'document', 'request', 'processing'

  if (type === 'request') {
    const parsed = CreateRequestSchema.parse(data);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30); // DSGVO: 30 Tage Frist
    const { data: request, error } = await db.from('privacy_requests').insert({
      ...parsed,
      deadline: parsed.deadline || deadline.toISOString().split('T')[0],
    }).select().single();
    if (error) throw new DatabaseError(error.message);
    return { request };
  }

  if (type === 'processing') {
    const parsed = CreateProcessingSchema.parse(data);
    const { data: proc, error } = await db.from('privacy_processing').insert(parsed).select().single();
    if (error) throw new DatabaseError(error.message);
    return { processing: proc };
  }

  // Default: document
  const parsed = CreateDocSchema.parse(data);
  const { data: doc, error } = await db.from('privacy_documents').insert(parsed).select().single();
  if (error) throw new DatabaseError(error.message);
  return { document: doc };
});
