import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Passwort für den Zugang zur Website
const SITE_PASSWORD = "agentflow2024";

export function middleware(request: NextRequest) {
  // API-Routes und statische Dateien durchlassen
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Prüfe ob bereits authentifiziert (Cookie)
  const authCookie = request.cookies.get("site-auth");
  if (authCookie?.value === "authenticated") {
    return NextResponse.next();
  }

  // Prüfe Basic Auth Header
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [, password] = decoded.split(":");

      if (password === SITE_PASSWORD) {
        // Setze Cookie für zukünftige Requests
        const response = NextResponse.next();
        response.cookies.set("site-auth", "authenticated", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 Tage
        });
        return response;
      }
    }
  }

  // Fordere Basic Auth an
  return new NextResponse("Zugang erforderlich", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="AgentFlow Portal"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
