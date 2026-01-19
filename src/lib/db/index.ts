import { supabaseAdmin } from '../supabase';
import * as schema from './schema';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
//                    SUPABASE DATABASE WRAPPER
// Ersetzt SQLite mit Supabase
// ═══════════════════════════════════════════════════════════════

// Re-export schema
export { schema };

// Initialize (no-op for Supabase - tables are created via migrations)
export function initializeDatabase() {
  console.log('Using Supabase database');
}

// Legacy function for compatibility
export function getSqliteDb() {
  console.warn('getSqliteDb() is deprecated - use supabaseAdmin directly');
  return null;
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export function hashIP(ip: string): string {
  const salt = process.env.IP_SALT || 'agentflow-salt';
  return crypto
    .createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .substring(0, 16);
}

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  maxRequests: number = 10,
  windowMinutes: number = 60
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  // Simple rate limiting via Supabase
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  // Count requests in window
  const { count } = await supabaseAdmin
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart);

  const currentCount = count || 0;
  const allowed = currentCount < maxRequests;

  if (allowed) {
    await supabaseAdmin.from('rate_limits').insert({
      identifier,
      endpoint,
      request_count: 1,
      window_start: new Date().toISOString()
    });
  }

  return {
    allowed,
    remaining: Math.max(0, maxRequests - currentCount - 1),
    resetAt: new Date(Date.now() + windowMinutes * 60 * 1000)
  };
}

// ═══════════════════════════════════════════════════════════════
//                    PORTAL CLIENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function generateAccessCode(name: string): string {
  const prefix = name.split(' ')[0].toUpperCase().slice(0, 4);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}

export async function getPortalClientByTelegram(telegramUsername: string): Promise<{
  id: number;
  name: string;
  email: string;
  company: string | null;
  telegram_username: string | null;
  telegram_id: number | null;
  access_code: string;
} | null> {
  const cleanUsername = telegramUsername.toLowerCase().replace('@', '');

  const { data } = await supabaseAdmin
    .from('portal_clients')
    .select('id, name, email, company, telegram_username, telegram_id, access_code')
    .or(`telegram_username.ilike.${cleanUsername},email.ilike.telegram:${cleanUsername}`)
    .single();

  return data || null;
}

export async function createPortalClient(data: {
  name: string;
  telegramUsername: string;
  firstName?: string;
  telegramId?: number;
}): Promise<{ clientId: number; accessCode: string; projectId: number }> {
  // Check if exists
  const existing = await getPortalClientByTelegram(data.telegramUsername);
  if (existing) {
    const { data: project } = await supabaseAdmin
      .from('portal_projects')
      .select('id')
      .eq('client_id', existing.id)
      .limit(1)
      .single();

    return {
      clientId: existing.id,
      accessCode: existing.access_code,
      projectId: project?.id || 0
    };
  }

  // Generate unique access code
  const accessCode = generateAccessCode(data.firstName || data.name);

  // Create client
  const { data: newClient, error } = await supabaseAdmin
    .from('portal_clients')
    .insert({
      name: data.firstName || data.name,
      email: '',
      company: null,
      telegram_username: data.telegramUsername.toLowerCase().replace('@', ''),
      telegram_id: data.telegramId || null,
      access_code: accessCode,
      status: 'active'
    })
    .select()
    .single();

  if (error) throw error;

  // Create default project
  const { data: project } = await supabaseAdmin
    .from('portal_projects')
    .insert({
      client_id: newClient.id,
      name: `Projekt ${data.firstName || data.name}`,
      package: 'Starter',
      status: 'neu',
      status_label: 'Neu angelegt',
      progress: 0,
      manager: 'Alex Shaer'
    })
    .select()
    .single();

  // Add welcome message
  if (project) {
    await supabaseAdmin.from('portal_messages').insert({
      project_id: project.id,
      sender_type: 'admin',
      sender_name: 'AgentFlow Team',
      message: 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen und direkt mit uns kommunizieren.',
      is_read: false
    });
  }

  console.log(`Portal client created: ${data.telegramUsername} -> ${accessCode}`);

  return {
    clientId: newClient.id,
    accessCode,
    projectId: project?.id || 0
  };
}

export async function getPortalClientByCode(accessCode: string): Promise<{
  id: number;
  name: string;
  email: string;
  company: string | null;
  access_code: string;
} | null> {
  const { data } = await supabaseAdmin
    .from('portal_clients')
    .select('id, name, email, company, access_code')
    .eq('access_code', accessCode.toUpperCase().replace(/\s/g, ''))
    .eq('status', 'active')
    .single();

  return data || null;
}

// ═══════════════════════════════════════════════════════════════
//                    LEGACY COMPATIBILITY LAYER
// Provides a db-like interface for gradual migration
// ═══════════════════════════════════════════════════════════════

// Re-export supabaseAdmin as db for compatibility
export const db = supabaseAdmin;

// Re-export supabaseAdmin for direct queries
export { supabaseAdmin };
