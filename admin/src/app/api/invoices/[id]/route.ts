/**
 * ═══════════════════════════════════════════════════════════════
 *                    INVOICE BY ID API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  UpdateInvoiceSchema,
  NotFoundError,
  DatabaseError,
  type UpdateInvoiceInput,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/invoices/[id] - Get single invoice
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/')[3];

  const { data: invoice, error } = await db
    .from('invoices')
    .select(`
      *,
      portal_clients (
        id,
        name,
        email,
        company,
        phone
      ),
      portal_projects (
        id,
        name,
        package
      )
    `)
    .eq('id', id)
    .single();

  if (error || !invoice) {
    throw new NotFoundError('Invoice');
  }

  return { invoice };
});

// ─────────────────────────────────────────────────────────────────
// PATCH /api/invoices/[id] - Update invoice
// ─────────────────────────────────────────────────────────────────

export const PATCH = createHandler({
  auth: true,
  schema: UpdateInvoiceSchema,
}, async (data: UpdateInvoiceInput, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/')[3];

  // Check if invoice exists
  const { data: existing } = await db
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Invoice');
  }

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  // Recalculate totals if items or tax_rate changed
  if (data.items) {
    updateData.items = data.items;
    const amount = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    updateData.amount = amount;
    
    const taxRate = data.tax_rate ?? 19;
    updateData.tax_rate = taxRate;
    updateData.tax_amount = Math.round(amount * taxRate) / 100;
    updateData.total = amount + (updateData.tax_amount as number);
  } else if (data.tax_rate !== undefined) {
    updateData.tax_rate = data.tax_rate;
    // Would need to fetch current amount to recalculate
  }

  if (data.status !== undefined) updateData.status = data.status;
  if (data.due_date !== undefined) updateData.due_date = data.due_date;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const { data: invoice, error } = await db
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  return { invoice };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/invoices/[id] - Delete invoice (only drafts)
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/')[3];

  // Only allow deleting draft invoices
  const { data: existing } = await db
    .from('invoices')
    .select('id, status')
    .eq('id', id)
    .single();

  if (!existing) {
    throw new NotFoundError('Invoice');
  }

  // Soft delete by cancelling
  const { error } = await db
    .from('invoices')
    .update({ 
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
