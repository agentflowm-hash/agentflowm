/**
 * ═══════════════════════════════════════════════════════════════
 *                    EMAIL TRACKING PIXEL API
 * ═══════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string; action: string }> }
) {
  try {
    const { trackingId, action } = await params;

    if (action === "open") {
      // Get current open count
      const { data: email } = await db
        .from("portal_emails")
        .select("open_count, opened_at")
        .eq("tracking_id", trackingId)
        .single();

      // Only update if not already opened
      if (email && !email.opened_at) {
        await db
          .from("portal_emails")
          .update({
            opened_at: new Date().toISOString(),
            open_count: (email.open_count || 0) + 1,
          })
          .eq("tracking_id", trackingId);
      } else if (email) {
        // Just increment count
        await db
          .from("portal_emails")
          .update({
            open_count: (email.open_count || 0) + 1,
          })
          .eq("tracking_id", trackingId);
      }

      return new NextResponse(TRANSPARENT_GIF, {
        headers: {
          "Content-Type": "image/gif",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    if (action === "click") {
      const url = request.nextUrl.searchParams.get("url");

      // Get current click count
      const { data: email } = await db
        .from("portal_emails")
        .select("click_count, clicked_at")
        .eq("tracking_id", trackingId)
        .single();

      if (email) {
        await db
          .from("portal_emails")
          .update({
            clicked_at: email.clicked_at || new Date().toISOString(),
            click_count: (email.click_count || 0) + 1,
          })
          .eq("tracking_id", trackingId);
      }

      // Redirect to target URL
      if (url) {
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.json({ tracked: true });
  } catch (error) {
    // Fail silently - return transparent gif
    return new NextResponse(TRANSPARENT_GIF, {
      headers: { "Content-Type": "image/gif" },
    });
  }
}
