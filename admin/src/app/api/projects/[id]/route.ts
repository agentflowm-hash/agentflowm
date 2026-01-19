import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

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

    // Get project with client info using separate queries
    const { data: project, error: projectError } = await db
      .from("portal_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get client info
    const { data: client } = await db
      .from("portal_clients")
      .select("name, email, company")
      .eq("id", project.client_id)
      .single();

    const projectWithClient = {
      ...project,
      client_name: client?.name,
      client_email: client?.email,
      client_company: client?.company,
    };

    const { data: milestones } = await db
      .from("portal_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: true });

    const { data: messages } = await db
      .from("portal_messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    const { data: files } = await db
      .from("portal_files")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      project: projectWithClient,
      milestones: milestones || [],
      messages: messages || [],
      files: files || [],
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

    const { data: existing, error: fetchError } = await db
      .from("portal_projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updateData: Record<string, string | number | boolean | null> = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (pkg !== undefined) {
      updateData.package = pkg;
    }
    if (status !== undefined) {
      updateData.status = status;
    }
    if (status_label !== undefined) {
      updateData.status_label = status_label;
    }
    if (progress !== undefined) {
      updateData.progress = progress;
    }
    if (start_date !== undefined) {
      updateData.start_date = start_date;
    }
    if (estimated_end !== undefined) {
      updateData.estimated_end = estimated_end;
    }
    if (manager !== undefined) {
      updateData.manager = manager;
    }
    if (description !== undefined) {
      updateData.description = description;
    }
    if (preview_url !== undefined) {
      updateData.preview_url = preview_url;
    }
    if (preview_enabled !== undefined) {
      updateData.preview_enabled = preview_enabled;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    updateData.updated_at = new Date().toISOString();

    const { data: updated, error: updateError } = await db
      .from("portal_projects")
      .update(updateData)
      .eq("id", projectId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    console.error("Project PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
