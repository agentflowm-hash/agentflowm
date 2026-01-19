import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { db } from "@/lib/db";

// GET - Alle Portal-Clients abrufen
export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get clients with their projects
    const { data: clients, error } = await db
      .from('portal_clients')
      .select(`
        *,
        portal_projects (
          id,
          name,
          package,
          status,
          progress
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform to include project info and unread messages
    const clientsWithInfo = await Promise.all((clients || []).map(async (c: any) => {
      const project = c.portal_projects?.[0];
      let unread_messages = 0;

      if (project) {
        const { count } = await db
          .from('portal_messages')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', project.id)
          .eq('is_read', false)
          .eq('sender_type', 'client');
        unread_messages = count || 0;
      }

      return {
        ...c,
        project_id: project?.id,
        project_name: project?.name,
        package: project?.package,
        project_status: project?.status,
        progress: project?.progress,
        unread_messages,
        portal_projects: undefined,
      };
    }));

    return NextResponse.json({ clients: clientsWithInfo });
  } catch (error) {
    console.error("Clients GET error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST - Neuen Portal-Client erstellen
export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, company, phone, packageType } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Prüfen ob E-Mail bereits existiert
    const { data: existing } = await db
      .from('portal_clients')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A client with this email already exists" },
        { status: 409 },
      );
    }

    // Zugangscode generieren im Format XXXX-0000 (Name-Ziffern)
    const prefix = name.split(" ")[0].toUpperCase().slice(0, 4);
    let accessCode = "";
    let attempts = 0;

    while (attempts < 20) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      accessCode = `${prefix}-${randomNum}`;

      const { data: existingCode } = await db
        .from('portal_clients')
        .select('id')
        .eq('access_code', accessCode)
        .single();

      if (!existingCode) break;
      attempts++;
    }

    if (attempts >= 20) {
      return NextResponse.json(
        { error: "Could not generate unique access code" },
        { status: 500 },
      );
    }

    // Create client
    const { data: client, error: clientError } = await db
      .from('portal_clients')
      .insert({
        name,
        email,
        company: company || null,
        phone: phone || null,
        access_code: accessCode,
        status: 'active',
      })
      .select()
      .single();

    if (clientError) throw clientError;

    // Projekt erstellen
    const { data: project, error: projectError } = await db
      .from('portal_projects')
      .insert({
        client_id: client.id,
        name: `Projekt ${name}`,
        package: packageType || 'Starter',
        status: 'planung',
        status_label: 'In Planung',
        progress: 0,
        manager: 'Alex Shaer',
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Willkommensnachricht
    await db.from('portal_messages').insert({
      project_id: project.id,
      sender_type: 'admin',
      sender_name: 'AgentFlow Team',
      message: 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen.',
      is_read: false,
    });

    // Standard-Meilensteine
    const milestones = [
      { title: "Erstgespräch & Briefing", sort_order: 1 },
      { title: "Konzept & Planung", sort_order: 2 },
      { title: "Design-Entwurf", sort_order: 3 },
      { title: "Entwicklung", sort_order: 4 },
      { title: "Testing & Review", sort_order: 5 },
      { title: "Go-Live", sort_order: 6 },
    ];

    await db.from('portal_milestones').insert(
      milestones.map(m => ({
        project_id: project.id,
        title: m.title,
        status: 'pending',
        sort_order: m.sort_order,
      }))
    );

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name,
        email,
        accessCode,
        projectId: project.id,
      },
    });
  } catch (error) {
    console.error("Client POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
