import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═══════════════════════════════════════════════════════════════
//                    ADMIN MIDDLEWARE
// Domain-basierte Sprachsteuerung + Session-Authentifizierung
// .de = Deutsch | .com = English
// ═══════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Determine domain type
  const isComDomain = hostname.includes(".com");
  const locale = isComDomain ? "en" : "de";

  // Öffentliche Routen - immer durchlassen
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    // Set locale cookie for client-side use
    const response = NextResponse.next();
    response.cookies.set("admin_locale", locale, { path: "/" });
    return response;
  }

  // Prüfe Admin-Session Cookie
  const adminSession = request.cookies.get("agentflow_admin_session");

  if (adminSession?.value) {
    // Session vorhanden - durchlassen mit Locale
    const response = NextResponse.next();
    response.cookies.set("admin_locale", locale, { path: "/" });
    return response;
  }

  // Keine Session - redirect zu Login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
