import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Bot-Preisberechnung basierend auf Typ (Miete/Kauf)
function calculateBotPrice(
  basePrice: string,
  purchaseType: "rent" | "buy"
): number {
  const price = parseInt(basePrice.replace(/[^\d]/g, "")) || 0;

  if (purchaseType === "buy") {
    // Einmaliger Kaufpreis = ca. 10x Monatsmiete
    return price * 10;
  }

  return price; // Monatsmiete
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      botId,
      botName,
      botPrice,
      purchaseType, // "rent" oder "buy"
      customerEmail,
      customerName,
      customerPhone,
      customerCompany,
      message,
      integrations,
    } = body;

    // Validierung
    if (!botId || !botName || !botPrice) {
      return NextResponse.json(
        { error: "Bot-Informationen fehlen" },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: "Name und E-Mail sind erforderlich" },
        { status: 400 }
      );
    }

    if (!purchaseType || !["rent", "buy"].includes(purchaseType)) {
      return NextResponse.json(
        { error: "Bitte wählen Sie Mieten oder Kaufen" },
        { status: 400 }
      );
    }

    // Preis berechnen
    const finalPrice = calculateBotPrice(botPrice, purchaseType);
    const priceLabel =
      purchaseType === "rent"
        ? `${finalPrice} € / Monat`
        : `${finalPrice} € einmalig`;

    // Erstelle Lead in Supabase
    const purchaseTypeLabel = purchaseType === "rent" ? "Miete" : "Kauf";
    const integrationsText = integrations?.length
      ? `\nIntegrationen: ${integrations.join(", ")}`
      : "";

    const { data: result, error } = await supabaseAdmin
      .from("leads")
      .insert({
        name: customerName,
        email: customerEmail,
        phone: customerPhone || null,
        company: customerCompany || null,
        source: "bot-shop",
        package_interest: `Bot: ${botName} (${purchaseTypeLabel})`,
        message:
          message ||
          `Bot-Bestellung: ${botName}\nTyp: ${purchaseTypeLabel}\nPreis: ${priceLabel}${integrationsText}`,
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
          packageInterest: `Bot: ${botName} (${purchaseTypeLabel})`,
          message: `Bot-Bestellung eingegangen!\n\nBot: ${botName}\nTyp: ${purchaseTypeLabel}\nPreis: ${priceLabel}${integrationsText}\n\nKunde: ${customerName}\nE-Mail: ${customerEmail}${customerPhone ? `\nTelefon: ${customerPhone}` : ""}${customerCompany ? `\nFirma: ${customerCompany}` : ""}`,
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
      order: {
        botId,
        botName,
        purchaseType: purchaseTypeLabel,
        price: finalPrice,
        priceLabel,
      },
      redirectUrl: `${baseUrl}/workflows/erfolg?bot=${encodeURIComponent(botName)}&type=${purchaseType}&price=${finalPrice}`,
    });
  } catch (error: any) {
    console.error("Bot checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Bestellung fehlgeschlagen" },
      { status: 500 }
    );
  }
}
