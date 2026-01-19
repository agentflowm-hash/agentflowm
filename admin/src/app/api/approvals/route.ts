import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

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

    const db = getSqliteDb();

    let query = `
      SELECT a.*, p.name as project_name, c.name as client_name, m.title as milestone_title
      FROM portal_approvals a
      JOIN portal_projects p ON p.id = a.project_id
      JOIN portal_clients c ON c.id = p.client_id
      LEFT JOIN portal_milestones m ON m.id = a.milestone_id
    `;

    if (projectId) {
      query += ` WHERE a.project_id = ? ORDER BY a.created_at DESC`;
      const approvals = db.prepare(query).all(projectId);
      return NextResponse.json({ approvals });
    } else {
      query += ` ORDER BY
        CASE a.status WHEN 'pending' THEN 0 ELSE 1 END,
        a.created_at DESC`;
      const approvals = db.prepare(query).all();
      return NextResponse.json({ approvals });
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

    const db = getSqliteDb();

    const result = db
      .prepare(
        `
      INSERT INTO portal_approvals (project_id, milestone_id, title, description, type)
      VALUES (?, ?, ?, ?, ?)
    `,
      )
      .run(
        numericProjectId,
        numericMilestoneId,
        title.trim(),
        description?.trim() || null,
        approvalType,
      );

    const approval = db
      .prepare("SELECT * FROM portal_approvals WHERE id = ?")
      .get(result.lastInsertRowid);

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

    const db = getSqliteDb();
    const result = db
      .prepare("DELETE FROM portal_approvals WHERE id = ?")
      .run(numericId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approvals DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
