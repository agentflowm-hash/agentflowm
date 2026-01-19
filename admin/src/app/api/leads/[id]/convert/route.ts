import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// POST - Lead zu Portal-Client konvertieren
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Lead abrufen
    const { data: lead, error: leadError } = await db
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Prüfen ob bereits ein Portal-Client mit dieser E-Mail existiert
    const { data: existingClient } = await db
      .from("portal_clients")
      .select("id")
      .eq("email", lead.email)
      .single();

    if (existingClient) {
      return NextResponse.json(
        {
          error: "A portal client with this email already exists",
          existingClientId: existingClient.id,
        },
        { status: 409 },
      );
    }

    // Zugangscode generieren
    const prefix = lead.name.split(" ")[0].toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    let accessCode = `${prefix}-${random}`;

    // Sicherstellen dass Code unique ist
    let attempts = 0;
    while (attempts < 10) {
      const { data: existingCode } = await db
        .from("portal_clients")
        .select("id")
        .eq("access_code", accessCode)
        .single();

      if (!existingCode) break;
      accessCode = `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      attempts++;
    }

    // Portal-Client erstellen
    const { data: newClient, error: clientError } = await db
      .from("portal_clients")
      .insert({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        phone: lead.phone,
        access_code: accessCode,
        lead_id: lead.id,
        status: "active",
      })
      .select()
      .single();

    if (clientError || !newClient) {
      console.error("Client insert error:", clientError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const clientId = newClient.id;

    // Bestimme Paket aus Lead-Interesse
    let packageType = "Starter";
    if (lead.package_interest) {
      const interest = lead.package_interest.toLowerCase();
      if (interest.includes("premium") || interest.includes("enterprise")) {
        packageType = "Premium";
      } else if (
        interest.includes("business") ||
        interest.includes("professional")
      ) {
        packageType = "Business";
      }
    }

    // Standard-Projekt erstellen
    const { data: newProject, error: projectError } = await db
      .from("portal_projects")
      .insert({
        client_id: clientId,
        name: `Projekt ${lead.name}`,
        package: packageType,
        status: "planung",
        status_label: "In Planung",
        progress: 0,
        manager: "Alex Shaer",
      })
      .select()
      .single();

    if (projectError || !newProject) {
      console.error("Project insert error:", projectError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const projectId = newProject.id;

    // Willkommensnachricht erstellen
    await db.from("portal_messages").insert({
      project_id: projectId,
      sender_type: "admin",
      sender_name: "AgentFlow Team",
      message:
        "Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen und direkt mit uns kommunizieren.",
      is_read: false,
    });

    // Standard-Meilensteine erstellen
    const milestones = [
      { title: "Erstgespräch & Briefing", status: "pending", sort_order: 1 },
      { title: "Konzept & Planung", status: "pending", sort_order: 2 },
      { title: "Design-Entwurf", status: "pending", sort_order: 3 },
      { title: "Entwicklung", status: "pending", sort_order: 4 },
      { title: "Testing & Review", status: "pending", sort_order: 5 },
      { title: "Go-Live", status: "pending", sort_order: 6 },
    ];

    for (const m of milestones) {
      await db.from("portal_milestones").insert({
        project_id: projectId,
        title: m.title,
        status: m.status,
        sort_order: m.sort_order,
      });
    }

    // Lead-Status auf "converted" setzen
    await db
      .from("leads")
      .update({ status: "converted", updated_at: new Date().toISOString() })
      .eq("id", lead.id);

    return NextResponse.json({
      success: true,
      client: {
        id: clientId,
        name: lead.name,
        email: lead.email,
        accessCode,
        projectId,
      },
      message: `Portal-Client erfolgreich erstellt. Zugangscode: ${accessCode}`,
    });
  } catch (error) {
    console.error("Lead convert error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
