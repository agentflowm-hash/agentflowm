import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

// Erlaubte Status-Werte
const ALLOWED_PROJECT_STATUS = [
  "planung",
  "entwicklung",
  "review",
  "abgeschlossen",
  "pausiert",
] as const;
const ALLOWED_PACKAGES = [
  "Starter",
  "Business",
  "Premium",
  "Enterprise",
] as const;

// GET - Projekt mit Details abrufen
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
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    const project = db
      .prepare(
        `
      SELECT p.*, c.name as client_name, c.email as client_email, c.company as client_company
      FROM portal_projects p
      JOIN portal_clients c ON c.id = p.client_id
      WHERE p.id = ?
    `,
      )
      .get(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const milestones = db
      .prepare(
        `
      SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY sort_order ASC
    `,
      )
      .all(projectId);

    const messages = db
      .prepare(
        `
      SELECT * FROM portal_messages WHERE project_id = ? ORDER BY created_at DESC
    `,
      )
      .all(projectId);

    const files = db
      .prepare(
        `
      SELECT * FROM portal_files WHERE project_id = ? ORDER BY created_at DESC
    `,
      )
      .all(projectId);

    return NextResponse.json({
      project,
      milestones,
      messages,
      files,
    });
  } catch (error) {
    console.error("Project GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PATCH - Projekt aktualisieren
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
    const projectId = parseInt(id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const {
      name,
      package: pkg,
      status,
      status_label,
      progress,
      start_date,
      estimated_end,
      manager,
      description,
      preview_url,
      preview_enabled,
    } = body;

    // Validierung
    if (status !== undefined && !ALLOWED_PROJECT_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }
    if (pkg !== undefined && !ALLOWED_PACKAGES.includes(pkg)) {
      return NextResponse.json(
        { error: "Invalid package value" },
        { status: 400 },
      );
    }
    if (
      progress !== undefined &&
      (typeof progress !== "number" || progress < 0 || progress > 100)
    ) {
      return NextResponse.json(
        { error: "Progress must be a number between 0 and 100" },
        { status: 400 },
      );
    }
    if (
      preview_url !== undefined &&
      preview_url !== null &&
      typeof preview_url !== "string"
    ) {
      return NextResponse.json(
        { error: "Preview URL must be a string" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    const existing = db
      .prepare("SELECT * FROM portal_projects WHERE id = ?")
      .get(projectId);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updates: string[] = [];
    const values: (string | number | null)[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (pkg !== undefined) {
      updates.push("package = ?");
      values.push(pkg);
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (status_label !== undefined) {
      updates.push("status_label = ?");
      values.push(status_label);
    }
    if (progress !== undefined) {
      updates.push("progress = ?");
      values.push(progress);
    }
    if (start_date !== undefined) {
      updates.push("start_date = ?");
      values.push(start_date);
    }
    if (estimated_end !== undefined) {
      updates.push("estimated_end = ?");
      values.push(estimated_end);
    }
    if (manager !== undefined) {
      updates.push("manager = ?");
      values.push(manager);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (preview_url !== undefined) {
      updates.push("preview_url = ?");
      values.push(preview_url);
    }
    if (preview_enabled !== undefined) {
      updates.push("preview_enabled = ?");
      values.push(preview_enabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    updates.push("updated_at = datetime('now')");
    values.push(projectId);

    const query = `UPDATE portal_projects SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updated = db
      .prepare("SELECT * FROM portal_projects WHERE id = ?")
      .get(projectId);

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
