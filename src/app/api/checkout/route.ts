import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase, getSqliteDb } from "@/lib/db";

// Paket-Preise (netto)
const PACKAGES: Record<
  string,
  { name: string; price: number; description: string }
> = {
  "one-page": {
    name: "One Page Website",
    price: 1390,
    description: "Eine Seite mit allen wichtigen Sektionen",
  },
  business: {
    name: "Business Website",
    price: 6990,
    description: "Vollständige Website mit Publishing-Workflow (bis 10 Seiten)",
  },
  growth: {
    name: "Growth Website",
    price: 10990,
    description:
      "Das komplette System mit Lead-Automatisierung (bis 13 Seiten)",
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

    // Initialisiere Datenbank
    initializeDatabase();
    const db = getSqliteDb();

    // Erstelle Lead in der Datenbank
    const result = db
      .prepare(
        `
      INSERT INTO leads (name, email, phone, company, source, package_interest, message, status, priority)
      VALUES (?, ?, ?, ?, 'checkout', ?, ?, 'new', 'high')
    `,
      )
      .run(
        customerName,
        customerEmail,
        customerPhone || null,
        customerCompany || null,
        pkg.name,
        message ||
          `Interesse an ${pkg.name} (${pkg.price.toLocaleString("de-DE")} € netto)`,
      );

    const leadId = result.lastInsertRowid;

    // Optional: Benachrichtigung senden (Telegram/Discord)
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
            `Interesse an ${pkg.name} (${pkg.price.toLocaleString("de-DE")} € netto)`,
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
