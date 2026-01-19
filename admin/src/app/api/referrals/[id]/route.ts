import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

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

    const updateData: Record<string, string> = {};

    if (status !== undefined) {
      if (!ALLOWED_STATUS.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}` },
          { status: 400 },
        );
      }
      updateData.status = status;
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
      updateData.notes = notes;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await db
      .from("referrals")
      .update(updateData)
      .eq("id", numericId)
      .select();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!data || data.length === 0) {
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

    // First check if the referral exists
    const { data: existing } = await db
      .from("referrals")
      .select("id")
      .eq("id", numericId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Referral not found" },
        { status: 404 },
      );
    }

    const { error } = await db.from("referrals").delete().eq("id", numericId);

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Referral DELETE error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
