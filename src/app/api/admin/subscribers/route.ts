import { NextRequest, NextResponse } from 'next/server';
import { db, initializeDatabase } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { isAuthenticated } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

let dbInitialized = false;

// ═══════════════════════════════════════════════════════════════
//                    GET /api/admin/subscribers
//                    Alle Subscribers abrufen
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

    let allSubscribers;
    
    if (status && status !== 'all') {
      allSubscribers = db.select()
        .from(subscribers)
        .where(eq(subscribers.status, status))
        .orderBy(desc(subscribers.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    } else {
      allSubscribers = db.select()
        .from(subscribers)
        .orderBy(desc(subscribers.createdAt))
        .limit(limit)
        .offset(offset)
        .all();
    }

    // Statistiken
    const allSubsForStats = db.select().from(subscribers).all();
    const stats = {
      total: allSubsForStats.length,
      pending: allSubsForStats.filter(s => s.status === 'pending').length,
      confirmed: allSubsForStats.filter(s => s.status === 'confirmed').length,
      unsubscribed: allSubsForStats.filter(s => s.status === 'unsubscribed').length,
    };

    return NextResponse.json({
      subscribers: allSubscribers,
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

    if (!dbInitialized) {
      initializeDatabase();
      dbInitialized = true;
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID erforderlich' }, { status: 400 });
    }

    db.delete(subscribers)
      .where(eq(subscribers.id, id))
      .run();

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Admin Subscriber Delete Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
