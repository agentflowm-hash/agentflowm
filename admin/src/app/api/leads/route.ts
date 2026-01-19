import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSqliteDb } from '@/lib/db';
import { leads } from '@/lib/db/schema';
import { db } from '@/lib/db';

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sqliteDb = getSqliteDb();
    const allLeads = sqliteDb.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100').all();
    return NextResponse.json({ leads: allLeads });
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

    const sqliteDb = getSqliteDb();
    const result = sqliteDb.prepare(`
      INSERT INTO leads (name, email, phone, company, package_interest, budget, source, message, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run(
      name,
      email,
      phone || null,
      company || null,
      packageInterest || null,
      budget || null,
      source || 'Manuell',
      message || null,
      status || 'new',
      priority || 'medium'
    );

    const newLead = sqliteDb.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    
    return NextResponse.json({ lead: newLead }, { status: 201 });
  } catch (error) {
    console.error('Create lead error:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
