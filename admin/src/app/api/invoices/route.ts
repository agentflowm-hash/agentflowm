/**
 * ═══════════════════════════════════════════════════════════════
 *                    INVOICES API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  CreateInvoiceSchema,
  NotFoundError,
  DatabaseError,
  type CreateInvoiceInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/invoices - List all invoices
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const clientId = searchParams.get('clientId');

  let query = db
    .from('invoices')
    .select(`
      *,
      portal_clients (
        id,
        name,
        email,
        company
      ),
      portal_projects (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (clientId) {
    query = query.eq('client_id', clientId);
  }

  const { data: invoices, error } = await query;

  if (error) throw new DatabaseError(error.message);

  return { invoices: invoices || [] };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/invoices - Create new invoice
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateInvoiceSchema,
}, async (data: CreateInvoiceInput) => {
  const { client_id, project_id, items, tax_rate, due_date, notes } = data;

  // Verify client exists
  const { data: client } = await db
    .from('portal_clients')
    .select('id, name, email')
    .eq('id', client_id)
    .single();

  if (!client) {
    throw new NotFoundError('Client');
  }

  // Calculate totals
  const amount = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const tax_amount = Math.round(amount * tax_rate) / 100;
  const total = amount + tax_amount;

  // Generate invoice number: INV-YYYYMM-XXXX
  const now = new Date();
  const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const { count } = await db
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .ilike('invoice_number', `${prefix}%`);

  const invoiceNumber = `${prefix}-${String((count || 0) + 1).padStart(4, '0')}`;

  // Create invoice
  const { data: invoice, error } = await db
    .from('invoices')
    .insert({
      client_id,
      project_id: project_id || null,
      invoice_number: invoiceNumber,
      amount,
      tax_rate,
      tax_amount,
      total,
      status: 'draft',
      due_date,
      items,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { invoice };
});
