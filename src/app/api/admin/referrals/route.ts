import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { referrals } from '@/lib/db/schema';
import { isAuthenticated } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/referrals
//                    Alle Referrals abrufen
// ═══════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    if (!await isAuthenticated()) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
    }

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let allReferrals;
    
    if (status && status !== 'all') {
      allReferrals = db.select()
        .from(referrals)
        .where(eq(referrals.status, status))
        .orderBy(desc(referrals.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    } else {
      allReferrals = db.select()
        .from(referrals)
        .orderBy(desc(referrals.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    }

    // Statistiken
    const allReferralsForStats = db.select().from(referrals).all();
    const stats = {
      total: allReferralsForStats.length,
      pending: allReferralsForStats.filter(r => r.status === 'pending').length,
      contacted: allReferralsForStats.filter(r => r.status === 'contacted').length,
      converted: allReferralsForStats.filter(r => r.status === 'converted').length,
      paid: allReferralsForStats.filter(r => r.status === 'paid').length,
      rejected: allReferralsForStats.filter(r => r.status === 'rejected').length,
    };

    return NextResponse.json({
      referrals: allReferrals,
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

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const body = await request.json();
    const { id, status, commission, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    const updateData: Record<string, string | number | null> = {
      updatedAt: new Date().toISOString(),
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

    db.update(referrals)
      .set(updateData)
      .where(eq(referrals.id, id))
      .run();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Referral Update Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
