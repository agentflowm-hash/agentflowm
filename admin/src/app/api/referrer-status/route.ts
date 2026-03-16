/**
 * ═══════════════════════════════════════════════════════════════
 *           PUBLIC REFERRER STATUS API
 * ═══════════════════════════════════════════════════════════════
 * No auth — referrer accesses via their unique code
 */

import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Code erforderlich' }, { status: 400 });
  }

  // Find referrer
  const { data: referrer } = await db
    .from('referrers')
    .select('id, name, email, company, total_referrals, converted_referrals, total_commission, commission_rate, referral_code')
    .eq('referral_code', code)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: 'Ungültiger Code' }, { status: 404 });
  }

  // Get referred leads (limited info — no sensitive data)
  const { data: leads } = await db
    .from('leads')
    .select('id, name, company, status, created_at')
    .eq('referrer_id', referrer.id)
    .order('created_at', { ascending: false });

  // Get commissions
  const { data: commissions } = await db
    .from('referral_commissions')
    .select('id, deal_value, commission_rate, commission_amount, status, paid_at, notes, created_at')
    .eq('referrer_id', referrer.id)
    .order('created_at', { ascending: false });

  // Map lead status to German labels (hide internal details)
  const referrals = (leads || []).map(l => ({
    id: l.id,
    name: l.name,
    company: l.company,
    status: l.status === 'new' ? 'Neu' : l.status === 'contacted' ? 'In Kontakt' : l.status === 'qualified' ? 'Qualifiziert' : l.status === 'converted' ? 'Kunde geworden' : l.status === 'lost' ? 'Nicht zustande' : l.status,
    date: l.created_at,
  }));

  const commissionList = (commissions || []).map(c => ({
    id: c.id,
    amount: c.commission_amount,
    deal_value: c.deal_value,
    rate: c.commission_rate,
    status: c.status === 'pending' ? 'Offen' : c.status === 'approved' ? 'Genehmigt' : 'Ausgezahlt',
    notes: c.notes,
    date: c.created_at,
    paid_at: c.paid_at,
  }));

  const totalPending = (commissions || []).filter(c => c.status !== 'paid').reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0);
  const totalPaid = (commissions || []).filter(c => c.status === 'paid').reduce((s, c) => s + parseFloat(String(c.commission_amount || 0)), 0);

  return NextResponse.json({
    referrer: {
      name: referrer.name,
      company: referrer.company,
      total_referrals: referrer.total_referrals,
      converted_referrals: referrer.converted_referrals,
      commission_rate: referrer.commission_rate,
      referral_code: referrer.referral_code,
    },
    referrals,
    commissions: commissionList,
    stats: {
      total_referrals: referrals.length,
      total_commission: parseFloat(String(referrer.total_commission || 0)),
      pending_commission: totalPending,
      paid_commission: totalPaid,
    },
  });
}
