import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE - Meilenstein löschen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, milestoneId } = await params;
    const projectId = parseInt(id, 10);
    const msId = parseInt(milestoneId, 10);

    if (isNaN(projectId) || isNaN(msId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Prüfen ob Meilenstein existiert und zum Projekt gehört
    const { data: milestone, error: fetchError } = await db
      .from("portal_milestones")
      .select("*")
      .eq("id", msId)
      .eq("project_id", projectId)
      .single();

    if (fetchError || !milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 });
    }

    // Löschen
    const { error } = await db
      .from("portal_milestones")
      .delete()
      .eq("id", msId);

    if (error) {
      return NextResponse.json({ error: "Failed to delete milestone" }, { status: 500 });
    }

    // Projekt-Progress aktualisieren
    await updateProjectProgress(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// Hilfsfunktion: Projekt-Progress basierend auf Meilensteinen berechnen
async function updateProjectProgress(projectId: number) {
  const { data: milestones } = await db
    .from("portal_milestones")
    .select("status")
    .eq("project_id", projectId);

  if (!milestones || milestones.length === 0) {
    await db
      .from("portal_projects")
      .update({ progress: 0, status: "planung", status_label: "In Planung" })
      .eq("id", projectId);
    return;
  }

  const completed = milestones.filter((m) => m.status === "done").length;
  const current = milestones.filter((m) => m.status === "current").length;

  const progress = Math.round(
    ((completed + current * 0.5) / milestones.length) * 100,
  );

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
