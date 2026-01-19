import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// Erlaubte Status-Werte
const ALLOWED_CLIENT_STATUS = ["active", "inactive", "suspended"] as const;

// GET - Einzelnen Client mit allen Details abrufen
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
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const { data: client, error: clientError } = await db
      .from("portal_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Projekte abrufen
    const { data: projects } = await db
      .from("portal_projects")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    // Für jedes Projekt: Meilensteine, Nachrichten, Dateien
    const projectsWithDetails = await Promise.all(
      (projects || []).map(async (project) => {
        const { data: milestones } = await db
          .from("portal_milestones")
          .select("*")
          .eq("project_id", project.id)
          .order("sort_order", { ascending: true });

        const { data: messages } = await db
          .from("portal_messages")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false });

        const { data: files } = await db
          .from("portal_files")
          .select("*")
          .eq("project_id", project.id)
          .order("created_at", { ascending: false });

        return {
          ...project,
          milestones: milestones || [],
          messages: messages || [],
          files: files || [],
        };
      }),
    );

    return NextResponse.json({
      client,
      projects: projectsWithDetails,
    });
  } catch (error) {
    console.error("Client GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PATCH - Client aktualisieren
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
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, company, phone, status } = body;

    // Validierung
    if (status !== undefined && !ALLOWED_CLIENT_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }
    if (name !== undefined && (typeof name !== "string" || name.length < 2)) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 },
      );
    }
    if (
      email !== undefined &&
      (typeof email !== "string" || !email.includes("@"))
    ) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    const { data: existing, error: fetchError } = await db
      .from("portal_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Build update object
    const updateData: Record<string, string | number> = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (company !== undefined) {
      updateData.company = company || "";
    }
    if (phone !== undefined) {
      updateData.phone = phone || "";
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data: updated, error: updateError } = await db
      .from("portal_clients")
      .update(updateData)
      .eq("id", clientId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error("Client PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE - Client löschen (mit allen zugehörigen Daten)
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
    const clientId = parseInt(id, 10);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid client ID" }, { status: 400 });
    }

    const { data: client, error: fetchError } = await db
      .from("portal_clients")
      .select("*")
      .eq("id", clientId)
      .single();

    if (fetchError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Alle zugehörigen Daten löschen
    const { data: projects } = await db
      .from("portal_projects")
      .select("id")
      .eq("client_id", clientId);

    for (const project of projects || []) {
      await db.from("portal_milestones").delete().eq("project_id", project.id);
      await db.from("portal_messages").delete().eq("project_id", project.id);
      await db.from("portal_files").delete().eq("project_id", project.id);
      await db.from("portal_approvals").delete().eq("project_id", project.id);
    }

    await db.from("portal_projects").delete().eq("client_id", clientId);
    await db.from("portal_sessions").delete().eq("client_id", clientId);
    await db.from("portal_clients").delete().eq("id", clientId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Client DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
