import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateAccessCode, createSession } from '@/lib/db';
import { supabaseAdmin } from '@/lib/supabase';

// IP-based rate limiting via Supabase
async function checkRateLimit(ip: string): Promise<boolean> {
  const identifier = `login_${ip}`;
  const windowMs = 15 * 60 * 1000; // 15 Minuten
  const maxAttempts = 10;

  try {
    const windowStart = new Date(Date.now() - windowMs).toISOString();

    const { data: existing } = await supabaseAdmin
      .from('rate_limits')
      .select('id, count')
      .eq('identifier', identifier)
      .eq('endpoint', 'portal_login')
      .gte('window_start', windowStart)
      .single();

    if (existing) {
      if (existing.count >= maxAttempts) return false;
      await supabaseAdmin
        .from('rate_limits')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id);
    } else {
      await supabaseAdmin.from('rate_limits').insert({
        identifier,
        endpoint: 'portal_login',
        count: 1,
        window_start: new Date().toISOString(),
      });
    }
    return true;
  } catch {
    return false; // Bei DB-Fehler blockieren (fail secure)
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Zu viele Versuche. Bitte 15 Minuten warten.' },
        { status: 429 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code erforderlich' }, { status: 400 });
    }

    // Validate access code against database
    const client = await validateAccessCode(code);

    if (!client) {
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
