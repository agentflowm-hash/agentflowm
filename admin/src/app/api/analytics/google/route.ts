import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Placeholder: Google Analytics Integration noch nicht implementiert.
  return NextResponse.json({
    connected: false,
    message: "Google Analytics nicht verbunden. Google OAuth2 Integration wird in einem zukuenftigen Update hinzugefuegt.",
  });
}
