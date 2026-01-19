import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

const db = supabaseAdmin;

// GET - Alle Freigaben für das Projekt des Kunden abrufen
export async function GET() {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client's project
    const { data: project, error: projectError } = await db
      .from('portal_projects')
      .select('id')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ approvals: [] });
    }

    // Get approvals with milestone title
    const { data: approvals, error: approvalsError } = await db
      .from('portal_approvals')
      .select(`
        *,
        portal_milestones (title)
      `)
      .eq('project_id', project.id)
      .order('status', { ascending: true })
      .order('created_at', { ascending: false });

    if (approvalsError) {
      console.error('Approvals fetch error:', approvalsError);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    // Map to include milestone_title at the top level
    const formattedApprovals = (approvals || []).map(approval => ({
      ...approval,
      milestone_title: approval.portal_milestones?.title || null,
      portal_milestones: undefined
    }));

    return NextResponse.json({ approvals: formattedApprovals });
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

    // Verify approval belongs to client's project
    const { data: approval, error: approvalError } = await db
      .from('portal_approvals')
      .select(`
        *,
        portal_projects!inner (client_id)
      `)
      .eq('id', approvalId)
      .single();

    if (approvalError || !approval || approval.portal_projects?.client_id !== client.id) {
      return NextResponse.json({ error: 'Approval not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await db
        .from('portal_approvals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: client.name,
          feedback: feedback || null
        })
        .eq('id', approvalId);
    } else if (action === 'request_changes') {
      await db
        .from('portal_approvals')
        .update({
          status: 'changes_requested',
          feedback: feedback || 'Änderungen gewünscht'
        })
        .eq('id', approvalId);
    }

    const { data: updated, error: updateError } = await db
      .from('portal_approvals')
      .select('*')
      .eq('id', approvalId)
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, approval: updated });
  } catch (error) {
    console.error('Approvals POST error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
