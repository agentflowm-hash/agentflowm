import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

const ALLOWED_STATUS = [
  "pending",
  "contacted",
  "converted",
  "rejected",
] as const;
const MAX_NOTES_LENGTH = 2000;

// PATCH - Referral aktualisieren
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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    const db = getSqliteDb();

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (status !== undefined) {
      if (!ALLOWED_STATUS.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}` },
          { status: 400 },
        );
      }
      updates.push("status = ?");
      values.push(status);
    }
    if (notes !== undefined) {
      if (typeof notes !== "string" || notes.length > MAX_NOTES_LENGTH) {
        return NextResponse.json(
          {
            error: `Notes must be a string with max ${MAX_NOTES_LENGTH} characters`,
          },
          { status: 400 },
        );
      }
      updates.push("notes = ?");
      values.push(notes);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    values.push(numericId);

    const query = `UPDATE referrals SET ${updates.join(", ")} WHERE id = ?`;
    const result = db.prepare(query).run(...values);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Referral not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral PATCH error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// DELETE
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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const db = getSqliteDb();
    const result = db
      .prepare("DELETE FROM referrals WHERE id = ?")
      .run(numericId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Referral not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
