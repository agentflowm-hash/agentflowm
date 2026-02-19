import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Check admin auth
async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === process.env.ADMIN_SESSION_SECRET;
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get("timeframe") || "7d";

  // Calculate date range
  const endDate = new Date();
  let startDate = new Date();
  
  switch (timeframe) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  try {
    // Try to fetch from Google Analytics API if configured
    const gaPropertyId = process.env.GA_PROPERTY_ID;
    const gaServiceAccount = process.env.GA_SERVICE_ACCOUNT_JSON;

    if (gaPropertyId && gaServiceAccount) {
      // TODO: Implement actual Google Analytics Data API call
      // For now, return mock data with realistic values
    }

    // Mock data (replace with real GA4 API integration)
    const multiplier = timeframe === "today" ? 0.15 : timeframe === "7d" ? 1 : 4;
    
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
