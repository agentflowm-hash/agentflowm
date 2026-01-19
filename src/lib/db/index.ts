import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
//                    DATABASE CONNECTION (LAZY)
// ═══════════════════════════════════════════════════════════════

// Datenbank-Pfad - im data Ordner (wird von Git ignoriert)
const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "agentflow.db");

// Lazy initialization - nur bei Bedarf erstellen
let sqliteInstance: Database.Database | null = null;
let drizzleDb: BetterSQLite3Database<typeof schema> | null = null;

function getSqlite(): Database.Database {
  if (!sqliteInstance) {
    // Stelle sicher, dass der data-Ordner existiert
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    sqliteInstance = new Database(DB_PATH);
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("foreign_keys = ON");
  }
  return sqliteInstance;
}

// Drizzle ORM Instance (lazy)
function getDrizzle(): BetterSQLite3Database<typeof schema> {
  if (!drizzleDb) {
    drizzleDb = drizzle(getSqlite(), { schema });
  }
  return drizzleDb;
}

// Export als Proxy für lazy loading
export const db = {
  insert: <
    T extends Parameters<BetterSQLite3Database<typeof schema>["insert"]>[0],
  >(
    table: T,
  ) => getDrizzle().insert(table),
  select: () => getDrizzle().select(),
  update: <
    T extends Parameters<BetterSQLite3Database<typeof schema>["update"]>[0],
  >(
    table: T,
  ) => getDrizzle().update(table),
  delete: <
    T extends Parameters<BetterSQLite3Database<typeof schema>["delete"]>[0],
  >(
    table: T,
  ) => getDrizzle().delete(table),
};

// ═══════════════════════════════════════════════════════════════
//                    DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════

export function initializeDatabase() {
  const sqlite = getSqlite();

  // Tabellen erstellen falls nicht vorhanden
  sqlite.exec(`
    -- Leads / Kontaktanfragen
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      source TEXT NOT NULL DEFAULT 'website',
      package_interest TEXT,
      message TEXT,
      budget TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      priority TEXT DEFAULT 'medium',
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      contacted_at TEXT
    );

    -- Website-Checks
    CREATE TABLE IF NOT EXISTS website_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      email TEXT,
      score_overall INTEGER,
      score_security INTEGER,
      score_seo INTEGER,
      score_accessibility INTEGER,
      score_performance INTEGER,
      score_structure INTEGER,
      load_time INTEGER,
      https_enabled INTEGER,
      result_json TEXT,
      ip_hash TEXT,
      user_agent TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Referrals / Empfehlungen
    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_name TEXT NOT NULL,
      referrer_email TEXT NOT NULL,
      referrer_phone TEXT,
      referred_name TEXT NOT NULL,
      referred_email TEXT,
      referred_phone TEXT,
      referred_company TEXT,
      context TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      converted_lead_id INTEGER REFERENCES leads(id),
      commission_status TEXT DEFAULT 'pending',
      commission_amount REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Newsletter Subscribers
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      topics TEXT,
      frequency TEXT DEFAULT 'weekly',
      status TEXT NOT NULL DEFAULT 'pending',
      confirm_token TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      confirmed_at TEXT,
      unsubscribed_at TEXT
    );

    -- Rate Limiting
    CREATE TABLE IF NOT EXISTS rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      request_count INTEGER NOT NULL DEFAULT 1,
      window_start TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Clients (Kunden mit Zugangscodes)
    CREATE TABLE IF NOT EXISTS portal_clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      telegram_username TEXT,
      telegram_id INTEGER,
      access_code TEXT NOT NULL UNIQUE,
      lead_id INTEGER REFERENCES leads(id),
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT
    );

    -- Portal Projects (Kundenprojekte)
    CREATE TABLE IF NOT EXISTS portal_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id),
      name TEXT NOT NULL,
      package TEXT NOT NULL DEFAULT 'Starter',
      status TEXT NOT NULL DEFAULT 'planung',
      status_label TEXT DEFAULT 'In Planung',
      progress INTEGER NOT NULL DEFAULT 0,
      start_date TEXT,
      estimated_end TEXT,
      manager TEXT DEFAULT 'Alex Shaer',
      description TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Milestones (Projekt-Meilensteine)
    CREATE TABLE IF NOT EXISTS portal_milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      date TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Messages (Nachrichten)
    CREATE TABLE IF NOT EXISTS portal_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      sender_type TEXT NOT NULL DEFAULT 'admin',
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Files (Dateien)
    CREATE TABLE IF NOT EXISTS portal_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      size INTEGER NOT NULL DEFAULT 0,
      mime_type TEXT,
      uploaded_by TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Sessions
    CREATE TABLE IF NOT EXISTS portal_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Portal Approvals (Design-Freigaben)
    CREATE TABLE IF NOT EXISTS portal_approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      milestone_id INTEGER REFERENCES portal_milestones(id),
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL DEFAULT 'design',
      status TEXT NOT NULL DEFAULT 'pending',
      approved_at TEXT,
      approved_by TEXT,
      feedback TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Login Codes (Telegram Auth)
    CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      telegram_id INTEGER NOT NULL,
      telegram_username TEXT NOT NULL,
      first_name TEXT,
      chat_id INTEGER NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );

    -- Indexes für Performance
    CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
    CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);

    CREATE INDEX IF NOT EXISTS idx_website_checks_url ON website_checks(url);
    CREATE INDEX IF NOT EXISTS idx_website_checks_created ON website_checks(created_at);

    CREATE INDEX IF NOT EXISTS idx_referrals_email ON referrals(referrer_email);
    CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

    CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);

    CREATE INDEX IF NOT EXISTS idx_portal_clients_code ON portal_clients(access_code);
    CREATE INDEX IF NOT EXISTS idx_portal_clients_telegram ON portal_clients(telegram_username);
    CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON portal_sessions(token);
    CREATE INDEX IF NOT EXISTS idx_portal_projects_client ON portal_projects(client_id);
    CREATE INDEX IF NOT EXISTS idx_portal_messages_project ON portal_messages(project_id);
    CREATE INDEX IF NOT EXISTS idx_portal_approvals_project ON portal_approvals(project_id);
    CREATE INDEX IF NOT EXISTS idx_login_codes_code ON login_codes(code);
    CREATE INDEX IF NOT EXISTS idx_login_codes_expires ON login_codes(expires_at);
  `);

  // Migration: Add telegram columns if they don't exist
  try {
    sqlite.exec(`ALTER TABLE portal_clients ADD COLUMN telegram_username TEXT`);
  } catch {
    // Column already exists
  }
  try {
    sqlite.exec(`ALTER TABLE portal_clients ADD COLUMN telegram_id INTEGER`);
  } catch {
    // Column already exists
  }

  // Migrate old telegram:username entries from email field
  try {
    const oldEntries = sqlite
      .prepare(
        `
      SELECT id, email FROM portal_clients WHERE email LIKE 'telegram:%'
    `,
      )
      .all() as { id: number; email: string }[];

    for (const entry of oldEntries) {
      const username = entry.email.replace("telegram:", "");
      sqlite
        .prepare(
          `
        UPDATE portal_clients SET telegram_username = ?, email = '' WHERE id = ?
      `,
        )
        .run(username, entry.id);
    }
  } catch {
    // Migration not needed or failed
  }

  console.log("✅ Database initialized at:", DB_PATH);

  // Demo-Daten nur in Entwicklung erstellen
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SEED_DEMO_DATA === "true"
  ) {
    seedPortalDemoData(sqlite);
  }
}

