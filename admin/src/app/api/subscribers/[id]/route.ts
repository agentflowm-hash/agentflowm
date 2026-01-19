import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

const ALLOWED_STATUS = ["active", "unsubscribed"] as const;
const MAX_NAME_LENGTH = 200;

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
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const { data: subscriber, error } = await db
      .from("subscribers")
      .select("*")
      .eq("id", numericId)
      .single();

    if (error || !subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscriber });
  } catch (error) {
    console.error("Error fetching subscriber:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    const updateData: { status?: string; name?: string } = {};

    if (body.status !== undefined) {
      if (!ALLOWED_STATUS.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed: ${ALLOWED_STATUS.join(", ")}` },
          { status: 400 },
        );
      }
      updateData.status = body.status;
    }

    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.length > MAX_NAME_LENGTH) {
        return NextResponse.json(
          {
            error: `Name must be a string with max ${MAX_NAME_LENGTH} characters`,
          },
          { status: 400 },
        );
      }
      updateData.name = body.name;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await db
      .from("subscribers")
      .update(updateData)
      .eq("id", numericId)
      .select();

    if (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    // First check if the subscriber exists
    const { data: existing } = await db
      .from("subscribers")
      .select("id")
      .eq("id", numericId)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 },
      );
    }

    const { error } = await db
      .from("subscribers")
      .delete()
      .eq("id", numericId);

    if (error) {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
