import { createClient } from '@supabase/supabase-js';

// ═══════════════════════════════════════════════════════════════
//                    SUPABASE CLIENT
// Zentrale Supabase-Verbindung für alle Apps
// ═══════════════════════════════════════════════════════════════

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client für Browser (mit anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin Client für Server-Side (mit service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Type definitions
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  package_interest: string | null;
  message: string | null;
  budget: string | null;
  status: string;
  priority: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  contacted_at: string | null;
}

export interface WebsiteCheck {
  id: number;
  url: string;
  email: string | null;
  score_overall: number | null;
  score_security: number | null;
  score_seo: number | null;
  score_accessibility: number | null;
  score_performance: number | null;
  score_structure: number | null;
  load_time: number | null;
  https_enabled: boolean | null;
  result_json: any;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Referral {
  id: number;
  referrer_name: string;
  referrer_email: string;
  referrer_phone: string | null;
  referrer_telegram: string | null;
  referrer_chat_id: number | null;
  referred_name: string;
  referred_email: string | null;
  referred_phone: string | null;
  referred_company: string | null;
  context: string | null;
  notes: string | null;
  status: 'pending' | 'contacted' | 'converted' | 'rejected';
  converted_lead_id: number | null;
  commission_status: 'pending' | 'approved' | 'paid';
  commission_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface Subscriber {
  id: number;
  email: string;
  name: string | null;
  topics: string | null;
  frequency: string;
  status: string;
  confirm_token: string | null;
  created_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
}

export interface PortalClient {
  id: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  access_code: string | null;
  lead_id: number | null;
  status: string;
  telegram_username: string | null;
  telegram_id: number | null;
  created_at: string;
  last_login: string | null;
}

export interface LoginCode {
  id: number;
  code: string;
  telegram_id: number;
  telegram_username: string;
  first_name: string | null;
  chat_id: number;
  used: boolean;
  created_at: string;
  expires_at: string;
}

export interface PortalSession {
  id: number;
  client_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface PortalProject {
  id: number;
  client_id: number;
  name: string;
  package: string | null;
  status: string;
  status_label: string | null;
  progress: number;
  start_date: string | null;
  estimated_end: string | null;
  manager: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
