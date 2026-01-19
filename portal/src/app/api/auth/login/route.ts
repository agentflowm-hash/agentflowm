import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateAccessCode, createSession } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code erforderlich' }, { status: 400 });
    }

    // Validate access code against database
    const client = await validateAccessCode(code);

    if (!client) {
      // Delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({ error: 'Ungültiger Code' }, { status: 401 });
    }

    // Create session in database
    const token = await createSession(client.id);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('portal_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: '/',
    });

    return NextResponse.json({
      success: true,
      client: {
        name: client.name,
        company: client.company,
      },
    });
  } catch (error) {
    console.error('Portal login error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
