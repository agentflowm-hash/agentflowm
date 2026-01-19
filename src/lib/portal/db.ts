import { supabaseAdmin } from '../supabase';
import crypto from 'crypto';

// ═══════════════════════════════════════════════════════════════
//                    PORTAL DATABASE (SUPABASE)
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
  preview_url?: string | null;
  preview_enabled?: number;
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
  is_read: number | boolean;
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

export interface PortalApproval {
  id: number;
  project_id: number;
  milestone_id: number | null;
  title: string;
  description: string | null;
  type: string;
  status: string;
  approved_at: string | null;
  approved_by: string | null;
  feedback: string | null;
  created_at: string;
  milestone_title?: string | null;
}

// ═══════════════════════════════════════════════════════════════
//                    AUTH FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function validateAccessCode(code: string): Promise<PortalClient | null> {
  const normalizedCode = code.toUpperCase().replace(/\s/g, '');

  const { data, error } = await supabaseAdmin
    .from('portal_clients')
    .select('*')
    .eq('access_code', normalizedCode)
    .eq('status', 'active')
    .single();

  if (error || !data) return null;
  return data as PortalClient;
}

export async function createSession(clientId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  // Delete old sessions
  await supabaseAdmin
    .from('portal_sessions')
    .delete()
    .eq('client_id', clientId);

  // Create new session
  await supabaseAdmin.from('portal_sessions').insert({
    client_id: clientId,
    token,
    expires_at: expiresAt
  });

  // Update last login
  await supabaseAdmin
    .from('portal_clients')
    .update({ last_login: new Date().toISOString() })
    .eq('id', clientId);

  return token;
}

export async function validateSession(token: string): Promise<PortalClient | null> {
  const { data: session, error } = await supabaseAdmin
    .from('portal_sessions')
    .select('*, portal_clients(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) return null;

  const client = session.portal_clients as any;
  return client as PortalClient;
}

export async function deleteSession(token: string): Promise<void> {
  await supabaseAdmin.from('portal_sessions').delete().eq('token', token);
}

// ═══════════════════════════════════════════════════════════════
//                    DATA FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getClientProject(clientId: number): Promise<PortalProject | null> {
  const { data, error } = await supabaseAdmin
    .from('portal_projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as PortalProject;
}

export async function getProjectMilestones(projectId: number): Promise<PortalMilestone[]> {
  const { data } = await supabaseAdmin
    .from('portal_milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('sort_order', { ascending: true });

  return (data || []) as PortalMilestone[];
}

export async function getProjectMessages(projectId: number): Promise<PortalMessage[]> {
  const { data } = await supabaseAdmin
    .from('portal_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return (data || []) as PortalMessage[];
}

export async function getProjectFiles(projectId: number): Promise<PortalFile[]> {
  const { data } = await supabaseAdmin
    .from('portal_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return (data || []) as PortalFile[];
}

export async function getUnreadMessageCount(projectId: number): Promise<number> {
  const { count } = await supabaseAdmin
    .from('portal_messages')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('is_read', false)
    .eq('sender_type', 'admin');

  return count || 0;
}

export async function getProjectApprovals(projectId: number): Promise<PortalApproval[]> {
  const { data } = await supabaseAdmin
    .from('portal_approvals')
    .select('*, portal_milestones(title)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  return (data || []).map((a: any) => ({
    ...a,
    milestone_title: a.portal_milestones?.title || null
  })) as PortalApproval[];
}

export async function addMessage(
  projectId: number,
  senderType: string,
  senderName: string,
  message: string
): Promise<PortalMessage> {
  const { data, error } = await supabaseAdmin
    .from('portal_messages')
    .insert({
      project_id: projectId,
      sender_type: senderType,
      sender_name: senderName,
      message,
      is_read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data as PortalMessage;
}

export async function markMessagesAsRead(projectId: number): Promise<void> {
  await supabaseAdmin
    .from('portal_messages')
    .update({ is_read: true })
    .eq('project_id', projectId)
    .eq('sender_type', 'admin');
}

export async function addFile(
  projectId: number,
  name: string,
  originalName: string,
  size: number,
  mimeType: string,
  uploadedBy: string
): Promise<PortalFile> {
  const { data, error } = await supabaseAdmin
    .from('portal_files')
    .insert({
      project_id: projectId,
      name,
      original_name: originalName,
      size,
      mime_type: mimeType,
      uploaded_by: uploadedBy
    })
    .select()
    .single();

  if (error) throw error;
  return data as PortalFile;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE');
  } catch {
    return dateStr;
  }
}
