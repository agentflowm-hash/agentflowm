// ═══════════════════════════════════════════════════════════════
//                    GLOBAL AUTH STORE
// In-memory store für Telegram Auth (überlebt Hot-Reloads)
// ═══════════════════════════════════════════════════════════════

export interface AuthenticatedUser {
  telegramId: number;
  username: string;
  firstName?: string;
  authDate: Date;
}

interface PendingLogin {
  requestedAt: Date;
  verified: boolean;
  telegramId?: number;
  firstName?: string;
  code?: string;
  username?: string;
}

// Login-Codes: code -> { chatId, username, firstName, telegramId }
interface LoginCode {
  code: string;
  chatId: number;
  username: string;
  firstName?: string;
  telegramId: number;
  createdAt: Date;
}

interface UserSession {
  username: string;
  firstName?: string;
  telegramId?: number;
  portalAccessCode?: string;
  createdAt: Date;
}

// Verwende globalThis um Hot-Reloads zu überleben
const globalForAuth = globalThis as unknown as {
  authenticatedUsers: Map<string, AuthenticatedUser> | undefined;
  pendingLogins: Map<string, PendingLogin> | undefined;
  userSessions: Map<string, UserSession> | undefined;
  loginCodes: Map<string, LoginCode> | undefined;
};

export const authenticatedUsers =
  globalForAuth.authenticatedUsers ?? new Map<string, AuthenticatedUser>();

export const pendingLogins =
  globalForAuth.pendingLogins ?? new Map<string, PendingLogin>();

export const userSessions =
  globalForAuth.userSessions ?? new Map<string, UserSession>();

export const loginCodes =
  globalForAuth.loginCodes ?? new Map<string, LoginCode>();

if (process.env.NODE_ENV !== "production") {
  globalForAuth.authenticatedUsers = authenticatedUsers;
  globalForAuth.pendingLogins = pendingLogins;
  globalForAuth.userSessions = userSessions;
  globalForAuth.loginCodes = loginCodes;
}

// Generiere 6-stelligen Login-Code
export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Speichere Login-Code
export function saveLoginCode(
  code: string,
  data: Omit<LoginCode, "code" | "createdAt">,
) {
  loginCodes.set(code, {
    code,
    ...data,
    createdAt: new Date(),
  });
}

// Verifiziere Login-Code
export function verifyLoginCode(code: string): LoginCode | null {
  const loginCode = loginCodes.get(code);
  if (!loginCode) return null;

  // Prüfe ob Code älter als 5 Minuten
  const now = new Date();
  const diff = now.getTime() - loginCode.createdAt.getTime();
  if (diff > 5 * 60 * 1000) {
    loginCodes.delete(code);
    return null;
  }

  return loginCode;
}

// Session-Hilfsfunktionen
export function createSession(
  username: string,
  firstName?: string,
  telegramId?: number,
  portalAccessCode?: string,
): string {
  const sessionId = crypto.randomUUID();
  userSessions.set(sessionId, {
    username,
    firstName,
    telegramId,
    portalAccessCode,
    createdAt: new Date(),
  });
  return sessionId;
}

export function getSession(sessionId: string): UserSession | undefined {
  return userSessions.get(sessionId);
}

export function deleteSession(sessionId: string): boolean {
  return userSessions.delete(sessionId);
}
