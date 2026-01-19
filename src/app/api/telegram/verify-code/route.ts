import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginCode, authenticatedUsers, loginCodes, createSession } from '@/lib/auth-store';
import { createPortalClient, getPortalClientByTelegram } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════
//                    VERIFY LOGIN CODE
// Verifiziert den 6-stelligen Code vom Telegram Bot
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Ungültiger Code. Bitte gib den 6-stelligen Code ein.' },
        { status: 400 }
      );
    }

    // Verifiziere Code
    const loginData = verifyLoginCode(code);

    if (!loginData) {
      return NextResponse.json(
        { error: 'Code ungültig oder abgelaufen. Bitte fordere einen neuen Code an.' },
        { status: 401 }
      );
    }

    // Speichere authentifizierten User
    authenticatedUsers.set(loginData.username, {
      telegramId: loginData.telegramId,
      username: loginData.username,
      firstName: loginData.firstName,
      authDate: new Date(),
    });

    // Lösche verwendeten Code
    loginCodes.delete(code);

    // Portal-Client erstellen oder abrufen
    let portalAccessCode: string | undefined;
    try {
      const existingClient = getPortalClientByTelegram(loginData.username);
      if (existingClient) {
        portalAccessCode = existingClient.access_code;
      } else {
        const newClient = createPortalClient({
          name: loginData.firstName || loginData.username,
          telegramUsername: loginData.username,
          firstName: loginData.firstName,
          telegramId: loginData.telegramId,
        });
        portalAccessCode = newClient.accessCode;
      }
    } catch (err) {
      console.error('Failed to create portal client:', err);
    }

    // Erstelle Session
    const sessionId = createSession(
      loginData.username,
      loginData.firstName,
      loginData.telegramId,
      portalAccessCode
    );

    // Response mit Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        username: loginData.username,
        firstName: loginData.firstName,
        portalAccessCode,
      },
    });

    response.cookies.set('af_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
      path: '/',
    });

    console.log(`✅ Login successful for @${loginData.username} with code ${code}`);

    return response;
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Verifizierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
