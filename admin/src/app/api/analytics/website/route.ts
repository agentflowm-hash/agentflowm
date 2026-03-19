import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Placeholder: Keine echte Website-Analytics-Integration vorhanden.
  // Muss mit echtem Tracking (Plausible, Matomo, o.ae.) verbunden werden.
  return NextResponse.json({
    connected: false,
    message: "Website-Analytics nicht verbunden. Bitte Tracking-Tool in Einstellungen konfigurieren.",
    topPages: [],
    trafficSources: [],
    hourlyTraffic: [],
    conversionFunnel: [],
  });
}
