import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

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

    const db = getSqliteDb();

    const client = db
      .prepare("SELECT * FROM portal_clients WHERE id = ?")
      .get(clientId);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Projekte abrufen
    const projects = db
      .prepare(
        `
      SELECT * FROM portal_projects WHERE client_id = ? ORDER BY created_at DESC
    `,
      )
      .all(clientId);

    // Für jedes Projekt: Meilensteine, Nachrichten, Dateien
    const projectsWithDetails = (projects as any[]).map((project) => {
      const milestones = db
        .prepare(
          `
        SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY sort_order ASC
      `,
        )
        .all(project.id);

      const messages = db
        .prepare(
          `
        SELECT * FROM portal_messages WHERE project_id = ? ORDER BY created_at DESC
      `,
        )
        .all(project.id);

      const files = db
        .prepare(
          `
        SELECT * FROM portal_files WHERE project_id = ? ORDER BY created_at DESC
      `,
        )
        .all(project.id);

      return {
        ...project,
        milestones,
        messages,
        files,
      };
    });

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

    const db = getSqliteDb();

    const existing = db
      .prepare("SELECT * FROM portal_clients WHERE id = ?")
      .get(clientId);
    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Build update query
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (email !== undefined) {
      updates.push("email = ?");
      values.push(email);
    }
    if (company !== undefined) {
      updates.push("company = ?");
      values.push(company || "");
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(phone || "");
    }
    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    values.push(clientId);
    const query = `UPDATE portal_clients SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updated = db
      .prepare("SELECT * FROM portal_clients WHERE id = ?")
      .get(clientId);

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

    const db = getSqliteDb();

    const client = db
      .prepare("SELECT * FROM portal_clients WHERE id = ?")
      .get(clientId);
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Alle zugehörigen Daten löschen (in Transaktion für Konsistenz)
    const deleteClient = db.transaction(() => {
      const projects = db
        .prepare("SELECT id FROM portal_projects WHERE client_id = ?")
        .all(clientId) as { id: number }[];

      for (const project of projects) {
        db.prepare("DELETE FROM portal_milestones WHERE project_id = ?").run(
          project.id,
        );
        db.prepare("DELETE FROM portal_messages WHERE project_id = ?").run(
          project.id,
        );
        db.prepare("DELETE FROM portal_files WHERE project_id = ?").run(
          project.id,
        );
        db.prepare("DELETE FROM portal_approvals WHERE project_id = ?").run(
          project.id,
        );
      }

      db.prepare("DELETE FROM portal_projects WHERE client_id = ?").run(
        clientId,
      );
      db.prepare("DELETE FROM portal_sessions WHERE client_id = ?").run(
        clientId,
      );
      db.prepare("DELETE FROM portal_clients WHERE id = ?").run(clientId);
    });

    deleteClient();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Client DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
