import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

// ═══════════════════════════════════════════════════════════════
//                    POST /api/admin/logout
//                    Admin Logout
// ═══════════════════════════════════════════════════════════════

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Erfolgreich ausgeloggt',
    });

  } catch (error) {
    console.error('Admin Logout Error:', error);
    return NextResponse.json(
      { error: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
