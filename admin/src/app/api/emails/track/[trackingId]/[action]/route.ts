import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Tracking Pixel für Opens und Clicks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string; action: string }> }
) {
  try {
    const { trackingId, action } = await params;

    if (action === "open") {
      // Email als geöffnet markieren
      await db
        .from("portal_emails")
        .update({ 
          opened_at: new Date().toISOString(),
          open_count: db.sql`COALESCE(open_count, 0) + 1`
        })
        .eq("tracking_id", trackingId)
        .is("opened_at", null);

      // 1x1 transparent GIF zurückgeben
      const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
      return new NextResponse(gif, {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    if (action === "click") {
      const url = request.nextUrl.searchParams.get("url");
      
      // Click tracken
      await db
        .from("portal_emails")
        .update({ 
          clicked_at: new Date().toISOString(),
          click_count: db.sql`COALESCE(click_count, 0) + 1`
        })
        .eq("tracking_id", trackingId);

      // Redirect zur Ziel-URL
      if (url) {
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.json({ tracked: true });
  } catch (error) {
    console.error("Tracking error:", error);
    // Fail silently
    const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
    return new NextResponse(gif, {
      headers: { "Content-Type": "image/gif" },
    });
  }
}
