import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

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

    const { data: milestones, error } = await db
      .from("portal_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ milestones: milestones || [] });
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

    // Prüfen ob Meilenstein existiert und zum Projekt gehört
    const { data: milestone, error: fetchError } = await db
      .from("portal_milestones")
      .select("*")
      .eq("id", msId)
      .eq("project_id", projectId)
      .single();

    if (fetchError || !milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 },
      );
    }

    const updateData: Record<string, string | number> = {};

    if (status !== undefined) {
      updateData.status = status;
    }
    if (date !== undefined) {
      updateData.date = date || "";
    }
    if (title !== undefined) {
      updateData.title = title;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data: updated, error: updateError } = await db
      .from("portal_milestones")
      .update(updateData)
      .eq("id", msId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    // Bei Status-Änderung: Projekt-Progress aktualisieren
    if (status !== undefined) {
      await updateProjectProgress(projectId);
    }

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

    // Prüfen ob Projekt existiert
    const { data: project, error: projectError } = await db
      .from("portal_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Höchste sort_order finden
    const { data: maxSortData } = await db
      .from("portal_milestones")
      .select("sort_order")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    const sortOrder = (maxSortData?.sort_order || 0) + 1;

    const { data: newMilestone, error: insertError } = await db
      .from("portal_milestones")
      .insert({
        project_id: projectId,
        title: title.trim(),
        status: status || "pending",
        date: date || null,
        sort_order: sortOrder,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

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
async function updateProjectProgress(projectId: number) {
  const { data: milestones } = await db
    .from("portal_milestones")
    .select("status")
    .eq("project_id", projectId);

  if (!milestones || milestones.length === 0) return;

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

  await db
    .from("portal_projects")
    .update({
      progress,
      status,
      status_label: statusLabel,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId);
}
