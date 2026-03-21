/**
 * ═══════════════════════════════════════════════════════════════
 *              PUBLIC REFERRAL LEAD SUBMISSION
 * ═══════════════════════════════════════════════════════════════
 * No auth required — public endpoint for referral landing pages
 */

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referral_code, name, email, phone, company, message, package_interest } = body;

    if (!referral_code || !name || !email) {
      return NextResponse.json({ error: 'Name, E-Mail und Empfehlungscode sind erforderlich' }, { status: 400 });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 });
    }

    // Find referrer by code
    const { data: referrer } = await db
      .from('referrers')
      .select('id, name, email')
      .eq('referral_code', referral_code)
      .eq('status', 'active')
      .single();

    if (!referrer) {
      return NextResponse.json({ error: 'Ungültiger Empfehlungscode' }, { status: 404 });
    }

    // Check duplicate in last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await db
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .gte('created_at', oneDayAgo)
      .single();

    if (recent) {
      return NextResponse.json({ error: 'Eine Anfrage mit dieser E-Mail wurde bereits kürzlich gesendet' }, { status: 409 });
    }

    // Create lead with referrer
    const { data: lead, error } = await db
      .from('leads')
      .insert({
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        company: company || null,
        message: message || null,
        package_interest: package_interest || null,
        source: 'Empfehlung',
        referrer_id: referrer.id,
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Fehler beim Erstellen der Anfrage' }, { status: 500 });
    }

    // Update referrer counter
    const { data: ref } = await db.from('referrers').select('total_referrals').eq('id', referrer.id).single();
    if (ref) {
      await db.from('referrers').update({
        total_referrals: (ref.total_referrals || 0) + 1,
        updated_at: new Date().toISOString(),
      }).eq('id', referrer.id);
    }

    // Notification
    await db.from('notifications').insert({
      title: 'Neue Empfehlung eingegangen',
      message: `${name} wurde von ${referrer.name} empfohlen`,
      type: 'info',
      read: false,
    });

    // Send thank-you email to referrer
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de';
      await fetch(`${baseUrl}/api/referrers/thank-you`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referrer_name: referrer.name,
          referrer_email: referrer.email,
          lead_name: name,
          internal: true,
        }),
      });
    } catch { /* ignore email errors */ }

    return NextResponse.json({
      success: true,
      message: 'Anfrage erfolgreich gesendet! Wir melden uns in Kürze.',
      referrer_name: referrer.name,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 });
  }
}

// GET: Validate referral code and return referrer info (public)
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Code erforderlich' }, { status: 400 });
  }

  const { data: referrer } = await db
    .from('referrers')
    .select('name, company')
    .eq('referral_code', code)
    .eq('status', 'active')
    .single();

  if (!referrer) {
    return NextResponse.json({ error: 'Ungültiger Code' }, { status: 404 });
  }

  return NextResponse.json({ referrer_name: referrer.name, referrer_company: referrer.company });
}
