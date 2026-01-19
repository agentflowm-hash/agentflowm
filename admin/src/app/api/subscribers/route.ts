import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSqliteDb } from '@/lib/db';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getSqliteDb();
    const subscribers = db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 100').all();
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('Subscribers error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
