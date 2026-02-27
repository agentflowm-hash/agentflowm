import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: Single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from("invoices")
      .select(`
        *,
        invoice_items (*),
        payment_history (*)
      `)
      .eq("id", parseInt(params.id))
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const invoiceId = parseInt(params.id);

    const {
      client_name,
      client_email,
      client_company,
      client_address,
      client_vat_id,
      due_date,
      items,
      notes,
      internal_notes,
      status,
      tax_rate,
      discount_percent,
    } = body;

    // Recalculate totals if items changed
    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (client_name) updateData.client_name = client_name;
    if (client_email) updateData.client_email = client_email;
    if (client_company !== undefined) updateData.client_company = client_company;
    if (client_address !== undefined) updateData.client_address = client_address;
    if (client_vat_id !== undefined) updateData.client_vat_id = client_vat_id;
    if (due_date) updateData.due_date = due_date;
    if (notes !== undefined) updateData.notes = notes;
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes;
    if (status) updateData.status = status;

    // Handle status changes
    if (status === "paid" && !body.paid_at) {
      updateData.paid_at = new Date().toISOString();
    }

    // Recalculate if items provided
    if (items && items.length > 0) {
      const rate = tax_rate ?? 19;
      const discount = discount_percent ?? 0;

      const subtotal = items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unit_price,
        0
      );
      const discount_amount = subtotal * (discount / 100);
      const taxable_amount = subtotal - discount_amount;
      const tax_amount = taxable_amount * (rate / 100);
      const total = taxable_amount + tax_amount;

      updateData = {
        ...updateData,
        subtotal,
        tax_rate: rate,
        tax_amount,
        discount_percent: discount,
        discount_amount,
        total,
      };

      // Delete old items and insert new
      await supabase.from("invoice_items").delete().eq("invoice_id", invoiceId);

      const invoiceItems = items.map((item: any, index: number) => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
        sort_order: index,
      }));

      await supabase.from("invoice_items").insert(invoiceItems);
    }

    // Update invoice
    const { data, error } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId)
      .select(`*, invoice_items (*)`)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);

    // Check if invoice can be deleted (only drafts)
    const { data: invoice } = await supabase
      .from("invoices")
      .select("status")
      .eq("id", invoiceId)
      .single();

    if (invoice?.status !== "draft") {
      return NextResponse.json(
        { error: "Only draft invoices can be deleted" },
        { status: 400 }
      );
    }

    // Delete invoice (cascade deletes items)
    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
