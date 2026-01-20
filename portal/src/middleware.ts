import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

// ═══════════════════════════════════════════════════════════════
//                    PORTAL MIDDLEWARE
// Session-basierte Authentifizierung für Kunden + i18n
// ═══════════════════════════════════════════════════════════════

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Redirect portal-agentflowm.com to main site projekte page
  if (hostname.includes("portal-agentflowm.com")) {
    return NextResponse.redirect("https://agentflowm.com/projekte", { status: 301 });
  }

  // Static files and API routes - skip i18n
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Get the locale from the path or default
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Extract current path without locale prefix
  let currentPath = pathname;
  if (pathnameHasLocale) {
    const locale = pathname.split("/")[1];
    currentPath = pathname.replace(`/${locale}`, "") || "/";
  }

  // Public routes - always allow (root, login)
  if (
    currentPath === "/" ||
    currentPath.startsWith("/login")
  ) {
    return response;
  }

  // Protected routes - check for session
  const portalSession = request.cookies.get("portal_session");

  if (!portalSession?.value) {
    // No session - redirect to root (which will go to login)
    const locale = pathnameHasLocale ? pathname.split("/")[1] : defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
