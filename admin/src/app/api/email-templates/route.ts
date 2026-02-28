import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Alle Email Templates
export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = db.from("portal_email_templates").select("*");
    
    if (category) {
      query = query.eq("category", category);
    }

    const { data: templates, error } = await query.order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ templates: templates || [] });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neues Template erstellen
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, subject, body: emailBody, category, variables } = body;

    if (!name || !subject || !emailBody) {
      return NextResponse.json({ error: "Name, subject, and body required" }, { status: 400 });
    }

    const { data: template, error } = await db
      .from("portal_email_templates")
      .insert({
        name,
        subject,
        body: emailBody,
        category: category || "general",
        variables: variables || [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, template });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
