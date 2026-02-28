import { createHandler } from '@/lib/api/handler';
import { db } from '@/lib/db';
import { z } from 'zod';
import { DatabaseError } from '@/lib/api/errors';

// ─────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────

const CreateAgreementSchema = z.object({
  client_id: z.number().optional(),
  client_name: z.string().min(1),
  client_company: z.string().optional(),
  client_address: z.string().optional(),
  client_email: z.string().email().optional(),
  project_title: z.string().min(1),
  project_description: z.string().optional(),
  services: z.array(z.string()).optional(),
  amount: z.number().min(0),
  tax_rate: z.number().default(19),
  payment_terms: z.string().optional(),
  project_duration: z.string().optional(),
  start_date: z.string().optional(),
  portal_code: z.string().optional(),
  notes: z.string().optional(),
});

type CreateAgreementInput = z.infer<typeof CreateAgreementSchema>;

// ─────────────────────────────────────────────────────────────────
// GET /api/agreements - List all agreements
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async () => {
  const { data: agreements, error } = await db
    .from('agreements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  // Calculate stats
  const stats = {
    total: agreements?.length || 0,
    draft: agreements?.filter(a => a.status === 'draft').length || 0,
    sent: agreements?.filter(a => a.status === 'sent').length || 0,
    signed: agreements?.filter(a => a.status === 'signed').length || 0,
    totalValue: agreements?.reduce((sum, a) => sum + (parseFloat(a.total_amount) || 0), 0) || 0,
    signedValue: agreements?.filter(a => a.status === 'signed').reduce((sum, a) => sum + (parseFloat(a.total_amount) || 0), 0) || 0,
  };

  return { agreements: agreements || [], stats };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/agreements - Create new agreement
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateAgreementSchema,
}, async (data: CreateAgreementInput) => {
  const {
    client_id, client_name, client_company, client_address, client_email,
    project_title, project_description, services,
    amount, tax_rate, payment_terms, project_duration, start_date,
    portal_code, notes
  } = data;

  // Calculate tax
  const tax_amount = Math.round(amount * tax_rate) / 100;
  const total_amount = amount + tax_amount;

  // Generate agreement number: AFM-V-YYYY-XXXX
  const now = new Date();
  const prefix = `AFM-V-${now.getFullYear()}`;
  
  const { count } = await db
    .from('agreements')
    .select('*', { count: 'exact', head: true })
    .ilike('agreement_number', `${prefix}%`);

  const agreementNumber = `${prefix}-${String((count || 0) + 1).padStart(4, '0')}`;

  // Generate portal code if not provided
  const generatedPortalCode = portal_code || generatePortalCode(client_name);

  // Create agreement
  const { data: agreement, error } = await db
    .from('agreements')
    .insert({
      agreement_number: agreementNumber,
      client_id: client_id || null,
      client_name,
      client_company: client_company || null,
      client_address: client_address || null,
      client_email: client_email || null,
      project_title,
      project_description: project_description || null,
      services: services || [],
      amount,
      tax_rate,
      tax_amount,
      total_amount,
      payment_terms: payment_terms || '100% bei Vertragsstart',
      project_duration: project_duration || null,
      start_date: start_date ? new Date(start_date).toISOString().split('T')[0] : null,
      portal_code: generatedPortalCode,
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      notes: notes || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { agreement };
});

// Helper to generate portal code like "0SAM-2898"
function generatePortalCode(name: string): string {
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
  const padded = prefix.padEnd(4, 'X');
  const numbers = Math.floor(1000 + Math.random() * 9000);
  return `${padded}-${numbers}`;
}
