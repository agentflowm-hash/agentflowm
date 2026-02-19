import { NextRequest, NextResponse } from "next/server";
import {
  generateInvoiceHTML,
  generateInvoiceNumber,
  calculateInvoiceTotals,
  formatDate,
  AGENTFLOW_COMPANY,
  type InvoiceData,
  type InvoiceTemplateData,
} from "@/lib/invoice-generator";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      discount,
      vatRate = 19,
      notes,
      paymentStatus = "pending",
      paidDate,
      paymentMethod,
      stripeSessionId,
    } = body;

    // Validate required fields
    if (!customer || !customer.name || !customer.address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Kundendaten und mindestens eine Position sind erforderlich" },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate = new Date().toISOString();
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days

    // Calculate totals
    const totals = calculateInvoiceTotals(items, vatRate, discount?.amount);

    // Build invoice data
    const invoiceData: InvoiceTemplateData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      customer: {
        name: customer.name,
        company: customer.company,
        address: customer.address,
        zip: customer.zip,
        city: customer.city,
        country: customer.country || "Deutschland",
        email: customer.email,
      },
      items,
      subtotal: totals.subtotal,
      discount,
      vatRate: totals.vatRate,
      vatAmount: totals.vatAmount,
      total: totals.total,
      paymentMethod,
      paymentStatus,
      paidDate,
      stripeSessionId,
      notes,
      company: AGENTFLOW_COMPANY,
    };

    // Generate HTML
    const html = generateInvoiceHTML(invoiceData);

    // Save to Supabase
    try {
      await supabaseAdmin.from("invoices").insert({
        invoice_number: invoiceNumber,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_company: customer.company,
        items: JSON.stringify(items),
        subtotal: totals.subtotal,
        discount_amount: discount?.amount || 0,
        vat_rate: vatRate,
        vat_amount: totals.vatAmount,
        total: totals.total,
        status: paymentStatus,
        stripe_session_id: stripeSessionId,
        invoice_date: invoiceDate,
        due_date: dueDate,
        paid_date: paidDate,
        html_content: html,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("Failed to save invoice to database:", dbError);
      // Continue anyway - invoice generation is more important
    }

    return NextResponse.json({
      success: true,
      invoiceNumber,
      invoiceDate: formatDate(invoiceDate),
      dueDate: formatDate(dueDate),
      totals: {
        subtotal: totals.subtotal,
        vatAmount: totals.vatAmount,
        total: totals.total,
      },
      html,
    });
  } catch (error: any) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: error.message || "Rechnungserstellung fehlgeschlagen" },
      { status: 500 }
    );
  }
}

// GET: Retrieve invoice by number
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceNumber = searchParams.get("number");

  if (!invoiceNumber) {
    return NextResponse.json(
      { error: "Rechnungsnummer erforderlich" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .eq("invoice_number", invoiceNumber)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Rechnung nicht gefunden" },
        { status: 404 }
      );
    }

    // Return HTML for rendering
    return new NextResponse(data.html_content, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
