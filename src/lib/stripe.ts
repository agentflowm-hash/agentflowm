import Stripe from "stripe";

// Lazy-initialized Stripe instance
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Proxy for lazy initialization
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  }
});

// Package definitions with Stripe Price IDs (to be created in Stripe Dashboard)
// For now using ad-hoc prices
export const PACKAGES = {
  // Website Pakete
  start: {
    name: "START",
    price: 3790, // EUR netto
    priceGross: 4510, // EUR brutto (19% MwSt)
    description: "Website + Admin - Schneller, professioneller Start",
    features: [
      "Professionelle Website",
      "Admin Dashboard",
      "Mobile optimiert",
      "SEO Grundlagen",
      "3 Monate Support",
    ],
  },
  business: {
    name: "BUSINESS",
    price: 8390,
    priceGross: 9984,
    description: "Website + Admin + Portale - Wachstum mit Struktur",
    features: [
      "Alles aus START",
      "Kunden-Portal",
      "Mitarbeiter-Portal",
      "Workflow Automation",
      "6 Monate Support",
    ],
  },
  webapp: {
    name: "Web App",
    price: 18990,
    priceGross: 22598,
    description: "Browserbasiertes System mit Logins, Rollen, Bereichen",
    features: [
      "Custom Web Application",
      "User Management",
      "Role-based Access",
      "API Integration",
      "12 Monate Support",
    ],
  },
  mobile: {
    name: "Mobile App",
    price: 35990,
    priceGross: 42828,
    description: "iOS/Android - Komplette App-Umsetzung als stabiles System",
    features: [
      "iOS & Android App",
      "Push Notifications",
      "Offline Mode",
      "App Store Deployment",
      "12 Monate Support",
    ],
  },
} as const;

export type PackageId = keyof typeof PACKAGES;

// Create Stripe Checkout Session
export async function createCheckoutSession({
  packageId,
  customerEmail,
  customerName,
  successUrl,
  cancelUrl,
  metadata,
}: {
  packageId: PackageId;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const pkg = PACKAGES[packageId];
  if (!pkg) {
    throw new Error(`Invalid package: ${packageId}`);
  }

  const stripeClient = getStripe();

  // Create checkout session with ad-hoc price
  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "sepa_debit", "klarna", "giropay"],
    customer_email: customerEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: pkg.priceGross * 100, // Stripe uses cents
          product_data: {
            name: `AgentFlow ${pkg.name}`,
            description: pkg.description,
            metadata: {
              package_id: packageId,
            },
          },
        },
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      package_id: packageId,
      package_name: pkg.name,
      customer_name: customerName,
      ...metadata,
    },
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `AgentFlow ${pkg.name} - ${pkg.description}`,
        metadata: {
          package_id: packageId,
        },
        footer: "Vielen Dank für Ihr Vertrauen! - AgentFlowMarketing",
      },
    },
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    locale: "de",
    allow_promotion_codes: true,
  });

  return session;
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
}
