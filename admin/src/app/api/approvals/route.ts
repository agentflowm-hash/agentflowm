import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

const ALLOWED_APPROVAL_TYPES = [
  "design",
  "content",
  "feature",
  "milestone",
] as const;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

// GET - Alle Freigaben abrufen (optional nach project_id filtern)
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("project_id");

    if (projectId) {
      // Get approvals for specific project
      const { data: approvals, error } = await db
        .from("portal_approvals")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      // Enrich with project, client, and milestone info
      const enrichedApprovals = await Promise.all(
        (approvals || []).map(async (approval) => {
          const { data: project } = await db
            .from("portal_projects")
            .select("name, client_id")
            .eq("id", approval.project_id)
            .single();

          let clientName = null;
          if (project) {
            const { data: client } = await db
              .from("portal_clients")
              .select("name")
              .eq("id", project.client_id)
              .single();
            clientName = client?.name;
          }

          let milestoneTitle = null;
          if (approval.milestone_id) {
            const { data: milestone } = await db
              .from("portal_milestones")
              .select("title")
              .eq("id", approval.milestone_id)
              .single();
            milestoneTitle = milestone?.title;
          }

          return {
            ...approval,
            project_name: project?.name,
            client_name: clientName,
            milestone_title: milestoneTitle,
          };
        }),
      );

      return NextResponse.json({ approvals: enrichedApprovals });
    } else {
      // Get all approvals, ordered by status (pending first) then by created_at
      const { data: approvals, error } = await db
        .from("portal_approvals")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      // Enrich with project, client, and milestone info
      const enrichedApprovals = await Promise.all(
        (approvals || []).map(async (approval) => {
          const { data: project } = await db
            .from("portal_projects")
            .select("name, client_id")
            .eq("id", approval.project_id)
            .single();

          let clientName = null;
          if (project) {
            const { data: client } = await db
              .from("portal_clients")
              .select("name")
              .eq("id", project.client_id)
              .single();
            clientName = client?.name;
          }

          let milestoneTitle = null;
          if (approval.milestone_id) {
            const { data: milestone } = await db
              .from("portal_milestones")
              .select("title")
              .eq("id", approval.milestone_id)
              .single();
            milestoneTitle = milestone?.title;
          }

          return {
            ...approval,
            project_name: project?.name,
            client_name: clientName,
            milestone_title: milestoneTitle,
          };
        }),
      );

      // Sort: pending first, then by created_at desc
      enrichedApprovals.sort((a, b) => {
        if (a.status === "pending" && b.status !== "pending") return -1;
        if (a.status !== "pending" && b.status === "pending") return 1;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });

      return NextResponse.json({ approvals: enrichedApprovals });
    }
  } catch (error) {
    console.error("Approvals GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neue Freigabe erstellen
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { project_id, milestone_id, title, description, type } =
      await request.json();

    if (!project_id || !title) {
      return NextResponse.json(
        { error: "project_id and title required" },
        { status: 400 },
      );
    }

    const numericProjectId = parseInt(project_id, 10);
    if (isNaN(numericProjectId) || numericProjectId <= 0) {
      return NextResponse.json(
        { error: "Invalid project_id" },
        { status: 400 },
      );
    }

    if (typeof title !== "string" || title.length > MAX_TITLE_LENGTH) {
      return NextResponse.json(
        {
          error: `Title must be a string with max ${MAX_TITLE_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (
      description &&
      (typeof description !== "string" ||
        description.length > MAX_DESCRIPTION_LENGTH)
    ) {
      return NextResponse.json(
        {
          error: `Description must be a string with max ${MAX_DESCRIPTION_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    const approvalType = type || "design";
    if (!ALLOWED_APPROVAL_TYPES.includes(approvalType)) {
      return NextResponse.json(
        {
          error: `Invalid type. Allowed: ${ALLOWED_APPROVAL_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    let numericMilestoneId: number | null = null;
    if (milestone_id) {
      numericMilestoneId = parseInt(milestone_id, 10);
      if (isNaN(numericMilestoneId) || numericMilestoneId <= 0) {
        return NextResponse.json(
          { error: "Invalid milestone_id" },
          { status: 400 },
        );
      }
    }

    const { data: approval, error: insertError } = await db
      .from("portal_approvals")
      .insert({
        project_id: numericProjectId,
        milestone_id: numericMilestoneId,
        title: title.trim(),
        description: description?.trim() || null,
        type: approvalType,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, approval });
  } catch (error) {
    console.error("Approvals POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE - Freigabe löschen
export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // First check if the approval exists
    const { data: existing } = await db
      .from("portal_approvals")
      .select("id")
      .eq("id", numericId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 },
      );
    }

    const { error } = await db
      .from("portal_approvals")
      .delete()
      .eq("id", numericId);

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approvals DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
