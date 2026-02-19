import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PACKAGES, PackageId } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      customerEmail,
      customerName,
      customerPhone,
      customerCompany,
    } = body;

    // Validate package
    if (!packageId || !PACKAGES[packageId as PackageId]) {
      return NextResponse.json(
        { error: "Ungültiges Paket" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Name und E-Mail sind erforderlich" },
        { status: 400 }
      );
    }

    const pkg = PACKAGES[packageId as PackageId];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://agentflowm.com";

    // Create lead in Supabase first
    const { data: lead, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert({
        name: customerName,
        email: customerEmail,
        phone: customerPhone || null,
        company: customerCompany || null,
        source: "stripe_checkout",
        package_interest: pkg.name,
        message: `Checkout gestartet: ${pkg.name} (${pkg.priceGross.toLocaleString("de-DE")} € brutto)`,
        status: "checkout_started",
        priority: "high",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (leadError) {
      console.error("Lead creation error:", leadError);
    }

    // Create Stripe Checkout Session
    const session = await createCheckoutSession({
      packageId: packageId as PackageId,
      customerEmail,
      customerName,
      successUrl: `${baseUrl}/checkout/erfolg?session_id={CHECKOUT_SESSION_ID}&package=${encodeURIComponent(pkg.name)}`,
      cancelUrl: `${baseUrl}/checkout/abgebrochen?package=${encodeURIComponent(pkg.name)}`,
      metadata: {
        lead_id: lead?.id?.toString() || "",
        customer_phone: customerPhone || "",
        customer_company: customerCompany || "",
      },
    });

    // Send notification
    try {
      const { sendNotification } = await import("@/lib/notifications");
      await sendNotification({
        type: "checkout_started",
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          packageName: pkg.name,
          price: `${pkg.priceGross.toLocaleString("de-DE")} €`,
        },
      });
    } catch (notifError) {
      console.error("Notification error:", notifError);
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout fehlgeschlagen" },
      { status: 500 }
    );
  }
}
