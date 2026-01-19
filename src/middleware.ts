import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ═══════════════════════════════════════════════════════════════
//                    MIDDLEWARE
// Nur Admin-Bereiche sind geschützt
// ═══════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  // Alles außer /admin durchlassen
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Admin-Bereich: Prüfe Cookie
  const adminCookie = request.cookies.get("admin-auth");
  if (adminCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Redirect zu Admin-Login
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
