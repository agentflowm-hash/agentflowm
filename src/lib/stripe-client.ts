"use client";

import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
}

// Create checkout and redirect
export async function startCheckout({
  packageId,
  customerEmail,
  customerName,
  customerPhone,
  customerCompany,
}: {
  packageId: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  customerCompany?: string;
}) {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      packageId,
      customerEmail,
      customerName,
      customerPhone,
      customerCompany,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Checkout failed");
  }

  // Redirect to Stripe Checkout URL (server already provides the full URL)
  if (data.url) {
    window.location.href = data.url;
  }

  return data;
}
