import { cookies } from 'next/headers';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
//                    SIMPLE ADMIN AUTH
//                    Cookie-basiert, ohne externe Dependencies
// ═══════════════════════════════════════════════════════════════

const COOKIE_NAME = 'agentflow_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 Stunden

// Generiere einen sicheren Session-Token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash ein Passwort mit dem Secret
function hashPassword(password: string): string {
  const secret = process.env.ADMIN_PASSWORD || 'change-me-in-production';
  return crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex');
}

// Verifiziere Passwort
export function verifyPassword(inputPassword: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.warn('⚠️ ADMIN_PASSWORD not set in environment');
    return false;
  }
  
  return inputPassword === adminPassword;
}

// Session erstellen
export async function createSession(): Promise<string> {
  const token = generateSessionToken();
  const expires = new Date(Date.now() + SESSION_DURATION);
  
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires,
    path: '/admin',
  });
  
  return token;
}

// Session löschen (Logout)
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Prüfen ob User eingeloggt ist
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  
  // Einfache Validierung: Cookie existiert und ist nicht leer
  return !!sessionCookie?.value && sessionCookie.value.length === 64;
}

// Middleware-artige Funktion für Server Components
export async function requireAuth(): Promise<{ authenticated: boolean }> {
  const authenticated = await isAuthenticated();
  return { authenticated };
}
