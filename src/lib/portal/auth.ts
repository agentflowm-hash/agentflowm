import { cookies } from "next/headers";
import { validateSession, type PortalClient } from "@/lib/portal/db";

const COOKIE_NAME = "portal_session";

export async function getSession(): Promise<PortalClient | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return validateSession(sessionCookie.value);
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await getSession();
  return client !== null;
}

export async function requireAuth(): Promise<PortalClient> {
  const client = await getSession();
  if (!client) {
    throw new Error("Unauthorized");
  }
  return client;
}
