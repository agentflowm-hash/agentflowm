import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-initialized Supabase instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

// Client für Browser (mit anon key) - LAZY
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase environment variables not configured');
      }
      
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return (supabaseInstance as any)[prop];
  }
});

// Admin Client für Server-Side (mit service role key) - LAZY
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!supabaseAdminInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL not configured');
      }
      
      supabaseAdminInstance = createClient(
        supabaseUrl,
        supabaseServiceKey || supabaseAnonKey || '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      );
    }
    return (supabaseAdminInstance as any)[prop];
  }
});
