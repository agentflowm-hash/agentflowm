import { NextRequest, NextResponse } from "next/server";
import { db, initializeDatabase } from "@/lib/db";
import { websiteChecks } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { desc } from "drizzle-orm";

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/website-checks
//                    Alle Website-Checks abrufen
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const allChecks = db
      .select()
      .from(websiteChecks)
      .orderBy(desc(websiteChecks.createdAt))
      .limit(limit)
      .offset(offset)
      .all();

    // Parse JSON results with error handling
    const checksWithParsedResults = allChecks.map((check) => {
      let parsedResults = null;
      if (check.resultJson) {
        try {
          parsedResults = JSON.parse(check.resultJson);
        } catch (e) {
          console.error(`Failed to parse resultJson for check ${check.id}:`, e);
        }
      }
      return {
        ...check,
        results: parsedResults,
      };
    });

    // Statistiken
    const allChecksForStats = db.select().from(websiteChecks).all();
    const scores = allChecksForStats
      .map((c) => c.scoreOverall)
      .filter((s): s is number => s !== null);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const stats = {
      total: allChecksForStats.length,
      avgScore,
      highScore: allChecksForStats.filter((c) => (c.scoreOverall || 0) >= 80)
        .length,
      mediumScore: allChecksForStats.filter(
        (c) => (c.scoreOverall || 0) >= 50 && (c.scoreOverall || 0) < 80,
      ).length,
      lowScore: allChecksForStats.filter(
        (c) => (c.scoreOverall || 0) < 50 && c.scoreOverall !== null,
      ).length,
    };

    return NextResponse.json({
      checks: checksWithParsedResults,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total,
      },
    });
  } catch (error) {
    console.error("Admin Website Checks Error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 },
    );
  }
}
