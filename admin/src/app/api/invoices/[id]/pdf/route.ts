import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoiceHTML } from "@/lib/invoice-template";
import { generateOfferHTML, PACKAGE_TEMPLATES } from "@/lib/offer-template";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Generate PDF for invoice (returns HTML for now, PDF via browser print)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "html";

    // Get invoice with items
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`*, invoice_items (*)`)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Transform items to template format
    const items = invoice.invoice_items.map((item: any) => ({
      title: item.description.split('\n')[0] || item.description,
      description: item.description.includes('\n') 
        ? item.description.split('\n').slice(1).join('\n')
        : `Menge: ${item.quantity}`,
      amount: parseFloat(item.total),
    }));

    // Determine payment due text
    let paymentDue = "sofort";
    if (invoice.due_date) {
      const dueDate = new Date(invoice.due_date);
      const issueDate = new Date(invoice.issue_date);
      const diffDays = Math.ceil((dueDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) paymentDue = "sofort";
      else if (diffDays <= 7) paymentDue = "innerhalb 7 Tagen";
      else if (diffDays <= 14) paymentDue = "innerhalb 14 Tagen";
      else if (diffDays <= 30) paymentDue = "innerhalb 30 Tagen";
      else paymentDue = `bis ${dueDate.toLocaleDateString('de-DE')}`;
    }

    // Calculate values
    const subtotal = parseFloat(invoice.subtotal);
    const discountPercent = parseFloat(invoice.discount_percent || 0);
    const discountAmount = parseFloat(invoice.discount_amount || 0);
    const netAfterDiscount = subtotal - discountAmount;
    const taxRate = parseFloat(invoice.tax_rate);
    const taxAmount = parseFloat(invoice.tax_amount);
    const total = parseFloat(invoice.total);

    // Check if this is an offer
    const isOffer = invoice.type === 'offer' || invoice.invoice_number?.startsWith('ANG');

    if (isOffer) {
      // Use the new offer template
      const firstItem = items[0] || { title: '', description: '' };
      const packageKey = Object.keys(PACKAGE_TEMPLATES).find(k =>
        firstItem.title?.toLowerCase().includes(k.toLowerCase().split(' ')[0]) ||
        invoice.notes?.toLowerCase().includes(k.toLowerCase())
      );
      const tpl = packageKey ? PACKAGE_TEMPLATES[packageKey] : {};

      const offerHtml = generateOfferHTML({
        offer_number: invoice.invoice_number,
        issue_date: invoice.issue_date,
        valid_until: invoice.due_date || new Date(Date.now() + 30 * 86400000).toISOString(),
        client_name: invoice.client_name || '',
        client_company: invoice.client_company || undefined,
        client_email: invoice.client_email || undefined,
        package_name: tpl.package_name || firstItem.title || 'Individuelles Angebot',
        package_subtitle: tpl.package_subtitle || firstItem.description?.split('\n')[0] || '',
        package_description: tpl.package_description || firstItem.description || '',
        badges: tpl.badges || ['Professionelle Umsetzung', 'Saubere Übergabe'],
        services: tpl.services || items.map((it: any) => ({ title: it.title, description: it.description })),
        steps: tpl.steps || [
          { title: 'Analyse', subtitle: '' },
          { title: 'Konzept', subtitle: '' },
          { title: 'Umsetzung', subtitle: '' },
          { title: 'Übergabe', subtitle: '' },
        ],
        timeline: tpl.timeline || '2–4 Wochen',
        price_net: total - taxAmount,
        tax_rate: taxRate,
        payment_terms: invoice.notes?.includes('70%') ? '70/30' : invoice.notes?.includes('100%') ? '100' : '50/50',
        kurzueberblick: tpl.kurzueberblick,
        ausgangslage: tpl.ausgangslage,
        zielbild: tpl.zielbild,
        notes: invoice.notes,
      });

      if (format === "html") {
        return new NextResponse(offerHtml, { headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
      return new NextResponse(offerHtml, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="Angebot-${invoice.invoice_number}.html"`,
        },
      });
    }

    // Regular invoice template
    const html = generateInvoiceHTML({
      document_type: 'invoice',
      invoice_number: invoice.invoice_number.replace('AFM-', ''),
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      client_name: invoice.client_name,
      client_company: invoice.client_company,
      client_address: invoice.client_address,
      client_email: invoice.client_email,
      items,
      subtotal,
      discount_percent: discountPercent > 0 ? discountPercent : undefined,
      discount_amount: discountAmount > 0 ? discountAmount : undefined,
      net_after_discount: netAfterDiscount,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      payment_due: paymentDue,
      payment_terms: invoice.notes?.includes('50%') ? '50/50' : invoice.notes?.includes('70%') ? '70/30' : invoice.notes?.includes('100%') ? '100' : '50/50',
      notes: invoice.notes,
    });

    if (format === "html") {
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    }

    // For PDF, we return HTML with print instructions
    // In production, you'd use Puppeteer or similar
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="${isOffer ? 'Angebot' : 'Rechnung'}-${invoice.invoice_number}.html"`,
      },
    });
  } catch (error: any) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
