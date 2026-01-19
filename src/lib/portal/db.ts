import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Database path - shared with main app
// Portal runs from /portal folder, so we need to go up one level to reach /data
// This works whether started from portal/ or from project root
function getDbPath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const cwd = process.cwd();
  // If running from portal folder, go up to parent
  if (cwd.endsWith("/portal") || cwd.endsWith("\\portal")) {
    return path.join(cwd, "..", "data", "agentflow.db");
  }
  // If running from project root (e.g., npm run dev from root)
  return path.join(cwd, "data", "agentflow.db");
}
const DB_PATH = getDbPath();

let sqliteInstance: Database.Database | null = null;

function getSqlite(): Database.Database {
  if (!sqliteInstance) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    sqliteInstance = new Database(DB_PATH);
    sqliteInstance.pragma("journal_mode = WAL");
    sqliteInstance.pragma("foreign_keys = ON");

    // Initialize tables if needed
    initializeTables(sqliteInstance);
  }
  return sqliteInstance;
}

function initializeTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS portal_clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      phone TEXT,
      telegram_username TEXT,
      telegram_id INTEGER,
      access_code TEXT NOT NULL UNIQUE,
      lead_id INTEGER,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_login TEXT
    );

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

    CREATE TABLE IF NOT EXISTS portal_milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      date TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS portal_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL REFERENCES portal_projects(id),
      sender_type TEXT NOT NULL DEFAULT 'admin',
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

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

    CREATE TABLE IF NOT EXISTS portal_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL REFERENCES portal_clients(id),
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_portal_clients_code ON portal_clients(access_code);
    CREATE INDEX IF NOT EXISTS idx_portal_clients_telegram ON portal_clients(telegram_username);
    CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON portal_sessions(token);
  `);

  // Migration: Add telegram columns if they don't exist
  try {
    db.exec(`ALTER TABLE portal_clients ADD COLUMN telegram_username TEXT`);
  } catch {
    // Column already exists
  }
  try {
    db.exec(`ALTER TABLE portal_clients ADD COLUMN telegram_id INTEGER`);
  } catch {
    // Column already exists
  }

  // Seed demo data only in development when explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SEED_DEMO_DATA === "true"
  ) {
    const existing = db.prepare("SELECT id FROM portal_clients LIMIT 1").get();
    if (!existing) {
      seedDemoData(db);
    }
  }
}

function seedDemoData(db: Database.Database) {
  console.log("Seeding portal demo data...");

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
    const result = db
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

    const projectResult = db
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
      db.prepare(
        `INSERT INTO portal_milestones (project_id, title, status, date, sort_order) VALUES (?, ?, ?, ?, ?)`,
      ).run(projectId, m.title, m.status, m.date, m.sort);
    }

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
      db.prepare(
        `INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read) VALUES (?, ?, ?, ?, ?)`,
      ).run(
        projectId,
        msg.sender_type,
        msg.sender_name,
        msg.message,
        msg.is_read,
      );
    }

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
      db.prepare(
        `INSERT INTO portal_files (project_id, name, original_name, size, mime_type) VALUES (?, ?, ?, ?, ?)`,
      ).run(
        projectId,
        file.name,
        file.original_name,
        file.size,
        file.mime_type,
      );
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//                    AUTH FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export interface PortalClient {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  telegram_username: string | null;
  telegram_id: number | null;
  access_code: string;
  status: string;
  created_at: string;
  last_login: string | null;
}

export interface PortalProject {
  id: number;
  client_id: number;
  name: string;
  package: string;
  status: string;
  status_label: string;
  progress: number;
  start_date: string | null;
  estimated_end: string | null;
  manager: string;
  description: string | null;
}

export interface PortalMilestone {
  id: number;
  project_id: number;
  title: string;
  status: string;
  date: string | null;
  sort_order: number;
}

export interface PortalMessage {
  id: number;
  project_id: number;
  sender_type: string;
  sender_name: string;
  message: string;
  is_read: number;
  created_at: string;
}

export interface PortalFile {
  id: number;
  project_id: number;
  name: string;
  original_name: string;
  size: number;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
}

// Validate access code and return client
export function validateAccessCode(code: string): PortalClient | null {
  const db = getSqlite();
  const normalizedCode = code.toUpperCase().replace(/\s/g, "");

  const client = db
    .prepare(
      `
    SELECT * FROM portal_clients WHERE access_code = ? AND status = 'active'
  `,
    )
    .get(normalizedCode) as PortalClient | undefined;

  return client || null;
}

// Create session for client
export function createSession(clientId: number): string {
  const db = getSqlite();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Delete old sessions for this client
  db.prepare("DELETE FROM portal_sessions WHERE client_id = ?").run(clientId);

  // Create new session
  db.prepare(
    `
    INSERT INTO portal_sessions (client_id, token, expires_at)
    VALUES (?, ?, ?)
  `,
  ).run(clientId, token, expiresAt);

  // Update last login
  db.prepare(
    `UPDATE portal_clients SET last_login = datetime('now') WHERE id = ?`,
  ).run(clientId);

  return token;
}

// Validate session token
export function validateSession(token: string): PortalClient | null {
  const db = getSqlite();

  const session = db
    .prepare(
      `
    SELECT c.* FROM portal_sessions s
    JOIN portal_clients c ON c.id = s.client_id
    WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
  `,
    )
    .get(token) as PortalClient | undefined;

  return session || null;
}

// Delete session (logout)
export function deleteSession(token: string): void {
  const db = getSqlite();
  db.prepare("DELETE FROM portal_sessions WHERE token = ?").run(token);
}

// ═══════════════════════════════════════════════════════════════
//                    DATA FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function getClientProject(clientId: number): PortalProject | null {
  const db = getSqlite();
  const project = db
    .prepare(
      `
    SELECT * FROM portal_projects WHERE client_id = ? ORDER BY created_at DESC LIMIT 1
  `,
    )
    .get(clientId) as PortalProject | undefined;
  return project || null;
}

export function getProjectMilestones(projectId: number): PortalMilestone[] {
  const db = getSqlite();
  return db
    .prepare(
      `
    SELECT * FROM portal_milestones WHERE project_id = ? ORDER BY sort_order ASC
  `,
    )
    .all(projectId) as PortalMilestone[];
}

export function getProjectMessages(projectId: number): PortalMessage[] {
  const db = getSqlite();
  return db
    .prepare(
      `
    SELECT * FROM portal_messages WHERE project_id = ? ORDER BY created_at DESC
  `,
    )
    .all(projectId) as PortalMessage[];
}

export function getProjectFiles(projectId: number): PortalFile[] {
  const db = getSqlite();
  return db
    .prepare(
      `
    SELECT * FROM portal_files WHERE project_id = ? ORDER BY created_at DESC
  `,
    )
    .all(projectId) as PortalFile[];
}

export function getUnreadMessageCount(projectId: number): number {
  const db = getSqlite();
  const result = db
    .prepare(
      `
    SELECT COUNT(*) as count FROM portal_messages
    WHERE project_id = ? AND is_read = 0 AND sender_type = 'admin'
  `,
    )
    .get(projectId) as { count: number };
  return result.count;
}

export function addMessage(
  projectId: number,
  senderType: string,
  senderName: string,
  message: string,
): PortalMessage {
  const db = getSqlite();
  const result = db
    .prepare(
      `
    INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
    VALUES (?, ?, ?, ?, ?)
  `,
    )
    .run(projectId, senderType, senderName, message, 0); // is_read = 0 für neue Nachrichten

  return db
    .prepare("SELECT * FROM portal_messages WHERE id = ?")
    .get(result.lastInsertRowid) as PortalMessage;
}

export function markMessagesAsRead(projectId: number): void {
  const db = getSqlite();
  db.prepare(
    `
    UPDATE portal_messages SET is_read = 1 WHERE project_id = ? AND sender_type = 'admin'
  `,
  ).run(projectId);
}

export function addFile(
  projectId: number,
  name: string,
  originalName: string,
  size: number,
  mimeType: string,
  uploadedBy: string,
): PortalFile {
  const db = getSqlite();
  const result = db
    .prepare(
      `
    INSERT INTO portal_files (project_id, name, original_name, size, mime_type, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    )
    .run(projectId, name, originalName, size, mimeType, uploadedBy);

  return db
    .prepare("SELECT * FROM portal_files WHERE id = ?")
    .get(result.lastInsertRowid) as PortalFile;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE");
  } catch {
    return dateStr;
  }
}
