import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking Supabase Connection...\n');
  console.log('URL:', supabaseUrl);
  
  const tables = [
    'leads',
    'website_checks', 
    'referrals',
    'subscribers',
    'portal_clients',
    'portal_sessions',
    'portal_projects',
    'portal_milestones',
    'portal_messages',
    'portal_files',
    'portal_approvals',
    'login_codes',
    'rate_limits'
  ];
  
  console.log('\n📊 Checking Tables:\n');
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: exists (${count || 0} rows)`);
      }
    } catch (e) {
      console.log(`❌ ${table}: ${e.message}`);
    }
  }
}

checkTables();
