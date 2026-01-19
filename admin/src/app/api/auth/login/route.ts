import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 400 });
    }
    
    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }
    
    await createSession();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
