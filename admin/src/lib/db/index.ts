import { supabaseAdmin } from '../supabase';

// ═══════════════════════════════════════════════════════════════
//                    DATABASE CONNECTION
// Supabase client for Admin Portal
// ═══════════════════════════════════════════════════════════════

export const db = supabaseAdmin;

// Type definitions
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  package_interest?: string;
  message?: string;
  budget?: string;
  status: string;
  priority?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  contacted_at?: string;
}

export interface WebsiteCheck {
  id: number;
  url: string;
  email?: string;
  score_overall?: number;
  score_security?: number;
  score_seo?: number;
  score_accessibility?: number;
  score_performance?: number;
  score_structure?: number;
  load_time?: number;
  https_enabled?: boolean;
  result_json?: string;
  ip_hash?: string;
  user_agent?: string;
  created_at: string;
}

export interface Referral {
  id: number;
  referrer_name: string;
  referrer_email?: string;
  referrer_phone?: string;
  referrer_telegram?: string;
  referrer_chat_id?: number;
  referred_name: string;
  referred_email?: string;
  referred_phone?: string;
  referred_company?: string;
  context?: string;
  notes?: string;
  status: string;
  converted_lead_id?: number;
  commission_status?: string;
  commission_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  topics?: string;
  frequency?: string;
  status: string;
  confirm_token?: string;
  created_at: string;
  confirmed_at?: string;
  unsubscribed_at?: string;
}

export interface PortalClient {
  id: number;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  telegram_username?: string;
  telegram_id?: number;
  access_code: string;
  status: string;
  last_login?: string;
  created_at: string;
}

export interface PortalProject {
  id: number;
  client_id: number;
  name: string;
  package?: string;
  status: string;
  status_label?: string;
  progress: number;
  manager?: string;
  start_date?: string;
  deadline?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PortalMilestone {
  id: number;
  project_id: number;
  title: string;
  status: string;
  due_date?: string;
  completed_at?: string;
  sort_order: number;
  created_at: string;
}

export interface PortalMessage {
  id: number;
  project_id: number;
  sender_type: string;
  sender_name?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface PortalFile {
  id: number;
  project_id: number;
  name: string;
  url: string;
  type?: string;
  size?: number;
  uploaded_by?: string;
  created_at: string;
}
