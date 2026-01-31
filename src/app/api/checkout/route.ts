import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Paket-Preise (netto) - AKTUALISIERT 31.01.2026
// Synchronisiert mit Website /pakete
const PACKAGES: Record<
  string,
  { name: string; price: number; description: string; priceDisplay?: string }
> = {
  // Website Pakete
  start: {
    name: "START",
    price: 5390,
    description: "Website + Admin - Schneller, professioneller Start",
  },
  business: {
    name: "BUSINESS",
    price: 11990,
    description: "Website + Admin + Portale - Wachstum mit Struktur",
  },
  konfigurator: {
    name: "KONFIGURATOR",
    price: 0,
    priceDisplay: "auf Anfrage",
    description: "Maßgeschneiderte Lösung - Individuell nach Bedarf",
  },
  // App Pakete
  webapp: {
    name: "Web App",
    price: 26990,
    description: "Browserbasiertes System mit Logins, Rollen, Bereichen",
  },
  mobile: {
    name: "Mobile App",
    price: 51490,
    description: "iOS/Android - Komplette App-Umsetzung als stabiles System",
  },
  enterprise: {
    name: "Enterprise",
    price: 0,
    priceDisplay: "auf Anfrage",
    description: "Maßgeschneidert für große Teams und komplexe Anforderungen",
  },
  // Legacy Support (für alte Links)
  "one-page": {
    name: "One Page (Legacy → START)",
    price: 5390,
    description: "Weitergeleitet zu START Paket",
  },
  growth: {
    name: "Growth (Legacy → BUSINESS)",
    price: 11990,
    description: "Weitergeleitet zu BUSINESS Paket",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      customerEmail,
      customerName,
      customerPhone,
      customerCompany,
      message,
    } = body;

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json({ error: "Ungültiges Paket" }, { status: 400 });
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Name und E-Mail sind erforderlich" },
        { status: 400 },
      );
    }

    // Preis-Anzeige formatieren
    const priceText = pkg.priceDisplay || `${pkg.price.toLocaleString("de-DE")} €`;

    // Erstelle Lead in Supabase
    const { data: result, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: customerName,
        email: customerEmail,
        phone: customerPhone || null,
        company: customerCompany || null,
        source: "checkout",
        package_interest: pkg.name,
        message:
          message ||
          `Interesse an ${pkg.name} (${priceText} netto)`,
        status: "new",
        priority: "high",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    const leadId = result.id;

    // Benachrichtigung senden (Telegram/Discord)
    try {
      const { sendNotification } = await import("@/lib/notifications");
      await sendNotification({
        type: "lead",
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          company: customerCompany,
          packageInterest: pkg.name,
          message:
            message ||
            `Interesse an ${pkg.name} (${priceText} netto)`,
        },
      });
    } catch (notifError) {
      console.error("Notification error:", notifError);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://agentflowm.com";

    return NextResponse.json({
      success: true,
      leadId,
      package: pkg.name,
      price: pkg.price,
      priceDisplay: pkg.priceDisplay || `${pkg.price.toLocaleString("de-DE")} €`,
      url: `${baseUrl}/checkout/erfolg?package=${encodeURIComponent(pkg.name)}`,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Anfrage fehlgeschlagen" },
      { status: 500 },
    );
  }
}
