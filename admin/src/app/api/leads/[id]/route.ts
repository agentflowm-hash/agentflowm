import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

// Erlaubte Werte für Validierung
const ALLOWED_STATUS = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
  "converted",
] as const;
const ALLOWED_PRIORITY = ["low", "medium", "high"] as const;

// GET einzelnen Lead
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
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const db = getSqliteDb();
    const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Lead GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PATCH - Lead aktualisieren
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
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes, priority } = body;

    // Validierung der Eingaben
    if (status !== undefined && !ALLOWED_STATUS.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      );
    }
    if (priority !== undefined && !ALLOWED_PRIORITY.includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 },
      );
    }
    if (notes !== undefined && typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes must be a string" },
        { status: 400 },
      );
    }

    const db = getSqliteDb();

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (status !== undefined) {
      updates.push("status = ?");
      values.push(status);
    }
    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes);
    }
    if (priority !== undefined) {
      updates.push("priority = ?");
      values.push(priority);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    updates.push("updated_at = ?");
    values.push(new Date().toISOString());
    values.push(leadId);

    const query = `UPDATE leads SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(query).run(...values);

    const updated = db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId);

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("Lead PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE - Lead löschen
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
    const leadId = parseInt(id, 10);

    if (isNaN(leadId)) {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const db = getSqliteDb();

    const lead = db.prepare("SELECT * FROM leads WHERE id = ?").get(leadId);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    db.prepare("DELETE FROM leads WHERE id = ?").run(leadId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
