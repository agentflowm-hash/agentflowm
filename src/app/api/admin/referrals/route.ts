import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/referrals
//                    Alle Referrals abrufen
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabaseAdmin
      .from('referrals')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: allReferrals, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Statistiken
    const { data: allReferralsForStats } = await supabaseAdmin
      .from('referrals')
      .select('status');

    const stats = {
      total: allReferralsForStats?.length || 0,
      pending: allReferralsForStats?.filter(r => r.status === 'pending').length || 0,
      contacted: allReferralsForStats?.filter(r => r.status === 'contacted').length || 0,
      converted: allReferralsForStats?.filter(r => r.status === 'converted').length || 0,
      paid: allReferralsForStats?.filter(r => r.status === 'paid').length || 0,
      rejected: allReferralsForStats?.filter(r => r.status === 'rejected').length || 0,
    };

    return NextResponse.json({
      referrals: allReferrals || [],
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total,
      },
    });

  } catch (error) {
    console.error('Admin Referrals Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
//                    PATCH /api/admin/referrals
//                    Referral Status aktualisieren
// ═══════════════════════════════════════════════════════════════

export async function PATCH(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, commission, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    const updateData: Record<string, string | number | null> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }
    if (commission !== undefined) {
      updateData.commission = commission;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { error } = await supabaseAdmin
      .from('referrals')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Referral Update Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
