import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAuthenticated } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/leads
//                    Alle Leads abrufen
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    // Auth prüfen
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    // Query-Parameter
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Leads abrufen
    let query = supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: allLeads, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Statistiken - alle Leads für Stats holen
    const { data: allLeadsForStats } = await supabaseAdmin
      .from('leads')
      .select('status');

    const stats = {
      total: allLeadsForStats?.length || 0,
      new: allLeadsForStats?.filter(l => l.status === 'new').length || 0,
      contacted: allLeadsForStats?.filter(l => l.status === 'contacted').length || 0,
      qualified: allLeadsForStats?.filter(l => l.status === 'qualified').length || 0,
      converted: allLeadsForStats?.filter(l => l.status === 'converted').length || 0,
      lost: allLeadsForStats?.filter(l => l.status === 'lost').length || 0,
    };

    return NextResponse.json({
      leads: allLeads || [],
      stats,
      pagination: {
        limit,
        offset,
        total: stats.total,
      },
    });

  } catch (error) {
    console.error('Admin Leads Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
//                    PATCH /api/admin/leads
//                    Lead Status aktualisieren
// ═══════════════════════════════════════════════════════════════

export async function PATCH(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Lead Update Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
