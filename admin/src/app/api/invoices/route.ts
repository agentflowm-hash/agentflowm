import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate invoice number: AFM-2026-0001
function generateInvoiceNumber(lastNumber: string | null): string {
  const year = new Date().getFullYear();
  const prefix = `AFM-${year}-`;
  
  if (!lastNumber || !lastNumber.startsWith(prefix)) {
    return `${prefix}0001`;
  }
  
  const currentNum = parseInt(lastNumber.split("-").pop() || "0");
  return `${prefix}${String(currentNum + 1).padStart(4, "0")}`;
}

// GET: List all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("client_id");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("invoices")
      .select(`
        *,
        invoice_items (*)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }
    if (clientId) {
      query = query.eq("client_id", parseInt(clientId));
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Get stats
    const { data: stats } = await supabase
      .from("invoices")
      .select("status, total")
      .then(({ data }) => {
        const s = {
          total: data?.length || 0,
          draft: 0,
          sent: 0,
          paid: 0,
          overdue: 0,
          totalRevenue: 0,
          pendingAmount: 0,
        };
        data?.forEach((inv: any) => {
          if (inv.status === "draft") s.draft++;
          if (inv.status === "sent") {
            s.sent++;
            s.pendingAmount += parseFloat(inv.total);
          }
          if (inv.status === "paid") {
            s.paid++;
            s.totalRevenue += parseFloat(inv.total);
          }
          if (inv.status === "overdue") {
            s.overdue++;
            s.pendingAmount += parseFloat(inv.total);
          }
        });
        return { data: s };
      });

    return NextResponse.json({
      invoices: data,
      stats,
      pagination: { limit, offset, total: count },
    });
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client_id,
      lead_id,
      client_name,
      client_email,
      client_company,
      client_address,
      client_vat_id,
      due_date,
      items,
      notes,
      tax_rate = 19,
      discount_percent = 0,
    } = body;

    // Get last invoice number
    const { data: lastInvoice } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const invoice_number = generateInvoiceNumber(lastInvoice?.invoice_number);

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unit_price,
      0
    );
    const discount_amount = subtotal * (discount_percent / 100);
    const taxable_amount = subtotal - discount_amount;
    const tax_amount = taxable_amount * (tax_rate / 100);
    const total = taxable_amount + tax_amount;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number,
        client_id,
        lead_id,
        client_name,
        client_email,
        client_company,
        client_address,
        client_vat_id,
        due_date,
        subtotal,
        tax_rate,
        tax_amount,
        discount_percent,
        discount_amount,
        total,
        notes,
        status: "draft",
      })
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Create invoice items
    if (items && items.length > 0) {
      const invoiceItems = items.map((item: any, index: number) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
        sort_order: index,
      }));

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItems);

      if (itemsError) throw itemsError;
    }

    // Fetch complete invoice with items
    const { data: completeInvoice } = await supabase
      .from("invoices")
      .select(`*, invoice_items (*)`)
      .eq("id", invoice.id)
      .single();

    return NextResponse.json(completeInvoice, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
