import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

// ═══════════════════════════════════════════════════════════════
//                    DATABASE CONNECTION
// Shared database with main app - path relative to project root
// ═══════════════════════════════════════════════════════════════

// Database path - shared with main app (one level up from admin folder)
// Admin runs from /admin folder, so we need to go up one level to reach /data
function getDbPath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const cwd = process.cwd();
  // If running from admin folder, go up to parent
  if (cwd.endsWith('/admin') || cwd.endsWith('\\admin')) {
    return path.join(cwd, '..', 'data', 'agentflow.db');
  }
  // If running from project root
  return path.join(cwd, 'data', 'agentflow.db');
}
const DB_PATH = getDbPath();

let sqliteInstance: Database.Database | null = null;
let drizzleDb: BetterSQLite3Database<typeof schema> | null = null;

function getSqlite(): Database.Database {
  if (!sqliteInstance) {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    sqliteInstance = new Database(DB_PATH);
    sqliteInstance.pragma('journal_mode = WAL');
    sqliteInstance.pragma('foreign_keys = ON');
  }
  return sqliteInstance;
}

function getDrizzle(): BetterSQLite3Database<typeof schema> {
  if (!drizzleDb) {
    drizzleDb = drizzle(getSqlite(), { schema });
  }
  return drizzleDb;
}

// Export database instance
export const db = {
  insert: <T extends Parameters<BetterSQLite3Database<typeof schema>['insert']>[0]>(table: T) => 
    getDrizzle().insert(table),
  select: () => getDrizzle().select(),
  update: <T extends Parameters<BetterSQLite3Database<typeof schema>['update']>[0]>(table: T) => 
    getDrizzle().update(table),
  delete: <T extends Parameters<BetterSQLite3Database<typeof schema>['delete']>[0]>(table: T) => 
    getDrizzle().delete(table),
};

export function getSqliteDb(): Database.Database {
  return getSqlite();
}

export { schema };
