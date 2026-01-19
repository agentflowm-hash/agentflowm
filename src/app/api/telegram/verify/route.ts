import { NextRequest, NextResponse } from 'next/server';
import { verifyLoginCode, upsertClientByTelegram, createPortalSession } from '@/lib/database';

// ═══════════════════════════════════════════════════════════════
//                    VERIFY LOGIN CODE
// Verifiziert 6-stelligen Code und erstellt Session
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // Validiere Input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Code fehlt' },
        { status: 400 }
      );
    }

    const cleanCode = code.replace(/\D/g, '');

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'Code muss 6 Ziffern haben' },
        { status: 400 }
      );
    }

    // Verifiziere Code in DB
    const loginCode = await verifyLoginCode(cleanCode);

    if (!loginCode) {
      return NextResponse.json(
        { success: false, error: 'Code ungültig oder abgelaufen' },
        { status: 401 }
      );
    }

    // Erstelle/Update Portal Client
    const client = await upsertClientByTelegram({
      telegramUsername: loginCode.telegram_username,
      telegramId: loginCode.telegram_id,
      firstName: loginCode.first_name || loginCode.telegram_username,
    });

    // Erstelle Session
    const sessionToken = await createPortalSession(client.id);

    console.log(`Login successful: @${loginCode.telegram_username} (Client #${client.id})`);

    // Response mit Cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: client.id,
        name: client.name,
        username: loginCode.telegram_username,
        firstName: loginCode.first_name,
        accessCode: client.access_code,
      },
    });

    // Session Cookie setzen
    response.cookies.set('portal_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 Tage
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { success: false, error: 'Verifizierung fehlgeschlagen' },
      { status: 500 }
    );
  }
}
