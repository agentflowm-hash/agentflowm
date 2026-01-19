import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

// Erlaubte Status-Werte für Meilensteine
const ALLOWED_MILESTONE_STATUS = ["pending", "current", "done"] as const;

// GET - Alle Meilensteine eines Projekts
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

    const milestones = db
      .prepare(
        `
      SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY sort_order ASC
    `,
      )
      .all(projectId);

    return NextResponse.json({ milestones });
  } catch (error) {
    console.error("Milestones GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PATCH - Meilenstein aktualisieren
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
    const { milestoneId, status, date, title } = body;

    // Validierung
    const msId = parseInt(milestoneId, 10);
    if (!milestoneId || isNaN(msId)) {
      return NextResponse.json(
        { error: "Valid milestone ID is required" },
        { status: 400 },
      );
    }
    if (status !== undefined && !ALLOWED_MILESTONE_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }
    if (
      title !== undefined &&
      (typeof title !== "string" || title.length < 1)
    ) {
      return NextResponse.json(
        { error: "Title must be a non-empty string" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    // Prüfen ob Meilenstein existiert und zum Projekt gehört
    const milestone = db
      .prepare(
        `
      SELECT * FROM portal_milestones WHERE id = ? AND project_id = ?
    `,
      )
      .get(msId, projectId);

    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 },
      );
    }

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (date !== undefined) {
      updates.push("date = ?");
      values.push(date || "");
    }
    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    values.push(msId);
    const query = `UPDATE portal_milestones SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    // Bei Status-Änderung: Projekt-Progress aktualisieren
    if (status !== undefined) {
      updateProjectProgress(db, projectId);
    }

    const updated = db
      .prepare("SELECT * FROM portal_milestones WHERE id = ?")
      .get(msId);

    return NextResponse.json({ success: true, milestone: updated });
  } catch (error) {
    console.error("Milestone PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neuen Meilenstein hinzufügen
export async function POST(
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
    const { title, status, date } = body;

    // Validierung
    if (!title || typeof title !== "string" || title.length < 1) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (status !== undefined && !ALLOWED_MILESTONE_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    // Prüfen ob Projekt existiert
    const project = db
      .prepare("SELECT * FROM portal_projects WHERE id = ?")
      .get(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Höchste sort_order finden
    const maxSort = db
      .prepare(
        `
      SELECT MAX(sort_order) as max FROM portal_milestones WHERE project_id = ?
    `,
      )
      .get(projectId) as { max: number | null };

    const sortOrder = (maxSort?.max || 0) + 1;

    const result = db
      .prepare(
        `
      INSERT INTO portal_milestones (project_id, title, status, date, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `,
      )
      .run(
        projectId,
        title.trim(),
        status || "pending",
        date || null,
        sortOrder,
      );

    const newMilestone = db
      .prepare("SELECT * FROM portal_milestones WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json({
      success: true,
      milestone: newMilestone,
    });
  } catch (error) {
    console.error("Milestone POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Hilfsfunktion: Projekt-Progress basierend auf Meilensteinen berechnen
function updateProjectProgress(
  db: ReturnType<typeof getSqliteDb>,
  projectId: number,
) {
  const milestones = db
    .prepare(
      `
    SELECT status FROM portal_milestones WHERE project_id = ?
  `,
    )
    .all(projectId) as { status: string }[];

  if (milestones.length === 0) return;

  const completed = milestones.filter((m) => m.status === "done").length;
  const current = milestones.filter((m) => m.status === "current").length;

  // Completed + halber aktueller Meilenstein
  const progress = Math.round(
    ((completed + current * 0.5) / milestones.length) * 100,
  );

  // Status-Label basierend auf Progress
  let statusLabel = "In Planung";
  let status = "planung";

  if (progress === 100) {
    statusLabel = "Abgeschlossen";
    status = "abgeschlossen";
  } else if (progress > 0) {
    statusLabel = "In Entwicklung";
    status = "entwicklung";
  }

  db.prepare(
    `
    UPDATE portal_projects SET progress = ?, status = ?, status_label = ?, updated_at = datetime('now') WHERE id = ?
  `,
  ).run(progress, status, statusLabel, projectId);
}
