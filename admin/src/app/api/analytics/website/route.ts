import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Generate realistic hourly traffic data
    const hourlyTraffic = Array.from({ length: 24 }, (_, hour) => {
      const baseTraffic = 10;
      const peakMultiplier = 
        hour >= 9 && hour <= 18 ? 8 :
        hour >= 7 && hour <= 20 ? 4 :
        1;
      return Math.floor(baseTraffic * peakMultiplier + Math.random() * 20);
    });

    const data = {
      topPages: [
        { path: "/", title: "Startseite", views: 4521, avgTime: "1:45", bounceRate: 35 },
        { path: "/pakete", title: "Pakete & Preise", views: 2834, avgTime: "3:12", bounceRate: 22 },
        { path: "/termin", title: "Termin buchen", views: 1456, avgTime: "2:30", bounceRate: 18 },
        { path: "/loesung", title: "Unsere Lösung", views: 987, avgTime: "2:05", bounceRate: 42 },
        { path: "/kontakt", title: "Kontakt", views: 654, avgTime: "1:20", bounceRate: 55 },
        { path: "/website-check", title: "Website Check", views: 543, avgTime: "4:15", bounceRate: 28 },
        { path: "/referral", title: "Referral Programm", views: 321, avgTime: "1:55", bounceRate: 38 },
      ],
      trafficSources: [
        { source: "Google", users: 2156, percentage: 45, icon: "🔍", color: "#4285F4" },
        { source: "Direkt", users: 1234, percentage: 26, icon: "🔗", color: "#22c55e" },
        { source: "Social", users: 687, percentage: 14, icon: "📱", color: "#a855f7" },
        { source: "Referral", users: 423, percentage: 9, icon: "🤝", color: "#f59e0b" },
        { source: "Email", users: 289, percentage: 6, icon: "📧", color: "#ef4444" },
      ],
      hourlyTraffic,
      conversionFunnel: [
        { step: "Besucher", users: 3842, rate: 100 },
        { step: "Pakete angesehen", users: 2156, rate: 56.1 },
        { step: "Termin geklickt", users: 487, rate: 12.7 },
        { step: "Formular gestartet", users: 234, rate: 6.1 },
        { step: "Lead generiert", users: 127, rate: 3.3 },
      ],
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Website analytics error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
