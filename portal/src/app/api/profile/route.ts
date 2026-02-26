import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request: Request) {
  try {
    const client = await getSession();
    if (!client) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, company, phone } = body;

    // Validate
    if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
      return NextResponse.json({ error: "Name muss mindestens 2 Zeichen haben" }, { status: 400 });
    }
    if (company !== undefined && typeof company !== "string") {
      return NextResponse.json({ error: "Ungültiges Unternehmen" }, { status: 400 });
    }
    if (phone !== undefined && typeof phone !== "string") {
      return NextResponse.json({ error: "Ungültige Telefonnummer" }, { status: 400 });
    }

    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = name.trim();
    if (company !== undefined) updates.company = company.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Keine Änderungen" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("clients")
      .update(updates)
      .eq("id", client.id)
      .select("id, name, email, company, phone")
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
    }

    return NextResponse.json({ client: data });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
