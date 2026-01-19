import { supabaseAdmin, PortalClient, LoginCode, Referral, PortalProject, PortalSession } from './supabase';

// ═══════════════════════════════════════════════════════════════
//                    SUPABASE DATABASE
// Zentrale Datenbank-Funktionen für alle Apps
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
//                    LOGIN CODES
// ═══════════════════════════════════════════════════════════════

// Generiere 6-stelligen Code
export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Speichere Login-Code in DB
export async function saveLoginCode(data: {
  code: string;
  telegramId: number;
  telegramUsername: string;
  firstName?: string;
  chatId: number;
}): Promise<boolean> {
  // Lösche alte Codes für diesen User
  await supabaseAdmin
    .from('login_codes')
    .delete()
    .or(`telegram_username.ilike.${data.telegramUsername.toLowerCase()},expires_at.lt.${new Date().toISOString()}`);

  // Neuer Code - 5 Minuten gültig
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin
    .from('login_codes')
    .insert({
      code: data.code,
      telegram_id: data.telegramId,
      telegram_username: data.telegramUsername.toLowerCase(),
      first_name: data.firstName || null,
      chat_id: data.chatId,
      expires_at: expiresAt
    });

  if (error) {
    console.error('Failed to save login code:', error);
    return false;
  }
  return true;
}

// Verifiziere Login-Code
export async function verifyLoginCode(code: string): Promise<LoginCode | null> {
  const { data: loginCode, error } = await supabaseAdmin
    .from('login_codes')
    .select('*')
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !loginCode) return null;

  // Markiere als verwendet
  await supabaseAdmin
    .from('login_codes')
    .update({ used: true })
    .eq('id', loginCode.id);

  return loginCode as LoginCode;
}

// ═══════════════════════════════════════════════════════════════
//                    PORTAL CLIENTS
// ═══════════════════════════════════════════════════════════════

// Finde Client by Telegram Username
export async function getClientByTelegram(username: string): Promise<PortalClient | null> {
  const { data, error } = await supabaseAdmin
    .from('portal_clients')
    .select('*')
    .ilike('telegram_username', username.toLowerCase())
    .single();

  if (error || !data) return null;
  return data as PortalClient;
}

