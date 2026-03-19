/**
 * ═══════════════════════════════════════════════════════════════
 *                    ACCOUNTING TRANSACTION [ID] API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError, NotFoundError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/accounting/[id]
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data: any, _ctx: any, request: any) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!, 10);

  const { data: transaction, error } = await db
    .from('accounting_transactions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new NotFoundError('Buchung');
  return { transaction };
});

// ─────────────────────────────────────────────────────────────────
// PUT /api/accounting/[id] — Update with recalculated tax
// ─────────────────────────────────────────────────────────────────

export const PUT = createHandler({
  auth: true,
}, async (data: any, _ctx: any, request: any) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!, 10);
  const { date, description, category, type, amount, tax_rate, account, reference, notes } = data;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new DatabaseError('Betrag muss eine positive Zahl sein');
  }

  const rate = tax_rate ?? 19;
  const taxAmount = Math.round((amount * rate) / (100 + rate) * 100) / 100;
  const netAmount = Math.round((amount - taxAmount) * 100) / 100;

  const { data: transaction, error } = await db
    .from('accounting_transactions')
    .update({
      date,
      description,
      category,
      type,
      amount,
      tax_rate: rate,
      tax_amount: taxAmount,
      net_amount: netAmount,
      account: account || 'Geschäftskonto',
      reference: reference || null,
      notes: notes || null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);
  return { transaction };
});

// ─────────────────────────────────────────────────────────────────
// DELETE /api/accounting/[id]
// ─────────────────────────────────────────────────────────────────

export const DELETE = createHandler({
  auth: true,
}, async (_data: any, _ctx: any, request: any) => {
  const id = parseInt(request.nextUrl.pathname.split('/').pop()!, 10);

  const { error } = await db
    .from('accounting_transactions')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);
  return { deleted: true };
});
