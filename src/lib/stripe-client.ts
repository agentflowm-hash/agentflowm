"use client";

import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
}

// Redirect to Stripe Checkout
export async function redirectToCheckout(sessionId: string) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Stripe not loaded");
  }
  
  // Use the new checkout redirect method
  const result = await stripe.redirectToCheckout({ sessionId });
  if (result.error) {
    throw result.error;
  }
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

  // Redirect to Stripe Checkout
  if (data.url) {
    window.location.href = data.url;
  } else if (data.sessionId) {
    await redirectToCheckout(data.sessionId);
  }

  return data;
}
