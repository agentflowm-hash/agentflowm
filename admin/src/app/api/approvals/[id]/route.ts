import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";
import { n8nDesignApproved, n8nChangesRequested } from "@/lib/n8n";

// GET - Einzelne Freigabe abrufen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const approvalId = parseInt(id, 10);

    if (isNaN(approvalId)) {
      return NextResponse.json({ error: "Invalid approval ID" }, { status: 400 });
    }

    const { data, error } = await db
      .from("portal_approvals")
      .select("*")
      .eq("id", approvalId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Approval not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Approval GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PATCH - Freigabe aktualisieren
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const approvalId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(approvalId)) {
      return NextResponse.json({ error: "Invalid approval ID" }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (body.status) updateData.status = body.status;
    if (body.title) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.feedback !== undefined) updateData.feedback = body.feedback;
    if (body.responded_at !== undefined) updateData.responded_at = body.responded_at;

    const { data, error } = await db
      .from("portal_approvals")
      .update(updateData)
      .eq("id", approvalId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update approval" }, { status: 500 });
    }

    // n8n: Freigabe/Änderungswünsche → Telegram + Email
    if (body.status === "approved" || body.status === "changes_requested") {
      // Projekt + Kunden-Info holen
      const { data: approval } = await db
        .from("portal_approvals")
        .select("project_id, title")
        .eq("id", approvalId)
        .single();
      if (approval?.project_id) {
        const { data: project } = await db
          .from("portal_projects")
          .select("name, client_id")
          .eq("id", approval.project_id)
          .single();
        const { data: client } = project?.client_id
          ? await db.from("portal_clients").select("name").eq("id", project.client_id).single()
          : { data: null };
        const info = {
          client_name: client?.name || "Kunde",
          project_name: project?.name || "Projekt",
        };
        if (body.status === "approved") {
          n8nDesignApproved({ ...info, approval_title: approval.title });
        } else {
          n8nChangesRequested({ ...info, feedback: body.feedback || "" });
        }
      }
    }

    return NextResponse.json({ success: true, approval: data });
  } catch (error) {
    console.error("Approval PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE - Freigabe löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const approvalId = parseInt(id, 10);

    if (isNaN(approvalId)) {
      return NextResponse.json({ error: "Invalid approval ID" }, { status: 400 });
    }

    const { error } = await db
      .from("portal_approvals")
      .delete()
      .eq("id", approvalId);

    if (error) {
      console.error("Delete approval error:", error);
      return NextResponse.json({ error: "Failed to delete approval" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approval DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
