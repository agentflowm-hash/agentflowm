import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/subscribers
//                    Alle Subscribers abrufen
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
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: allSubscribers, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Statistiken
    const { data: allSubsForStats } = await supabaseAdmin
      .from('subscribers')
      .select('status');

    const stats = {
      total: allSubsForStats?.length || 0,
      pending: allSubsForStats?.filter(s => s.status === 'pending').length || 0,
      confirmed: allSubsForStats?.filter(s => s.status === 'confirmed').length || 0,
      unsubscribed: allSubsForStats?.filter(s => s.status === 'unsubscribed').length || 0,
    };

    return NextResponse.json({
      subscribers: allSubscribers || [],
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total,
      },
    });

  } catch (error) {
    console.error('Admin Subscribers Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
//                    DELETE /api/admin/subscribers
//                    Subscriber löschen
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Subscriber Delete Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
