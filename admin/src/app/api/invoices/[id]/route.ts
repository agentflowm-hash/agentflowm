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
import { logActivity } from '@/lib/activity';

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

  // Check if invoice exists with full data
  const { data: existing } = await db
    .from('invoices')
    .select('id, status, client_id, client_name, total, invoice_number, referrer_id, commission_id')
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
  }

  if (data.status !== undefined) {
    const validStatuses = ['draft', 'sent', 'paid', 'overdue', 'cancelled'];
    if (!validStatuses.includes(data.status)) {
      throw new DatabaseError(`Ungueltiger Status: ${data.status}`);
    }
    // Verhindere unsinnige Uebergaenge
    const blocked: Record<string, string[]> = {
      paid: ['draft'], // Bezahlt kann nicht zurueck zu Entwurf
      cancelled: ['paid'], // Storniert kann nicht zu Bezahlt
    };
    if (blocked[existing.status]?.includes(data.status)) {
      throw new DatabaseError(`Status kann nicht von "${existing.status}" zu "${data.status}" geaendert werden`);
    }
    updateData.status = data.status;
  }
  if (data.due_date !== undefined) updateData.due_date = data.due_date;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const { data: invoice, error } = await db
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  // Log status change activity
  if (data.status !== undefined && data.status !== existing.status) {
    await logActivity('invoice_status_changed', 'invoice', Number(id), existing.invoice_number, { old_status: existing.status, new_status: data.status });

    // Notification: Rechnung bezahlt
    if (data.status === 'paid') {
      let clientName = '';
      if (existing.client_id) {
        const { data: cl } = await db.from('portal_clients').select('name').eq('id', existing.client_id).single();
        clientName = cl?.name || '';
      }
      await db.from('notifications').insert({
        title: 'Rechnung bezahlt',
        message: `${existing.invoice_number || '#' + id}: ${existing.total ? Number(existing.total).toLocaleString('de-DE') + ' EUR' : ''} von ${clientName} erhalten`,
        type: 'success',
        link: `/invoices`,
        read: false,
      });
    }
  }

  // ═══════════════════════════════════════════════════════════
  // AUTO-PROVISION: Wenn Rechnung auf "paid" → Provision erstellen
  // ═══════════════════════════════════════════════════════════
  if (data.status === 'paid' && existing.status !== 'paid' && !existing.commission_id) {
    try {
      let referrerId: number | null = existing.referrer_id || null;

      // Falls kein referrer_id auf der Rechnung, prüfe den Client
      if (!referrerId && existing.client_id) {
        const { data: client } = await db
          .from('portal_clients')
          .select('referrer_id, lead_id')
          .eq('id', existing.client_id)
          .single();

        if (client?.referrer_id) {
          referrerId = client.referrer_id;
        } else if (client?.lead_id) {
          // Fallback: Prüfe den Original-Lead
          const { data: lead } = await db
            .from('leads')
            .select('referrer_id')
            .eq('id', client.lead_id)
            .single();
          if (lead?.referrer_id) referrerId = lead.referrer_id;
        }
      }

      if (referrerId) {
        // Duplikat-Pruefung: Gibt es schon eine Provision fuer diese Rechnung?
        const { data: existingCommission } = await db
          .from('referral_commissions')
          .select('id')
          .eq('notes', `Rechnung ${existing.invoice_number || '#' + id} bezahlt`)
          .maybeSingle();

        if (existingCommission) {
          // Provision existiert bereits, ueberspringe
        } else {
        // Referrer-Daten holen
        const { data: referrer } = await db
          .from('referrers')
          .select('id, name, commission_rate, total_commission')
          .eq('id', referrerId)
          .single();

        if (referrer) {
          const dealValue = parseFloat(String(existing.total || 0));
          const rate = parseFloat(String(referrer.commission_rate)) || 10;
          const commissionAmount = Math.round(dealValue * rate) / 100;
          const now = new Date();
          const payoutMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

          // Provision erstellen
          const { data: commission } = await db
            .from('referral_commissions')
            .insert({
              referrer_id: referrerId,
              deal_value: dealValue,
              commission_rate: rate,
              commission_amount: commissionAmount,
              notes: `Rechnung ${existing.invoice_number || '#' + id} bezahlt`,
              status: 'pending',
              payout_month: payoutMonth,
            })
            .select()
            .single();

          if (commission) {
            // Verknüpfung auf der Rechnung speichern
            await db.from('invoices').update({
              referrer_id: referrerId,
              commission_id: commission.id,
            }).eq('id', id);

            // Referrer total_commission aktualisieren
            const newTotal = (parseFloat(String(referrer.total_commission)) || 0) + commissionAmount;
            await db.from('referrers').update({
              total_commission: newTotal,
              total_referrals: (referrer as any).total_referrals ? (referrer as any).total_referrals + 1 : 1,
              updated_at: now.toISOString(),
            }).eq('id', referrerId);

            // Notification
            await db.from('notifications').insert({
              title: 'Provision automatisch erstellt',
              message: `${commissionAmount.toLocaleString('de-DE')}€ Provision für ${referrer.name} (Rechnung ${existing.invoice_number || '#' + id})`,
              type: 'info',
              read: false,
            });
          }
        }
        } // end else (no existing commission)
      }
    } catch {
      // Fehler bei Provision soll Rechnungs-Update nicht blockieren
    }
  }

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

  // Delete invoice items first (FK constraint)
  await db.from('invoice_items').delete().eq('invoice_id', id);

  // Delete the invoice
  const { error } = await db
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw new DatabaseError(error.message);

  return { deleted: true };
});
