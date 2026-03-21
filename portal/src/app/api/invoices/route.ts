import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET - Rechnungen/Angebote des Kunden abrufen
export async function GET() {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rechnungen fuer diesen Kunden (nach Name oder client_id)
    const { data: invoices, error } = await supabaseAdmin
      .from('invoices')
      .select('id, invoice_number, type, status, issue_date, due_date, total, subtotal, tax_amount')
      .or(`client_id.eq.${client.id},client_name.ilike.%${client.name.replace(/[%_\\]/g, '\\$&')}%`)
      .in('status', ['sent', 'paid', 'overdue']) // Nur sichtbare (kein Draft/Cancelled)
      .order('issue_date', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
    }

    return NextResponse.json({
      invoices: (invoices || []).map(inv => ({
        id: inv.id,
        invoice_number: inv.invoice_number,
        type: inv.type || 'invoice',
        status: inv.status,
        issue_date: inv.issue_date,
        due_date: inv.due_date,
        total: inv.total,
        pdf_available: true,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
