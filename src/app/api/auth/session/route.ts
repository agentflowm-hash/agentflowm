import { NextRequest, NextResponse } from "next/server";
import { validateSession } from "@/lib/database";

// ═══════════════════════════════════════════════════════════════
//                    SESSION API
// Prüft ob User eingeloggt ist
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("portal_session")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const client = validateSession(token);

    if (!client) {
      // Session ungültig - Cookie löschen
      const response = NextResponse.json({ authenticated: false });
      response.cookies.delete("portal_session");
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: client.id,
        name: client.name,
        username: client.telegram_username,
        accessCode: client.access_code,
      },
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}

// Logout
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("portal_session");
  return response;
}
