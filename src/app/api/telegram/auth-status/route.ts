import { NextRequest, NextResponse } from 'next/server';
import { authenticatedUsers, pendingLogins } from '@/lib/auth-store';

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM AUTH STATUS CHECK
// Prüft ob ein User sich via Telegram authentifiziert hat
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username')?.toLowerCase();

  if (!username) {
    return NextResponse.json({ 
      error: 'Username parameter required' 
    }, { status: 400 });
  }

  // Prüfe ob Login verifiziert wurde
  const pendingLogin = pendingLogins.get(username);
  const authenticatedUser = authenticatedUsers.get(username);

  if (pendingLogin?.verified || authenticatedUser) {
    return NextResponse.json({
      authenticated: true,
      username: authenticatedUser?.username || username,
      firstName: authenticatedUser?.firstName || pendingLogin?.firstName,
    });
  }

  return NextResponse.json({
    authenticated: false,
  });
}

// POST - Starte einen neuen Login-Versuch (registriere pending)
export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json({ 
        error: 'Username required' 
      }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().replace('@', '');
    
    // Registriere pending Login
    pendingLogins.set(cleanUsername, {
      requestedAt: new Date(),
      verified: false,
    });

    return NextResponse.json({
      success: true,
      message: 'Login request registered, waiting for Telegram confirmation',
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}
