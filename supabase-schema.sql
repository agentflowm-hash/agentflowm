-- ═══════════════════════════════════════════════════════════════
-- AGENTFLOW SUPABASE SCHEMA
-- Migriert von SQLite zu PostgreSQL
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════
--                    LEADS / KONTAKTANFRAGEN
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  source TEXT NOT NULL DEFAULT 'website',
  package_interest TEXT,
  message TEXT,
  budget TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contacted_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
--                    WEBSITE-CHECKS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS website_checks (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  email TEXT,
  score_overall INTEGER,
  score_security INTEGER,
  score_seo INTEGER,
  score_accessibility INTEGER,
  score_performance INTEGER,
  score_structure INTEGER,
  load_time INTEGER,
  https_enabled BOOLEAN,
  result_json JSONB,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    REFERRALS / EMPFEHLUNGEN
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT NOT NULL,
  referrer_phone TEXT,
  referrer_telegram TEXT,
  referrer_chat_id BIGINT,
  referred_name TEXT NOT NULL,
  referred_email TEXT,
  referred_phone TEXT,
  referred_company TEXT,
  context TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  converted_lead_id INTEGER REFERENCES leads(id),
  commission_status TEXT DEFAULT 'pending',
  commission_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    NEWSLETTER SUBSCRIBERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  topics TEXT,
  frequency TEXT DEFAULT 'weekly',
  status TEXT NOT NULL DEFAULT 'pending',
  confirm_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL CLIENTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  access_code TEXT UNIQUE,
  lead_id INTEGER REFERENCES leads(id),
  status TEXT NOT NULL DEFAULT 'active',
  telegram_username TEXT,
  telegram_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
--                    LOGIN CODES (Telegram Auth)
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS login_codes (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  telegram_id BIGINT NOT NULL,
  telegram_username TEXT NOT NULL,
  first_name TEXT,
  chat_id BIGINT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL SESSIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_sessions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL PROJECTS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_projects (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES portal_clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  package TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  status_label TEXT,
  progress INTEGER DEFAULT 0,
  start_date DATE,
  estimated_end DATE,
  manager TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    INDEXES für Performance
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_telegram ON referrals(referrer_telegram);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_portal_clients_telegram ON portal_clients(telegram_username);
CREATE INDEX IF NOT EXISTS idx_login_codes_code ON login_codes(code);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON portal_sessions(token);

-- ═══════════════════════════════════════════════════════════════
--                    ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_projects ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Service role full access on website_checks" ON website_checks FOR ALL USING (true);
CREATE POLICY "Service role full access on referrals" ON referrals FOR ALL USING (true);
CREATE POLICY "Service role full access on subscribers" ON subscribers FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_clients" ON portal_clients FOR ALL USING (true);
CREATE POLICY "Service role full access on login_codes" ON login_codes FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_sessions" ON portal_sessions FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_projects" ON portal_projects FOR ALL USING (true);

-- ═══════════════════════════════════════════════════════════════
--                    AUTO-UPDATE TIMESTAMPS
-- ═══════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER portal_projects_updated_at BEFORE UPDATE ON portal_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
