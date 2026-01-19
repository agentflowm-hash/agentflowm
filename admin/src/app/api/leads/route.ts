import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { db, Lead } from '@/lib/db';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: leads, error } = await db
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Leads error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, phone, company, packageInterest, budget, source, message, status, priority } = body;

    const { data: lead, error } = await db
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        package_interest: packageInterest || null,
        budget: budget || null,
        source: source || 'Manuell',
        message: message || null,
        status: status || 'new',
        priority: priority || 'medium',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
