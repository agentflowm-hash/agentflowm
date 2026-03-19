/**
 * ═══════════════════════════════════════════════════════════════
 *                    RECURRING BILLING API
 * ═══════════════════════════════════════════════════════════════
 * Generates invoices for subscriptions where next_billing <= today
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';
import { logActivity } from '@/lib/activity';

// Interval → months to add
const INTERVAL_MONTHS: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

export const POST = createHandler({
  auth: true,
}, async () => {
  const today = new Date().toISOString().split('T')[0];

  // Find all active subscriptions due for billing
  const { data: dueSubs, error: subError } = await db
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .lte('next_billing', today);

  if (subError) throw new DatabaseError(subError.message);

  if (!dueSubs || dueSubs.length === 0) {
    return { generated: 0, invoices: [] };
  }

  const generatedInvoices: any[] = [];

  for (const sub of dueSubs) {
    // Generate invoice number
    const now = new Date();
    const numPrefix = `AFM-${now.getFullYear()}`;

    const { count } = await db
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .ilike('invoice_number', `${numPrefix}%`);

    const invoiceNumber = `${numPrefix}-${String((count || 0) + 1).padStart(4, '0')}`;

    // Calculate amounts
    const amount = parseFloat(String(sub.amount)) || 0;
    const taxRate = parseFloat(String(sub.tax_rate)) || 19;
    const taxAmount = Math.round(amount * taxRate) / 100;
    const total = amount + taxAmount;

    // Due date: 14 days from now
    const dueDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    // Create invoice
    const { data: invoice, error: invError } = await db
      .from('invoices')
      .insert({
        client_id: sub.client_id || null,
        invoice_number: invoiceNumber,
        type: 'invoice',
        client_name: sub.client_name || '',
        client_email: sub.client_email || '',
        subtotal: amount,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        status: 'draft',
        issue_date: today,
        due_date: dueDate,
        notes: `Abo-Rechnung: ${sub.plan || sub.description || 'Abo'} (${sub.interval || 'monthly'})`,
      })
      .select()
      .single();

    if (invError) {
      continue;
    }

    // Create invoice item
    await db.from('invoice_items').insert({
      invoice_id: invoice.id,
      description: sub.plan || sub.description || 'Abo-Leistung',
      quantity: 1,
      unit_price: amount,
      total: amount,
      sort_order: 0,
    });

    // Auto-send the generated invoice if client has email
    if (sub.client_email && invoice.id) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de';
        await fetch(`${baseUrl}/api/invoices/${invoice.id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email_override: sub.client_email }),
        });
      } catch {
        // E-Mail-Versand soll Abo-Erzeugung nicht blockieren
      }
    }

    // Calculate next billing date
    const nextBilling = new Date(sub.next_billing);
    const monthsToAdd = INTERVAL_MONTHS[sub.interval] || 1;
    nextBilling.setMonth(nextBilling.getMonth() + monthsToAdd);

    // Update subscription
    await db
      .from('subscriptions')
      .update({
        next_billing: nextBilling.toISOString().split('T')[0],
        last_billed: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sub.id);

    await logActivity('invoice_created', 'invoice', invoice.id, invoiceNumber, {
      total,
      client_name: sub.client_name,
      source: 'recurring_billing',
    });

    generatedInvoices.push(invoice);
  }

  return { generated: generatedInvoices.length, invoices: generatedInvoices };
});
