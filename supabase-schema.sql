-- ═══════════════════════════════════════════════════════════════
-- AGENTFLOW SUPABASE SCHEMA - COMPLETE VERSION
-- Alle Tabellen für Admin & Kunden Portal
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
  manager TEXT DEFAULT 'Mo Sul',
  description TEXT,
  preview_url TEXT,
  preview_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL MILESTONES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL MESSAGES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL DEFAULT 'admin',
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL FILES
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_files (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT,
  storage_path TEXT,
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    PORTAL APPROVALS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS portal_approvals (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES portal_projects(id) ON DELETE CASCADE,
  milestone_id INTEGER REFERENCES portal_milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'design',
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    RATE LIMITS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS rate_limits (
  id SERIAL PRIMARY KEY,
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
--                    INDEXES für Performance
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_telegram ON referrals(referrer_telegram);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);

CREATE INDEX IF NOT EXISTS idx_portal_clients_email ON portal_clients(email);
CREATE INDEX IF NOT EXISTS idx_portal_clients_telegram ON portal_clients(telegram_username);
CREATE INDEX IF NOT EXISTS idx_portal_clients_access_code ON portal_clients(access_code);

CREATE INDEX IF NOT EXISTS idx_login_codes_code ON login_codes(code);
CREATE INDEX IF NOT EXISTS idx_login_codes_telegram ON login_codes(telegram_id);

CREATE INDEX IF NOT EXISTS idx_portal_sessions_token ON portal_sessions(token);
CREATE INDEX IF NOT EXISTS idx_portal_sessions_client ON portal_sessions(client_id);

CREATE INDEX IF NOT EXISTS idx_portal_projects_client ON portal_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_portal_projects_status ON portal_projects(status);

CREATE INDEX IF NOT EXISTS idx_portal_milestones_project ON portal_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_portal_messages_project ON portal_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_portal_files_project ON portal_files(project_id);
CREATE INDEX IF NOT EXISTS idx_portal_approvals_project ON portal_approvals(project_id);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier, endpoint);

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
ALTER TABLE portal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role policies (full access)
CREATE POLICY "Service role full access on leads" ON leads FOR ALL USING (true);
CREATE POLICY "Service role full access on website_checks" ON website_checks FOR ALL USING (true);
CREATE POLICY "Service role full access on referrals" ON referrals FOR ALL USING (true);
CREATE POLICY "Service role full access on subscribers" ON subscribers FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_clients" ON portal_clients FOR ALL USING (true);
CREATE POLICY "Service role full access on login_codes" ON login_codes FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_sessions" ON portal_sessions FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_projects" ON portal_projects FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_milestones" ON portal_milestones FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_messages" ON portal_messages FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_files" ON portal_files FOR ALL USING (true);
CREATE POLICY "Service role full access on portal_approvals" ON portal_approvals FOR ALL USING (true);
CREATE POLICY "Service role full access on rate_limits" ON rate_limits FOR ALL USING (true);

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

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS referrals_updated_at ON referrals;
CREATE TRIGGER referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS portal_projects_updated_at ON portal_projects;
CREATE TRIGGER portal_projects_updated_at BEFORE UPDATE ON portal_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ═══════════════════════════════════════════════════════════════
--                    DEMO DATA (OPTIONAL)
-- ═══════════════════════════════════════════════════════════════

-- Demo Client für Portal Testing
INSERT INTO portal_clients (name, email, company, access_code, status)
VALUES ('Demo Kunde', 'demo@example.com', 'Demo GmbH', 'DEMO2024', 'active')
ON CONFLICT (access_code) DO NOTHING;

-- Demo Project
INSERT INTO portal_projects (client_id, name, package, status, status_label, progress, start_date, estimated_end, manager, description)
SELECT 
  id,
  'Demo Website Projekt',
  'Business Paket',
  'development',
  'In Entwicklung',
  45,
  CURRENT_DATE - INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '30 days',
  'Mo Sul',
  'Demo-Projekt zum Testen des Kundenportals'
FROM portal_clients WHERE access_code = 'DEMO2024'
ON CONFLICT DO NOTHING;

-- Demo Milestones
INSERT INTO portal_milestones (project_id, title, status, date, sort_order)
SELECT 
  p.id,
  m.title,
  m.status,
  m.date,
  m.sort_order
FROM portal_projects p
CROSS JOIN (
  VALUES 
    ('Kickoff Meeting', 'done', CURRENT_DATE - INTERVAL '14 days', 1),
    ('Design Entwurf', 'done', CURRENT_DATE - INTERVAL '7 days', 2),
    ('Entwicklung', 'current', NULL, 3),
    ('Testing & QA', 'pending', NULL, 4),
    ('Go-Live', 'pending', CURRENT_DATE + INTERVAL '30 days', 5)
) AS m(title, status, date, sort_order)
WHERE p.name = 'Demo Website Projekt'
ON CONFLICT DO NOTHING;

-- Demo Messages
INSERT INTO portal_messages (project_id, sender_type, sender_name, message, is_read)
SELECT 
  p.id,
  m.sender_type,
  m.sender_name,
  m.message,
  m.is_read
FROM portal_projects p
CROSS JOIN (
  VALUES 
    ('admin', 'Mo Sul', 'Willkommen im Kundenportal! Hier können Sie den Fortschritt Ihres Projekts verfolgen.', 1),
    ('admin', 'Mo Sul', 'Der erste Design-Entwurf ist fertig. Schauen Sie mal unter Dateien!', 0)
) AS m(sender_type, sender_name, message, is_read)
WHERE p.name = 'Demo Website Projekt'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
--                    SCHEMA VERSION
-- ═══════════════════════════════════════════════════════════════

COMMENT ON DATABASE postgres IS 'AgentFlowM Schema v2.0 - Complete Portal & Admin System';
