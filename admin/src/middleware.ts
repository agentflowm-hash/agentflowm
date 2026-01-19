import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═══════════════════════════════════════════════════════════════
//                    ADMIN MIDDLEWARE
// Session-basierte Authentifizierung
// ═══════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Öffentliche Routen - immer durchlassen
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Prüfe Admin-Session Cookie
  const adminSession = request.cookies.get("agentflow_admin_session");

  if (adminSession?.value) {
    // Session vorhanden - durchlassen
    return NextResponse.next();
  }

  // Keine Session - redirect zu Login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
