import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { cookies } from "next/headers";

// Check admin auth
async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_SESSION_SECRET;
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: invoices, error } = await supabaseAdmin
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    // Transform to expected format
    const formattedInvoices = (invoices || []).map((inv) => ({
      id: inv.id,
      invoiceNumber: inv.invoice_number,
      customerName: inv.customer_name,
      customerEmail: inv.customer_email,
      amount: inv.total_gross || inv.total_net * 1.19,
      status: inv.payment_status === "paid" ? "paid" : "pending",
      createdAt: inv.created_at,
      pdfPath: inv.pdf_path,
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error("Invoices fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
