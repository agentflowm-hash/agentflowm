import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutComplete(session);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentFailed(paymentIntent);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const leadId = metadata.lead_id;
  const packageName = metadata.package_name;
  const packageId = metadata.package_id;
  const customerName = metadata.customer_name;

  console.log("Checkout completed:", {
    sessionId: session.id,
    customerEmail: session.customer_email,
    packageName,
    amountTotal: session.amount_total,
  });

  // Update lead status in Supabase
  if (leadId) {
    await supabaseAdmin
      .from("leads")
      .update({
        status: "paid",
        message: `✅ BEZAHLT: ${packageName} - ${(session.amount_total! / 100).toLocaleString("de-DE")} €`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId);
  }

  // Create customer record
  await supabaseAdmin.from("customers").insert({
    name: customerName || session.customer_details?.name || "Unbekannt",
    email: session.customer_email,
    phone: session.customer_details?.phone || metadata.customer_phone || null,
    company: metadata.customer_company || null,
    stripe_customer_id: session.customer as string || null,
    stripe_session_id: session.id,
    package: packageName,
    amount_paid: session.amount_total! / 100,
    payment_status: "paid",
    created_at: new Date().toISOString(),
  });

  // Generate invoice
  try {
    const { PACKAGES } = await import("@/lib/stripe");
    const pkg = packageId ? PACKAGES[packageId as keyof typeof PACKAGES] : null;
    const features = pkg && typeof pkg === 'object' && 'features' in pkg ? pkg.features : [];
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://agentflowm.com";
    const invoiceResponse = await fetch(`${baseUrl}/api/invoice/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: customerName || session.customer_details?.name,
          company: metadata.customer_company,
          address: session.customer_details?.address?.line1 || "Wird nachgereicht",
          zip: session.customer_details?.address?.postal_code || "",
          city: session.customer_details?.address?.city || "",
          country: session.customer_details?.address?.country || "Deutschland",
          email: session.customer_email,
        },
        items: [
          {
            description: `AgentFlow ${packageName}`,
            details: features as string[],
            quantity: 1,
            unitPrice: (session.amount_total! / 100) / 1.19, // Netto
          },
        ],
        vatRate: 19,
        paymentStatus: "paid",
        paidDate: new Date().toISOString(),
        paymentMethod: session.payment_method_types?.[0] || "card",
        stripeSessionId: session.id,
        notes: `Stripe Session: ${session.id}`,
      }),
    });
    
    const invoiceData = await invoiceResponse.json();
    console.log("Invoice generated:", invoiceData.invoiceNumber);
  } catch (invoiceError) {
    console.error("Invoice generation error:", invoiceError);
  }

  // Send success notification
  try {
    const { sendNotification } = await import("@/lib/notifications");
    await sendNotification({
      type: "payment_success",
      data: {
        name: customerName || session.customer_details?.name,
        email: session.customer_email,
        packageName,
        amount: `${(session.amount_total! / 100).toLocaleString("de-DE")} €`,
        sessionId: session.id,
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.error("Payment failed:", {
    id: paymentIntent.id,
    error: paymentIntent.last_payment_error?.message,
  });

  // Send failure notification
  try {
    const { sendNotification } = await import("@/lib/notifications");
    await sendNotification({
      type: "payment_failed",
      data: {
        paymentIntentId: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message || "Unknown error",
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}
