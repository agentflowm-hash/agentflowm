import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from './i18n/routing';
import { getLocalesForDomain, getDefaultLocaleForDomain, type Locale } from './i18n/config';

// ═══════════════════════════════════════════════════════════════
//                    MIDDLEWARE
// Domain-basiertes i18n Routing:
// - agentflowm.de → Nur Deutsch
// - agentflowm.com → Englisch + Arabisch
// ═══════════════════════════════════════════════════════════════

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hostname = request.headers.get('host')?.split(':')[0] || 'localhost';

  // Skip i18n for API routes, admin, portal, and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/portal') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    // Admin-Bereich: Prüfe Cookie
    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
      const adminCookie = request.cookies.get("admin-auth");
      if (adminCookie?.value !== "authenticated") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // ═══════════════════════════════════════════════════════════════
  // Domain-basierte Sprachsteuerung
  // ═══════════════════════════════════════════════════════════════
  
  const allowedLocales = getLocalesForDomain(hostname);
  const defaultLocale = getDefaultLocaleForDomain(hostname);
  
  // Extrahiere aktuelle Locale aus Pfad
  const pathLocale = pathname.split('/')[1] as Locale | undefined;
  
  // Prüfe ob Sprache erlaubt ist
  if (pathLocale && !allowedLocales.includes(pathLocale as Locale)) {
    // Sprache nicht erlaubt auf dieser Domain → Redirect zur Default-Sprache
    const newPathname = pathname.replace(`/${pathLocale}`, `/${defaultLocale}`);
    const redirectUrl = new URL(newPathname, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Wenn Root ohne Sprache → Redirect zur Default-Sprache der Domain
  if (pathname === '/' || pathname === '') {
    const redirectUrl = new URL(`/${defaultLocale}`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Apply standard i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
