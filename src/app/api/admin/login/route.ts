import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    POST /api/admin/login
//                    Admin Login
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 });
    }

    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Passwort erforderlich' },
        { status: 400 }
      );
    }

    // Passwort prüfen
    if (!verifyPassword(password)) {
      // Delay gegen Brute-Force
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json(
        { error: 'Falsches Passwort' },
        { status: 401 }
      );
    }

    // Session erstellen
    await createSession();

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich eingeloggt',
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
