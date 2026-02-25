import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';
import { db } from '@/lib/db';

async function checkAdminRateLimit(ip: string): Promise<boolean> {
  const identifier = `admin_login_${ip}`;
  const windowMs = 15 * 60 * 1000; // 15 Minuten
  const maxAttempts = 5;

  try {
    const windowStart = new Date(Date.now() - windowMs).toISOString();
    const { data: existing } = await db
      .from('rate_limits')
      .select('id, count')
      .eq('identifier', identifier)
      .eq('endpoint', 'admin_login')
      .gte('window_start', windowStart)
      .single();

    if (existing) {
      if (existing.count >= maxAttempts) return false;
      await db.from('rate_limits').update({ count: existing.count + 1 }).eq('id', existing.id);
    } else {
      await db.from('rate_limits').insert({
        identifier,
        endpoint: 'admin_login',
        count: 1,
        window_start: new Date().toISOString(),
      });
    }
    return true;
  } catch {
    return false; // Fail secure on DB error
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';

    const allowed = await checkAdminRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Zu viele Versuche. Bitte 15 Minuten warten.' },
        { status: 429 }
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay on wrong password
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }

    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}
