import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe") || "7d";

  // Calculate multiplier based on timeframe
  const multiplier = timeframe === "today" ? 0.15 : timeframe === "7d" ? 1 : 4;

  try {
    // Mock data (replace with real GA4 API integration)
    const data = {
      users: Math.floor(3842 * multiplier),
      newUsers: Math.floor(2156 * multiplier),
      sessions: Math.floor(5234 * multiplier),
      pageViews: Math.floor(12847 * multiplier),
      avgSessionDuration: "2:34",
      bounceRate: 42.3,
      usersByCountry: [
        { country: "Deutschland", users: Math.floor(2845 * multiplier), flag: "🇩🇪" },
        { country: "Österreich", users: Math.floor(412 * multiplier), flag: "🇦🇹" },
        { country: "Schweiz", users: Math.floor(289 * multiplier), flag: "🇨🇭" },
        { country: "USA", users: Math.floor(156 * multiplier), flag: "🇺🇸" },
        { country: "UK", users: Math.floor(89 * multiplier), flag: "🇬🇧" },
      ],
      usersByDevice: [
        { device: "Desktop", users: Math.floor(2134 * multiplier), percentage: 55.5 },
        { device: "Mobile", users: Math.floor(1423 * multiplier), percentage: 37.0 },
        { device: "Tablet", users: Math.floor(285 * multiplier), percentage: 7.5 },
      ],
      realTimeUsers: Math.floor(Math.random() * 20) + 5,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Google Analytics error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
