import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getSqliteDb } from '@/lib/db';

// POST - Lead zu Portal-Client konvertieren
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getSqliteDb();

    // Lead abrufen
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(params.id) as {
      id: number;
      name: string;
      email: string;
      phone: string | null;
      company: string | null;
      package_interest: string | null;
    } | undefined;

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Prüfen ob bereits ein Portal-Client mit dieser E-Mail existiert
    const existingClient = db.prepare(`
      SELECT id FROM portal_clients WHERE email = ?
    `).get(lead.email);

    if (existingClient) {
      return NextResponse.json({
        error: 'A portal client with this email already exists',
        existingClientId: (existingClient as { id: number }).id
      }, { status: 409 });
    }

    // Zugangscode generieren
    const prefix = lead.name.split(' ')[0].toUpperCase().slice(0, 4);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    let accessCode = `${prefix}-${random}`;

    // Sicherstellen dass Code unique ist
    let attempts = 0;
    while (attempts < 10) {
      const existingCode = db.prepare('SELECT id FROM portal_clients WHERE access_code = ?').get(accessCode);
      if (!existingCode) break;
      accessCode = `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      attempts++;
    }

    // Portal-Client erstellen
    const clientResult = db.prepare(`
      INSERT INTO portal_clients (name, email, company, phone, access_code, lead_id, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `).run(
      lead.name,
      lead.email,
      lead.company,
      lead.phone,
      accessCode,
      lead.id
    );

    const clientId = Number(clientResult.lastInsertRowid);

    // Bestimme Paket aus Lead-Interesse
    let packageType = 'Starter';
    if (lead.package_interest) {
      const interest = lead.package_interest.toLowerCase();
      if (interest.includes('premium') || interest.includes('enterprise')) {
        packageType = 'Premium';
      } else if (interest.includes('business') || interest.includes('professional')) {
        packageType = 'Business';
      }
    }

    // Standard-Projekt erstellen
    const projectResult = db.prepare(`
      INSERT INTO portal_projects (client_id, name, package, status, status_label, progress, manager)
      VALUES (?, ?, ?, 'planung', 'In Planung', 0, 'Alex Shaer')
    `).run(clientId, `Projekt ${lead.name}`, packageType);

    const projectId = Number(projectResult.lastInsertRowid);

    // Willkommensnachricht erstellen
    db.prepare(`
      INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
      VALUES (?, 'admin', 'AgentFlow Team', 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen und direkt mit uns kommunizieren.', 0)
    `).run(projectId);

    // Standard-Meilensteine erstellen
    const milestones = [
      { title: 'Erstgespräch & Briefing', status: 'pending', sort: 1 },
      { title: 'Konzept & Planung', status: 'pending', sort: 2 },
      { title: 'Design-Entwurf', status: 'pending', sort: 3 },
      { title: 'Entwicklung', status: 'pending', sort: 4 },
      { title: 'Testing & Review', status: 'pending', sort: 5 },
      { title: 'Go-Live', status: 'pending', sort: 6 },
    ];

    for (const m of milestones) {
      db.prepare(`
        INSERT INTO portal_milestones (project_id, title, status, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(projectId, m.title, m.status, m.sort);
    }

    // Lead-Status auf "converted" setzen
    db.prepare(`
      UPDATE leads SET status = 'converted', updated_at = datetime('now') WHERE id = ?
    `).run(lead.id);

    return NextResponse.json({
      success: true,
      client: {
        id: clientId,
        name: lead.name,
        email: lead.email,
        accessCode,
        projectId,
      },
      message: `Portal-Client erfolgreich erstellt. Zugangscode: ${accessCode}`
    });

  } catch (error) {
    console.error('Lead convert error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
