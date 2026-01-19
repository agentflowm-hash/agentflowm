import { supabaseAdmin } from "../supabase";
import crypto from "crypto";

// ═══════════════════════════════════════════════════════════════
//                    DATABASE CLIENT
// Supabase client for Portal
// ═══════════════════════════════════════════════════════════════

const db = supabaseAdmin;

// ═══════════════════════════════════════════════════════════════
//                    TYPE DEFINITIONS
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
  deadline: string | null;
  manager: string;
  description: string | null;
  preview_url?: string | null;
  preview_enabled?: number;
  created_at: string;
  updated_at: string;
}

export interface PortalMilestone {
  id: number;
  project_id: number;
  title: string;
  status: string;
  due_date: string | null;
  sort_order: number;
  completed_at?: string | null;
  created_at: string;
}

export interface PortalMessage {
  id: number;
  project_id: number;
  sender_type: string;
  sender_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PortalFile {
  id: number;
  project_id: number;
  name: string;
  url: string;
  type: string | null;
  size: number | null;
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

// Validate access code and return client
export async function validateAccessCode(
  code: string
): Promise<PortalClient | null> {
  const normalizedCode = code.toUpperCase().replace(/\s/g, "");

  const { data: client, error } = await db
    .from("portal_clients")
    .select("*")
    .eq("access_code", normalizedCode)
    .eq("status", "active")
    .single();

  if (error || !client) return null;
  return client as PortalClient;
}

// Create session for client
export async function createSession(clientId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Delete old sessions for this client
  await db.from("portal_sessions").delete().eq("client_id", clientId);

  // Create new session
  await db.from("portal_sessions").insert({
    client_id: clientId,
    token,
    expires_at: expiresAt,
  });

  // Update last login
  await db
    .from("portal_clients")
    .update({ last_login: new Date().toISOString() })
    .eq("id", clientId);

  return token;
}

// Validate session token
export async function validateSession(
  token: string
): Promise<PortalClient | null> {
  const { data: session, error } = await db
    .from("portal_sessions")
    .select("client_id, expires_at")
    .eq("token", token)
    .single();

  if (error || !session) return null;

  // Check if session is expired
  if (new Date(session.expires_at) < new Date()) {
    await db.from("portal_sessions").delete().eq("token", token);
    return null;
  }

  // Get client
  const { data: client } = await db
    .from("portal_clients")
    .select("*")
    .eq("id", session.client_id)
    .single();

  return client as PortalClient | null;
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<void> {
  await db.from("portal_sessions").delete().eq("token", token);
}

// ═══════════════════════════════════════════════════════════════
//                    DATA FUNCTIONS
// ═══════════════════════════════════════════════════════════════

export async function getClientProject(
  clientId: number
): Promise<PortalProject | null> {
  const { data: project } = await db
    .from("portal_projects")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return project as PortalProject | null;
}

export async function getProjectMilestones(
  projectId: number
): Promise<PortalMilestone[]> {
  const { data: milestones } = await db
    .from("portal_milestones")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  return (milestones || []) as PortalMilestone[];
}

export async function getProjectMessages(
  projectId: number
): Promise<PortalMessage[]> {
  const { data: messages } = await db
    .from("portal_messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return (messages || []) as PortalMessage[];
}

export async function getProjectFiles(projectId: number): Promise<PortalFile[]> {
  const { data: files } = await db
    .from("portal_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return (files || []) as PortalFile[];
}

export async function getUnreadMessageCount(projectId: number): Promise<number> {
  const { count } = await db
    .from("portal_messages")
    .select("*", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("is_read", false)
    .eq("sender_type", "admin");

  return count || 0;
}

export async function getProjectApprovals(
  projectId: number
): Promise<PortalApproval[]> {
  const { data: approvals } = await db
    .from("portal_approvals")
    .select(
      `
      *,
      portal_milestones (
        title
      )
    `
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  return (approvals || []).map((a: any) => ({
    ...a,
    milestone_title: a.portal_milestones?.title || null,
    portal_milestones: undefined,
  })) as PortalApproval[];
}

export async function addMessage(
  projectId: number,
  senderType: string,
  senderName: string,
  message: string
): Promise<PortalMessage> {
  const { data, error } = await db
    .from("portal_messages")
    .insert({
      project_id: projectId,
      sender_type: senderType,
      sender_name: senderName,
      message,
      is_read: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PortalMessage;
}

export async function markMessagesAsRead(projectId: number): Promise<void> {
  await db
    .from("portal_messages")
    .update({ is_read: true })
    .eq("project_id", projectId)
    .eq("sender_type", "admin");
}

export async function addFile(
  projectId: number,
  name: string,
  url: string,
  size: number,
  mimeType: string,
  uploadedBy: string
): Promise<PortalFile> {
  const { data, error } = await db
    .from("portal_files")
    .insert({
      project_id: projectId,
      name,
      url,
      size,
      type: mimeType,
      uploaded_by: uploadedBy,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PortalFile;
}

export async function updateApprovalStatus(
  approvalId: number,
  status: string,
  approvedBy: string | null,
  feedback: string | null
): Promise<void> {
  const updateData: any = { status };

  if (status === "approved") {
    updateData.approved_at = new Date().toISOString();
    updateData.approved_by = approvedBy;
  }

  if (feedback) {
    updateData.feedback = feedback;
  }

  await db.from("portal_approvals").update(updateData).eq("id", approvalId);
}

// ═══════════════════════════════════════════════════════════════
//                    HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

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
