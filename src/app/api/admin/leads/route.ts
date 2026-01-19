import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { isAuthenticated } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

let dbInitialized = false;

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

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    // Query-Parameter
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Leads abrufen
    let allLeads;
    
    if (status && status !== 'all') {
      allLeads = db.select()
        .from(leads)
        .where(eq(leads.status, status))
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    } else {
      allLeads = db.select()
        .from(leads)
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    }

    // Statistiken
    const allLeadsForStats = db.select().from(leads).all();
    const stats = {
      total: allLeadsForStats.length,
      new: allLeadsForStats.filter(l => l.status === 'new').length,
      contacted: allLeadsForStats.filter(l => l.status === 'contacted').length,
      qualified: allLeadsForStats.filter(l => l.status === 'qualified').length,
      converted: allLeadsForStats.filter(l => l.status === 'converted').length,
      lost: allLeadsForStats.filter(l => l.status === 'lost').length,
    };

    return NextResponse.json({
      leads: allLeads,
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

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    const updateData: Record<string, string> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) {
      updateData.status = status;
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    db.update(leads)
      .set(updateData)
      .where(eq(leads.id, id))
      .run();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Lead Update Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
