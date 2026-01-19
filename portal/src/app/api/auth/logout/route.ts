import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('portal_session')?.value;

    if (token) {
      await deleteSession(token);
    }

    cookieStore.delete('portal_session');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
