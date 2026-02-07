import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./i18n/config";

// ═══════════════════════════════════════════════════════════════
//                    PORTAL MIDDLEWARE
// Domain-basierte Sprachsteuerung + Session-Authentifizierung
// .de = NUR Deutsch | .com = Englisch + Arabisch
// ═══════════════════════════════════════════════════════════════

// Create next-intl middleware for German (.de) - ONLY German
const intlMiddlewareDE = createMiddleware({
  locales: ["de"],
  defaultLocale: "de",
  localePrefix: "never",
});

// Create next-intl middleware for English/Arabic (.com)
const intlMiddlewareCOM = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Determine domain type
  const isComDomain = hostname.includes(".com");
  const isDeDomain = hostname.includes(".de");

  // Static files and API routes - skip
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════
  // DOMAIN-SPRACHREGELN DURCHSETZEN
  // ═══════════════════════════════════════════════════════════
  
  const pathLocale = pathname.split("/")[1];
  
  if (isDeDomain) {
    // .de Domain: NUR Deutsch erlaubt
    // Redirect /en/* oder /ar/* zu /
    if (pathLocale === "en" || pathLocale === "ar") {
      const newPath = pathname.replace(/^\/(en|ar)/, "") || "/";
      return NextResponse.redirect(new URL(newPath, request.url));
    }
    // Remove /de prefix if present (not needed on .de)
    if (pathLocale === "de") {
      const newPath = pathname.replace(/^\/de/, "") || "/";
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }
  
  if (isComDomain) {
    // .com Domain: Englisch + Arabisch erlaubt, KEIN Deutsch
    if (pathLocale === "de") {
      const newPath = pathname.replace(/^\/de/, "/en") || "/en";
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }

  // ═══════════════════════════════════════════════════════════
  // i18n MIDDLEWARE
  // ═══════════════════════════════════════════════════════════
  
  const intlMiddleware = isComDomain ? intlMiddlewareCOM : intlMiddlewareDE;
  const response = intlMiddleware(request);

  // ═══════════════════════════════════════════════════════════
  // SESSION-AUTHENTIFIZIERUNG
  // ═══════════════════════════════════════════════════════════
  
  // Extract current path without locale prefix
  let currentPath = pathname;
  const hasLocalePrefix = ["de", "en", "ar"].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (hasLocalePrefix) {
    currentPath = pathname.replace(/^\/(de|en|ar)/, "") || "/";
  }

  // Public routes - always allow (root = login page)
  if (currentPath === "/" || currentPath.startsWith("/login")) {
    return response;
  }

  // Protected routes - check for session
  const portalSession = request.cookies.get("portal_session");

  if (!portalSession?.value) {
    // No session - redirect to login
    if (isComDomain) {
      const locale = pathLocale === "ar" ? "ar" : "en";
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
