import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Database from "better-sqlite3";
import path from "path";

// ═══════════════════════════════════════════════════════════════
//                    TELEGRAM LOGIN FOR PORTAL
// Nur für bestehende Kunden - keine neuen Accounts!
// ═══════════════════════════════════════════════════════════════

// Verbindung zur Haupt-DB
function getMainDb() {
  const dbPath = path.join(process.cwd(), "..", "data", "agentflow.db");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

// Generiere Session Token
function generateToken(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Code fehlt" }, { status: 400 });
    }

    const cleanCode = code.replace(/\D/g, "");

    if (cleanCode.length !== 6) {
      return NextResponse.json(
        { error: "Code muss 6 Ziffern haben" },
        { status: 400 },
      );
    }

    const db = getMainDb();

    // Prüfe Login-Code
    const loginCode = db
      .prepare(
        `
      SELECT * FROM login_codes
      WHERE code = ? AND used = 0 AND expires_at > datetime('now')
    `,
      )
      .get(cleanCode) as any;

    if (!loginCode) {
      db.close();
      await new Promise((resolve) => setTimeout(resolve, 500));
      return NextResponse.json(
        { error: "Code ungültig oder abgelaufen" },
        { status: 401 },
      );
    }

    // Markiere als verwendet
    db.prepare(`UPDATE login_codes SET used = 1 WHERE id = ?`).run(
      loginCode.id,
    );

    // Prüfe ob Client existiert - NUR bestehende Kunden erlaubt!
    const client = db
      .prepare(
        `
      SELECT * FROM portal_clients WHERE LOWER(telegram_username) = LOWER(?)
    `,
      )
      .get(loginCode.telegram_username) as any;

    if (!client) {
      db.close();
      // Kein Account gefunden - Fehlermeldung
      return NextResponse.json(
        {
          error: "Kein Kundenaccount gefunden",
          message:
            "Für diesen Telegram-Account existiert kein Kundenportal-Zugang. Bitte kontaktieren Sie uns, um Kunde zu werden.",
          noAccount: true,
        },
        { status: 403 },
      );
    }

    // Prüfe ob Client ein Projekt hat
    const project = db
      .prepare(
        `
      SELECT id FROM portal_projects WHERE client_id = ?
    `,
      )
      .get(client.id) as any;

    if (!project) {
      db.close();
      return NextResponse.json(
        {
          error: "Kein aktives Projekt",
          message:
            "Ihr Kundenportal wird gerade eingerichtet. Bitte versuchen Sie es später erneut.",
          noProject: true,
        },
        { status: 403 },
      );
    }

    // Update last_login und Telegram-Daten
    db.prepare(
      `
      UPDATE portal_clients
      SET last_login = datetime('now'),
          telegram_id = COALESCE(telegram_id, ?)
      WHERE id = ?
    `,
    ).run(loginCode.telegram_id, client.id);

    // Erstelle Session
    const token = generateToken();

    // Lösche alte Sessions
    db.prepare(`DELETE FROM portal_sessions WHERE client_id = ?`).run(
      client.id,
    );

    // Neue Session
    db.prepare(
      `
      INSERT INTO portal_sessions (client_id, token, expires_at)
      VALUES (?, ?, datetime('now', '+30 days'))
    `,
    ).run(client.id, token);

    db.close();

    console.log(
      `✅ Portal login via Telegram: @${loginCode.telegram_username} (Client: ${client.name})`,
    );

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set("portal_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      path: "/",
    });

    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        username: loginCode.telegram_username,
        accessCode: client.access_code,
      },
    });
  } catch (error) {
    console.error("Telegram login error:", error);
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}
