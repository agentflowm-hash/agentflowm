/**
 * ═══════════════════════════════════════════════════════════════
 *                    EMAIL TEMPLATES API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateEmailTemplateSchema,
  ConflictError,
  DatabaseError,
  type CreateEmailTemplateInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/email-templates - List all templates
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  let query = db
    .from('email_templates')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data: templates, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Group by category for UI
  const grouped: Record<string, typeof templates> = {};
  (templates || []).forEach((t: any) => {
    const cat = t.category || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(t);
  });

  return {
    templates: templates || [],
    grouped,
    categories: Object.keys(grouped),
  };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/email-templates - Create template
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateEmailTemplateSchema,
}, async (data: CreateEmailTemplateInput) => {
  const { name, subject, body, category, variables } = data;

  // Check for duplicate name in category
  const { data: existing } = await db
    .from('email_templates')
    .select('id')
    .eq('name', name)
    .eq('category', category)
    .single();

  if (existing) {
    throw new ConflictError('A template with this name already exists in this category');
  }

  // Extract variables from body if not provided
  const extractedVars = variables.length > 0 
    ? variables 
    : extractVariables(body);

  const { data: template, error } = await db
    .from('email_templates')
    .insert({
      name,
      subject,
      body,
      category,
      variables: extractedVars,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { template };
});

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g) || [];
  const unique = new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '').trim()));
  return Array.from(unique);
}
