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

  // ═══════════════════════════════════════════════════════════════
  // DOMAIN-BASED ROUTING
  // admin-agentflowm.de/com → /de/admin oder /en/admin
  // portal-agentflowm.de/com → /de/portal oder /en/portal
  // ═══════════════════════════════════════════════════════════════
  
  const isAdminDomain = hostname.includes('admin-agentflowm');
  const isPortalDomain = hostname.includes('portal-agentflowm');
  
  // Determine default locale based on TLD
  const domainLocale = hostname.endsWith('.de') ? 'de' : 'en';
  
  // Admin Domain: Redirect root to admin
  if (isAdminDomain) {
    // Root or just locale → redirect to admin
    if (pathname === '/' || pathname === '/de' || pathname === '/en' || pathname === '/ar') {
      return NextResponse.redirect(new URL(`/${domainLocale}/admin`, request.url));
    }
    // Locale root → redirect to admin
    if (pathname.match(/^\/(de|en|ar)\/?$/)) {
      const locale = pathname.replace(/\//g, '') || domainLocale;
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }
  
  // Portal Domain: Redirect root to portal
  if (isPortalDomain) {
    // Root or just locale → redirect to portal
    if (pathname === '/' || pathname === '/de' || pathname === '/en' || pathname === '/ar') {
      return NextResponse.redirect(new URL(`/${domainLocale}/portal`, request.url));
    }
    // Locale root → redirect to portal
    if (pathname.match(/^\/(de|en|ar)\/?$/)) {
      const locale = pathname.replace(/\//g, '') || domainLocale;
      return NextResponse.redirect(new URL(`/${locale}/portal`, request.url));
    }
  }

  // Check if path is admin or portal (with or without locale prefix)
  const isAdminPath = pathname.startsWith('/admin') || pathname.match(/^\/(de|en|ar)\/admin/);
  const isPortalPath = pathname.startsWith('/portal') || pathname.match(/^\/(de|en|ar)\/portal/);

  // Skip for API routes, admin, portal, and static files
  if (
    pathname.startsWith('/api') ||
    isAdminPath ||
    isPortalPath ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    // Admin-Bereich: Prüfe Cookie (only for non-login admin pages)
    if (isAdminPath && !pathname.includes('/admin/login') && !pathname.includes('/login')) {
      const adminCookie = request.cookies.get("admin-auth");
      if (adminCookie?.value !== "authenticated") {
        // Redirect to locale-prefixed login
        const locale = pathname.match(/^\/(de|en|ar)\//)?.[1] || domainLocale;
        return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
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
