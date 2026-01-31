import createMiddleware from 'next-intl/middleware';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from './i18n/routing';
import { getLocalesForDomain, getDefaultLocaleForDomain, locales, type Locale } from './i18n/config';

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

  // Skip for API routes, admin, portal, and static files
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
  const pathParts = pathname.split('/').filter(Boolean);
  const pathLocale = pathParts[0] as Locale | undefined;
  
  // Prüfe ob eine bekannte Locale im Pfad ist
  const isLocaleInPath = pathLocale && locales.includes(pathLocale as Locale);
  
  // Wenn Locale im Pfad aber NICHT erlaubt auf dieser Domain
  if (isLocaleInPath && !allowedLocales.includes(pathLocale as Locale)) {
    // Ersetze mit erlaubter Default-Locale
    const restOfPath = pathParts.slice(1).join('/');
    const newPath = `/${defaultLocale}${restOfPath ? '/' + restOfPath : ''}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // Lass next-intl den Rest handlen
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
