import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSqliteDb } from "@/lib/db";

// GET - Alle Portal-Clients abrufen
export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getSqliteDb();

    const clients = db
      .prepare(
        `
      SELECT
        c.*,
        p.id as project_id,
        p.name as project_name,
        p.package,
        p.status as project_status,
        p.progress,
        (SELECT COUNT(*) FROM portal_messages WHERE project_id = p.id AND is_read = 0 AND sender_type = 'client') as unread_messages
      FROM portal_clients c
      LEFT JOIN portal_projects p ON p.client_id = c.id
      ORDER BY c.created_at DESC
    `,
      )
      .all();

    return NextResponse.json({ clients });
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

    const db = getSqliteDb();

    // Prüfen ob E-Mail bereits existiert
    const existing = db
      .prepare("SELECT id FROM portal_clients WHERE email = ?")
      .get(email);
    if (existing) {
      return NextResponse.json(
        { error: "A client with this email already exists" },
        { status: 409 },
      );
    }

    // Zugangscode generieren im Format XXXX-0000 (Name-Ziffern)
    const prefix = name.split(" ")[0].toUpperCase().slice(0, 4);

    // Use transaction to prevent race condition
    let clientId: number | null = null;
    let accessCode = "";

    const insertClient = db.transaction(() => {
      let attempts = 0;
      while (attempts < 20) {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        accessCode = `${prefix}-${randomNum}`;

        try {
          const result = db
            .prepare(
              `INSERT INTO portal_clients (name, email, company, phone, access_code, status)
               VALUES (?, ?, ?, ?, ?, 'active')`,
            )
            .run(name, email, company || null, phone || null, accessCode);
          clientId = Number(result.lastInsertRowid);
          return; // Success
        } catch (e: any) {
          // If UNIQUE constraint failed on access_code, retry with new code
          if (
            e.code === "SQLITE_CONSTRAINT_UNIQUE" &&
            e.message.includes("access_code")
          ) {
            attempts++;
            continue;
          }
          throw e; // Re-throw other errors
        }
      }
      throw new Error(
        "Could not generate unique access code after 20 attempts",
      );
    });

    insertClient();

    if (!clientId) {
      return NextResponse.json(
        { error: "Failed to create client" },
        { status: 500 },
      );
    }

    // Projekt erstellen
    const projectResult = db
      .prepare(
        `
      INSERT INTO portal_projects (client_id, name, package, status, status_label, progress, manager)
      VALUES (?, ?, ?, 'planung', 'In Planung', 0, 'Alex Shaer')
    `,
      )
      .run(clientId, `Projekt ${name}`, packageType || "Starter");

    const projectId = Number(projectResult.lastInsertRowid);

    // Willkommensnachricht
    db.prepare(
      `
      INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
      VALUES (?, 'admin', 'AgentFlow Team', 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen.', 0)
    `,
    ).run(projectId);

    // Standard-Meilensteine
    const milestones = [
      { title: "Erstgespräch & Briefing", sort: 1 },
      { title: "Konzept & Planung", sort: 2 },
      { title: "Design-Entwurf", sort: 3 },
      { title: "Entwicklung", sort: 4 },
      { title: "Testing & Review", sort: 5 },
      { title: "Go-Live", sort: 6 },
    ];

    for (const m of milestones) {
      db.prepare(
        `
        INSERT INTO portal_milestones (project_id, title, status, sort_order)
        VALUES (?, ?, 'pending', ?)
      `,
      ).run(projectId, m.title, m.sort);
    }

    return NextResponse.json({
      success: true,
      client: {
        id: clientId,
        name,
        email,
        accessCode,
        projectId,
      },
    });
  } catch (error) {
    console.error("Client POST error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
