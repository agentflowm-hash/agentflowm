import { cookies } from 'next/headers';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
//                    ADMIN AUTH (Cookie-based)
// ═══════════════════════════════════════════════════════════════

const COOKIE_NAME = 'agentflow_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyPassword(inputPassword: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.warn('⚠️ ADMIN_PASSWORD not set');
    return false;
  }

  // Timing-safe comparison to prevent timing attacks
  try {
    const a = Buffer.from(inputPassword.padEnd(64, '\0').slice(0, 64));
    const b = Buffer.from(adminPassword.padEnd(64, '\0').slice(0, 64));
    crypto.timingSafeEqual(a, b); // constant-time even for different lengths
    if (inputPassword.length !== adminPassword.length) return false;
    return crypto.timingSafeEqual(Buffer.from(inputPassword), Buffer.from(adminPassword));
  } catch {
    return false;
  }
}

export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const expires = new Date(Date.now() + SESSION_DURATION);
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/',
  });
  
  return token;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  // Validate: must be exactly 64 hex characters (32 bytes)
  return !!sessionCookie?.value && sessionCookie.value.length === 64 && /^[0-9a-f]{64}$/.test(sessionCookie.value);
}

export async function requireAuth(): Promise<{ authenticated: boolean }> {
  const authenticated = await isAuthenticated();
  return { authenticated };
}
