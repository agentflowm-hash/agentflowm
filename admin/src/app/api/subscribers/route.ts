import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: subscribers, error } = await db
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error('Subscribers error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