// Erstelle oder update Client mit Telegram
export async function upsertClientByTelegram(data: {
  telegramUsername: string;
  telegramId: number;
  firstName: string;
}): Promise<PortalClient> {
  // Prüfe ob existiert
  let client = await getClientByTelegram(data.telegramUsername);

  if (client) {
    // Update telegram_id und last_login
    await supabaseAdmin
      .from('portal_clients')
      .update({
        telegram_id: data.telegramId,
        last_login: new Date().toISOString()
      })
      .eq('id', client.id);

    return (await getClientByTelegram(data.telegramUsername))!;
  }

  // Erstelle neuen Client
  const accessCode = generateAccessCode(data.firstName);

  const { data: newClient, error } = await supabaseAdmin
    .from('portal_clients')
    .insert({
      name: data.firstName,
      email: `${data.telegramUsername.toLowerCase()}@telegram.user`,
      access_code: accessCode,
      telegram_username: data.telegramUsername.toLowerCase(),
      telegram_id: data.telegramId,
      last_login: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return newClient as PortalClient;
}

// Generiere Access Code für Portal im Format XXXX-0000
function generateAccessCode(name?: string): string {
  let prefix = 'USER';
  if (name && name.length >= 2) {
    prefix = name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    if (prefix.length < 4) {
      prefix = prefix.padEnd(4, 'X');
    }
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
}

// ═══════════════════════════════════════════════════════════════
//                    PORTAL SESSIONS
// ═══════════════════════════════════════════════════════════════

// Erstelle Session
export async function createPortalSession(clientId: number): Promise<string> {
  const token = generateSessionToken();

  // Lösche alte Sessions
  await supabaseAdmin
    .from('portal_sessions')
    .delete()
    .eq('client_id', clientId);

  // Neue Session - 30 Tage gültig
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabaseAdmin
    .from('portal_sessions')
    .insert({
      client_id: clientId,
      token,
      expires_at: expiresAt
    });

  return token;
}

// Validiere Session
export async function validateSession(token: string): Promise<PortalClient | null> {
  const { data: session, error } = await supabaseAdmin
    .from('portal_sessions')
    .select('*, portal_clients(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) return null;

  const client = session.portal_clients as any;
  return {
    id: client.id,
    name: client.name,
    email: client.email,
    company: client.company,
    phone: client.phone,
    access_code: client.access_code,
    lead_id: client.lead_id,
    status: client.status,
    created_at: client.created_at,
    last_login: client.last_login,
    telegram_username: client.telegram_username,
    telegram_id: client.telegram_id
  };
}

function generateSessionToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// ═══════════════════════════════════════════════════════════════
//                    PORTAL PROJECTS
// ═══════════════════════════════════════════════════════════════

export async function getClientProjects(clientId: number): Promise<PortalProject[]> {
  const { data, error } = await supabaseAdmin
    .from('portal_projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as PortalProject[];
}

// ═══════════════════════════════════════════════════════════════
//                    REFERRALS (EMPFEHLUNGEN)
// ═══════════════════════════════════════════════════════════════

// Erstelle Empfehlung via Telegram
export async function createReferralFromTelegram(data: {
  referrerTelegram: string;
  referrerChatId: number;
  referrerName: string;
  referredName: string;
  referredPhone?: string;
  referredEmail?: string;
  referredCompany?: string;
  context?: string;
}): Promise<Referral> {
  const { data: referral, error } = await supabaseAdmin
    .from('referrals')
    .insert({
      referrer_name: data.referrerName,
      referrer_email: `${data.referrerTelegram.toLowerCase()}@telegram.user`,
      referrer_telegram: data.referrerTelegram.toLowerCase(),
      referrer_chat_id: data.referrerChatId,
      referred_name: data.referredName,
      referred_phone: data.referredPhone || null,
      referred_email: data.referredEmail || null,
      referred_company: data.referredCompany || null,
      context: data.context || null
    })
    .select()
    .single();

  if (error) throw error;
  return referral as Referral;
}

// Hole Empfehlungen eines Users
export async function getReferralsByTelegram(username: string): Promise<Referral[]> {
  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .ilike('referrer_telegram', username.toLowerCase())
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Referral[];
}

// Hole Empfehlung by ID
export async function getReferralById(id: number): Promise<Referral | null> {
  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Referral;
}

// Update Empfehlungs-Status
export async function updateReferralStatus(
  id: number,
  status: string,
  notes?: string
): Promise<boolean> {
  const update: any = { status };
  if (notes) update.notes = notes;

  const { error } = await supabaseAdmin
    .from('referrals')
    .update(update)
    .eq('id', id);

  return !error;
}

// Hole alle pending Empfehlungen (für Admin)
export async function getPendingReferrals(): Promise<Referral[]> {
  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as Referral[];
}

// Statistiken für einen Empfehler
export async function getReferralStats(username: string): Promise<{
  total: number;
  converted: number;
  pending: number;
  commission: number;
}> {
  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('status, commission_status, commission_amount')
    .ilike('referrer_telegram', username.toLowerCase());

  if (error || !data) {
    return { total: 0, converted: 0, pending: 0, commission: 0 };
  }

  return {
    total: data.length,
    converted: data.filter(r => r.status === 'converted').length,
    pending: data.filter(r => r.status === 'pending').length,
    commission: data
      .filter(r => r.commission_status === 'paid')
      .reduce((sum, r) => sum + (r.commission_amount || 0), 0)
  };
}

// Re-export types
export type { PortalClient, LoginCode, Referral, PortalProject, PortalSession };
