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
import { logActivity } from '@/lib/activity';

// ─────────────────────────────────────────────────────────────────
// GET /api/invoices - List all invoices
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const clientId = searchParams.get('clientId');
  const type = searchParams.get('type');

  // Simple select without FK joins (avoid schema cache issues)
  let query = db
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (clientId) {
    query = query.eq('client_id', clientId);
  }
  if (type) {
    query = query.eq('type', type);
  }

  const { data: invoices, error } = await query;

  if (error) throw new DatabaseError(error.message);

  // Manually fetch client/project names if needed
  const enrichedInvoices = await Promise.all((invoices || []).map(async (inv) => {
    let clientName = null;
    let projectName = null;
    
    if (inv.client_id) {
      const { data: client } = await db
        .from('portal_clients')
        .select('name, email, company')
        .eq('id', inv.client_id)
        .single();
      if (client) clientName = client.name;
    }
    
    if (inv.project_id) {
      const { data: project } = await db
        .from('portal_projects')
        .select('name')
        .eq('id', inv.project_id)
        .single();
      if (project) projectName = project.name;
    }
    
    return { ...inv, client_name: clientName, project_name: projectName };
  }));

  // Calculate stats (match frontend interface names)
  const totalRevenue = enrichedInvoices.reduce((sum, i) => sum + (i.total || 0), 0);
  const paidAmount = enrichedInvoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0);
  
  const stats = {
    total: enrichedInvoices.length,
    draft: enrichedInvoices.filter(i => i.status === 'draft').length,
    sent: enrichedInvoices.filter(i => i.status === 'sent').length,
    paid: enrichedInvoices.filter(i => i.status === 'paid').length,
    overdue: enrichedInvoices.filter(i => i.status === 'overdue').length,
    totalRevenue,
    pendingAmount: totalRevenue - paidAmount,
  };

  return { invoices: enrichedInvoices, stats };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/invoices - Create new invoice
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
  schema: CreateInvoiceSchema,
}, async (data: CreateInvoiceInput) => {
  const {
    client_id, client_name, client_email, client_company, client_address,
    project_id, items, tax_rate, discount_percent = 0, due_date, notes,
    type = 'invoice',
  } = data;

  // Get client info - either from ID or use provided details
  let clientName = client_name || '';
  let clientEmail = client_email || '';
  let clientCompany = client_company || null;
  
  if (client_id) {
    const { data: client } = await db
      .from('portal_clients')
      .select('id, name, email, company')
      .eq('id', client_id)
      .single();

    if (client) {
      clientName = client.name;
      clientEmail = client.email;
      clientCompany = client.company;
    }
  }

  // Calculate totals with discount
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const discount_amount = Math.round(subtotal * discount_percent) / 100;
  const afterDiscount = subtotal - discount_amount;
  const tax_amount = Math.round(afterDiscount * tax_rate) / 100;
  const total = afterDiscount + tax_amount;

  // Generate number: AFM-YYYY-XXXX (invoice) or ANG-YYYY-XXXX (offer)
  const now = new Date();
  const numPrefix = type === 'offer' ? `ANG-${now.getFullYear()}` : `AFM-${now.getFullYear()}`;

  const { count } = await db
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .ilike('invoice_number', `${numPrefix}%`);

  const invoiceNumber = `${numPrefix}-${String((count || 0) + 1).padStart(4, '0')}`;

  // Create invoice/offer
  const { data: invoice, error } = await db
    .from('invoices')
    .insert({
      client_id: client_id || null,
      invoice_number: invoiceNumber,
      type,
      client_name: clientName,
      client_email: clientEmail,
      client_company: clientCompany,
      subtotal,
      discount_percent,
      discount_amount,
      tax_rate,
      tax_amount,
      total,
      status: 'draft',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: due_date.includes('T') ? due_date.split('T')[0] : due_date,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  // Insert invoice items
  if (invoice && items.length > 0) {
    const invoiceItems = items.map((item, index) => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.quantity * item.unit_price,
      sort_order: index,
    }));

    const { error: itemsError } = await db
      .from('invoice_items')
      .insert(invoiceItems);

    if (itemsError) {
      // Rollback: delete the invoice if items failed
      await db.from('invoices').delete().eq('id', invoice.id);
      throw new DatabaseError(`Failed to create invoice items: ${itemsError.message}`);
    }
  }

  await logActivity('invoice_created', 'invoice', invoice.id, invoiceNumber, { total, client_name: clientName });

  return { invoice };
});
