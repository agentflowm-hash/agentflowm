import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getSqliteDb();
    const rawChecks = db
      .prepare(
        "SELECT * FROM website_checks ORDER BY created_at DESC LIMIT 100",
      )
      .all() as any[];

    // Transform snake_case to camelCase for frontend compatibility
    const checks = rawChecks.map((check) => ({
      id: check.id,
      url: check.url,
      email: check.email,
      scoreOverall: check.score_overall,
      scoreSecurity: check.score_security,
      scoreSeo: check.score_seo,
      scoreAccessibility: check.score_accessibility,
      scorePerformance: check.score_performance,
      scoreStructure: check.score_structure,
      loadTime: check.load_time,
      httpsEnabled: check.https_enabled === 1,
      resultJson: check.result_json,
      createdAt: check.created_at,
    }));

    return NextResponse.json({ checks });
  } catch (error) {
    console.error("Checks error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