// Demo-Daten für Portal
function seedPortalDemoData(sqlite: Database.Database) {
  // Prüfen ob bereits Daten vorhanden
  const existingClient = sqlite
    .prepare("SELECT id FROM portal_clients LIMIT 1")
    .get();
  if (existingClient) return;

  console.log("🌱 Seeding portal demo data...");

  // Demo-Kunden erstellen
  const demoClients = [
    {
      name: "Max Mustermann",
      email: "max@mustermann.de",
      company: "Mustermann GmbH",
      phone: "+49 170 1234567",
      access_code: "DEMO-2026",
    },
    {
      name: "Anna Schmidt",
      email: "anna@schmidt-design.de",
      company: "Schmidt Design",
      phone: "+49 171 9876543",
      access_code: "TEST-CODE",
    },
    {
      name: "Peter Weber",
      email: "peter@weber-consulting.de",
      company: "Weber Consulting",
      phone: "+49 172 5555555",
      access_code: "WEBER-24",
    },
  ];

  for (const client of demoClients) {
    const result = sqlite
      .prepare(
        `
      INSERT INTO portal_clients (name, email, company, phone, access_code)
      VALUES (?, ?, ?, ?, ?)
    `,
      )
      .run(
        client.name,
        client.email,
        client.company,
        client.phone,
        client.access_code,
      );

    const clientId = result.lastInsertRowid;

    // Projekt für jeden Kunden
    const projectResult = sqlite
      .prepare(
        `
      INSERT INTO portal_projects (client_id, name, package, status, status_label, progress, start_date, estimated_end, manager)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        clientId,
        `${client.company} Website`,
        client.access_code === "DEMO-2026"
          ? "Business"
          : client.access_code === "TEST-CODE"
            ? "Premium"
            : "Starter",
        "entwicklung",
        "In Entwicklung",
        65,
        "2025-12-15",
        "2026-01-31",
        "Alex Shaer",
      );

    const projectId = projectResult.lastInsertRowid;

    // Meilensteine
    const milestones = [
      {
        title: "Kickoff & Briefing",
        status: "done",
        date: "15.12.2025",
        sort: 1,
      },
      { title: "Design-Konzept", status: "done", date: "22.12.2025", sort: 2 },
      { title: "Design-Freigabe", status: "done", date: "28.12.2025", sort: 3 },
      { title: "Entwicklung", status: "current", date: "In Arbeit", sort: 4 },
      { title: "Content-Einpflege", status: "pending", date: "KW 4", sort: 5 },
      { title: "Testing & QA", status: "pending", date: "KW 4", sort: 6 },
      { title: "Go-Live", status: "pending", date: "31.01.2026", sort: 7 },
    ];

    for (const m of milestones) {
      sqlite
        .prepare(
          `
        INSERT INTO portal_milestones (project_id, title, status, date, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `,
        )
        .run(projectId, m.title, m.status, m.date, m.sort);
    }

    // Nachrichten
    const messages = [
      {
        sender_type: "admin",
        sender_name: "Alex Shaer",
        message:
          "Die Startseite ist jetzt fertig. Bitte schauen Sie sich den Entwurf an.",
        is_read: 0,
      },
      {
        sender_type: "client",
        sender_name: client.name,
        message:
          "Super, gefällt mir! Können wir die Farbe des Headers etwas dunkler machen?",
        is_read: 1,
      },
      {
        sender_type: "admin",
        sender_name: "Alex Shaer",
        message: "Willkommen im Projekt! Hier können wir direkt kommunizieren.",
        is_read: 1,
      },
    ];

    for (const msg of messages) {
      sqlite
        .prepare(
          `
        INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
        VALUES (?, ?, ?, ?, ?)
      `,
        )
        .run(
          projectId,
          msg.sender_type,
          msg.sender_name,
          msg.message,
          msg.is_read,
        );
    }

    // Dateien
    const files = [
      {
        name: "logo_final.svg",
        original_name: "Logo_final.svg",
        size: 24576,
        mime_type: "image/svg+xml",
      },
      {
        name: "texte_startseite.docx",
        original_name: "Texte_Startseite.docx",
        size: 159744,
        mime_type:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
      {
        name: "bilder_team.zip",
        original_name: "Bilder_Team.zip",
        size: 13000000,
        mime_type: "application/zip",
      },
    ];

    for (const file of files) {
      sqlite
        .prepare(
          `
        INSERT INTO portal_files (project_id, name, original_name, size, mime_type)
        VALUES (?, ?, ?, ?, ?)
      `,
        )
        .run(
          projectId,
          file.name,
          file.original_name,
          file.size,
          file.mime_type,
        );
    }
  }

  console.log("✅ Portal demo data seeded");
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// IP-Adresse hashen für Datenschutz
export function hashIP(ip: string): string {
  const salt = process.env.IP_SALT || "agentflow-salt";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex")
    .substring(0, 16);
}

// Rate Limiting Check
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  maxRequests: number = 10,
  windowMinutes: number = 60,
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const sqlite = getSqlite();
  const windowStart = new Date(
    Date.now() - windowMinutes * 60 * 1000,
  ).toISOString();

  // Alte Einträge löschen (sicher mit prepared statement)
  sqlite
    .prepare(
      `
    DELETE FROM rate_limits
    WHERE datetime(window_start) < datetime('now', '-' || ? || ' minutes')
  `,
    )
    .run(windowMinutes * 2);

  // Aktuelle Requests zählen
  const result = sqlite
    .prepare(
      `
    SELECT SUM(request_count) as total
    FROM rate_limits
    WHERE identifier = ? AND endpoint = ? AND window_start > ?
  `,
    )
    .get(identifier, endpoint, windowStart) as { total: number | null };

  const currentCount = result?.total || 0;
  const allowed = currentCount < maxRequests;

  if (allowed) {
    // Request zählen
    sqlite
      .prepare(
        `
      INSERT INTO rate_limits (identifier, endpoint, request_count, window_start)
      VALUES (?, ?, 1, datetime('now'))
    `,
      )
      .run(identifier, endpoint);
  }

  return {
    allowed,
    remaining: Math.max(0, maxRequests - currentCount - 1),
    resetAt: new Date(Date.now() + windowMinutes * 60 * 1000),
  };
}

// Export für direkte SQL-Queries (nur für spezielle Fälle)
export function getSqliteDb(): Database.Database {
  return getSqlite();
}

// ═══════════════════════════════════════════════════════════════
//                    PORTAL CLIENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Zugangscode generieren (Format: NAME-XXXX)
function generateAccessCode(name: string): string {
  const prefix = name.split(" ")[0].toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

// Prüfen ob ein Telegram-User bereits einen Portal-Client hat
export function getPortalClientByTelegram(telegramUsername: string): {
  id: number;
  name: string;
  email: string;
  company: string | null;
  telegram_username: string | null;
  telegram_id: number | null;
  access_code: string;
} | null {
  const sqlite = getSqlite();
  const cleanUsername = telegramUsername.toLowerCase().replace("@", "");

  // Search by telegram_username column (preferred) or legacy email field
  const result = sqlite
    .prepare(
      `
    SELECT id, name, email, company, telegram_username, telegram_id, access_code
    FROM portal_clients
    WHERE telegram_username = ? OR email = ? OR email LIKE ?
  `,
    )
    .get(cleanUsername, `telegram:${cleanUsername}`, `%@${cleanUsername}%`) as
    | {
        id: number;
        name: string;
        email: string;
        company: string | null;
        telegram_username: string | null;
        telegram_id: number | null;
        access_code: string;
      }
    | undefined;

  return result || null;
}

// Neuen Portal-Client erstellen (bei Telegram-Registrierung)
export function createPortalClient(data: {
  name: string;
  telegramUsername: string;
  firstName?: string;
  telegramId?: number;
}): { clientId: number; accessCode: string; projectId: number } {
  const sqlite = getSqlite();

  // Prüfen ob bereits vorhanden
  const existing = getPortalClientByTelegram(data.telegramUsername);
  if (existing) {
    // Projekt-ID finden
    const project = sqlite
      .prepare(
        `
      SELECT id FROM portal_projects WHERE client_id = ? LIMIT 1
    `,
      )
      .get(existing.id) as { id: number } | undefined;

    return {
      clientId: existing.id,
      accessCode: existing.access_code,
      projectId: project?.id || 0,
    };
  }

  // Neuen Zugangscode generieren
  let accessCode = generateAccessCode(data.firstName || data.name);

  // Sicherstellen dass Code unique ist
  let attempts = 0;
  while (attempts < 10) {
    const existingCode = sqlite
      .prepare("SELECT id FROM portal_clients WHERE access_code = ?")
      .get(accessCode);
    if (!existingCode) break;
    accessCode = generateAccessCode(data.firstName || data.name) + attempts;
    attempts++;
  }

  // Client erstellen mit telegram_username und telegram_id in eigenen Spalten
  const clientResult = sqlite
    .prepare(
      `
    INSERT INTO portal_clients (name, email, company, telegram_username, telegram_id, access_code, status)
    VALUES (?, '', ?, ?, ?, ?, 'active')
  `,
    )
    .run(
      data.firstName || data.name,
      null, // Company wird später ergänzt
      data.telegramUsername.toLowerCase().replace("@", ""),
      data.telegramId || null,
      accessCode,
    );

  const clientId = Number(clientResult.lastInsertRowid);

  // Standard-Projekt erstellen
  const projectResult = sqlite
    .prepare(
      `
    INSERT INTO portal_projects (client_id, name, package, status, status_label, progress, manager)
    VALUES (?, ?, 'Starter', 'neu', 'Neu angelegt', 0, 'Alex Shaer')
  `,
    )
    .run(clientId, `Projekt ${data.firstName || data.name}`);

  const projectId = Number(projectResult.lastInsertRowid);

  // Willkommensnachricht erstellen
  sqlite
    .prepare(
      `
    INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
    VALUES (?, 'admin', 'AgentFlow Team', 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen und direkt mit uns kommunizieren.', 0)
  `,
    )
    .run(projectId);

  // Standard-Meilensteine erstellen
  const defaultMilestones = [
    { title: "Erstgespräch & Briefing", status: "pending", sort: 1 },
    { title: "Konzept & Planung", status: "pending", sort: 2 },
    { title: "Design-Entwurf", status: "pending", sort: 3 },
    { title: "Entwicklung", status: "pending", sort: 4 },
    { title: "Testing & Review", status: "pending", sort: 5 },
    { title: "Go-Live", status: "pending", sort: 6 },
  ];

  for (const m of defaultMilestones) {
    sqlite
      .prepare(
        `
      INSERT INTO portal_milestones (project_id, title, status, sort_order)
      VALUES (?, ?, ?, ?)
    `,
      )
      .run(projectId, m.title, m.status, m.sort);
  }

  console.log(
    `✅ Portal client created: ${data.telegramUsername} -> ${accessCode}`,
  );

  return { clientId, accessCode, projectId };
}

// Portal-Client nach Zugangscode suchen
export function getPortalClientByCode(accessCode: string): {
  id: number;
  name: string;
  email: string;
  company: string | null;
  access_code: string;
} | null {
  const sqlite = getSqlite();
  const result = sqlite
    .prepare(
      `
    SELECT id, name, email, company, access_code
    FROM portal_clients
    WHERE access_code = ? AND status = 'active'
  `,
    )
    .get(accessCode) as
    | {
        id: number;
        name: string;
        email: string;
        company: string | null;
        access_code: string;
      }
    | undefined;

  return result || null;
}
