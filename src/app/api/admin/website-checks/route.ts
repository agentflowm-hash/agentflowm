import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/website-checks
//                    Alle Website-Checks abrufen
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data: allChecks, error } = await supabaseAdmin
      .from("website_checks")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    // Parse JSON results with error handling
    const checksWithParsedResults = (allChecks || []).map((check) => {
      let parsedResults = null;
      if (check.result_json) {
        try {
          parsedResults = JSON.parse(check.result_json);
        } catch (e) {
          console.error(`Failed to parse result_json for check ${check.id}:`, e);
        }
      }
      return {
        ...check,
        results: parsedResults,
      };
    });

    // Statistiken
    const { data: allChecksForStats } = await supabaseAdmin
      .from("website_checks")
      .select("score_overall");

    const scores = (allChecksForStats || [])
      .map((c) => c.score_overall)
      .filter((s): s is number => s !== null);

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    const stats = {
      total: allChecksForStats?.length || 0,
      avgScore,
      highScore: (allChecksForStats || []).filter((c) => (c.score_overall || 0) >= 80)
        .length,
      mediumScore: (allChecksForStats || []).filter(
        (c) => (c.score_overall || 0) >= 50 && (c.score_overall || 0) < 80,
      ).length,
      lowScore: (allChecksForStats || []).filter(
        (c) => (c.score_overall || 0) < 50 && c.score_overall !== null,
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
