import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═══════════════════════════════════════════════════════════════
//                    PORTAL MIDDLEWARE
// Session-basierte Authentifizierung für Kunden
// ═══════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Öffentliche Routen - immer durchlassen
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Prüfe Portal-Session Cookie
  const portalSession = request.cookies.get("portal_session");

  if (portalSession?.value) {
    // Session vorhanden - durchlassen
    return NextResponse.next();
  }

  // Keine Session - redirect zu Startseite
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
