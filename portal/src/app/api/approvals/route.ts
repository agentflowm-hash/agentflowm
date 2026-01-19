import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import Database from 'better-sqlite3';
import path from 'path';

function getDb() {
  const cwd = process.cwd();
  const dbPath = cwd.endsWith('/portal') || cwd.endsWith('\\portal')
    ? path.join(cwd, '..', 'data', 'agentflow.db')
    : path.join(cwd, 'data', 'agentflow.db');
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  return db;
}

// GET - Alle Freigaben für das Projekt des Kunden abrufen
export async function GET() {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = getDb();

    // Get client's project
    const project = db.prepare(`
      SELECT id FROM portal_projects WHERE client_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(client.id) as { id: number } | undefined;

    if (!project) {
      db.close();
      return NextResponse.json({ approvals: [] });
    }

    const approvals = db.prepare(`
      SELECT a.*, m.title as milestone_title
      FROM portal_approvals a
      LEFT JOIN portal_milestones m ON m.id = a.milestone_id
      WHERE a.project_id = ?
      ORDER BY
        CASE a.status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END,
        a.created_at DESC
    `).all(project.id);

    db.close();

    return NextResponse.json({ approvals });
  } catch (error) {
    console.error('Approvals GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST - Freigabe erteilen oder Feedback geben
export async function POST(request: NextRequest) {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { approvalId, action, feedback } = await request.json();

    if (!approvalId || !action) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const db = getDb();

    // Verify approval belongs to client's project
    const approval = db.prepare(`
      SELECT a.*, p.client_id
      FROM portal_approvals a
      JOIN portal_projects p ON p.id = a.project_id
      WHERE a.id = ?
    `).get(approvalId) as any;

    if (!approval || approval.client_id !== client.id) {
      db.close();
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
    }

    if (action === 'approve') {
      db.prepare(`
        UPDATE portal_approvals
        SET status = 'approved',
            approved_at = datetime('now'),
            approved_by = ?,
            feedback = ?
        WHERE id = ?
      `).run(client.name, feedback || null, approvalId);
    } else if (action === 'request_changes') {
      db.prepare(`
        UPDATE portal_approvals
        SET status = 'changes_requested',
            feedback = ?
        WHERE id = ?
      `).run(feedback || 'Änderungen gewünscht', approvalId);
    }

    const updated = db.prepare('SELECT * FROM portal_approvals WHERE id = ?').get(approvalId);
    db.close();

    return NextResponse.json({ success: true, approval: updated });
  } catch (error) {
    console.error('Approvals POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
