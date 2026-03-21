import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// GET - PDF fuer eine Rechnung abrufen (Proxy zum Admin-API)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoiceId = params.id;

    // Verify this invoice belongs to this client
    const { data: invoice } = await supabaseAdmin
      .from('invoices')
      .select('id, client_id, client_name, invoice_number')
      .eq('id', invoiceId)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: 'Rechnung nicht gefunden' }, { status: 404 });
    }

    // Security: Only allow access to own invoices
    const isOwner = invoice.client_id === client.id ||
      invoice.client_name?.toLowerCase() === client.name?.toLowerCase();

    if (!isOwner) {
      return NextResponse.json({ error: 'Kein Zugriff' }, { status: 403 });
    }

    // Proxy to admin API for PDF generation
    const adminUrl = process.env.ADMIN_API_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de';
    const pdfRes = await fetch(`${adminUrl}/api/invoices/${invoiceId}/pdf`, {
      headers: { 'Cookie': `agentflow_admin_session=${process.env.ADMIN_SESSION_TOKEN || ''}` },
    });

    if (!pdfRes.ok) {
      // Fallback: Return invoice data as JSON if PDF proxy fails
      return NextResponse.json({
        error: 'PDF-Generierung nicht verfuegbar',
        invoice: {
          number: invoice.invoice_number,
          hint: 'Bitte kontaktieren Sie uns fuer eine PDF-Kopie.',
        },
      }, { status: 503 });
    }

    const pdfBuffer = await pdfRes.arrayBuffer();
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${invoice.invoice_number || 'rechnung'}.pdf"`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
