-- AgentFlowM Premium System Upgrade — Alle neuen Tabellen
-- Ausführen in Supabase SQL Editor: https://supabase.com/dashboard

-- 1. Buchhaltung
CREATE TABLE IF NOT EXISTS accounting_transactions (
  id serial PRIMARY KEY,
  date date NOT NULL DEFAULT CURRENT_DATE,
  description text NOT NULL,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) NOT NULL DEFAULT 19,
  tax_amount numeric(12,2) NOT NULL DEFAULT 0,
  net_amount numeric(12,2) NOT NULL DEFAULT 0,
  account text DEFAULT 'Geschäftskonto',
  reference text,
  notes text,
  invoice_id integer,
  client_id integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE accounting_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_accounting ON accounting_transactions FOR ALL USING (true) WITH CHECK (true);

-- 2. Einstellungen
CREATE TABLE IF NOT EXISTS admin_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_settings ON admin_settings FOR ALL USING (true) WITH CHECK (true);

-- 3. Abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
  id serial PRIMARY KEY,
  client_id integer,
  client_name text NOT NULL,
  client_email text,
  plan text NOT NULL,
  description text,
  amount numeric(12,2) NOT NULL,
  tax_rate numeric(5,2) DEFAULT 19,
  interval text NOT NULL DEFAULT 'monthly' CHECK (interval IN ('monthly', 'quarterly', 'yearly')),
  next_billing date NOT NULL,
  last_billed date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_subs ON subscriptions FOR ALL USING (true) WITH CHECK (true);

-- 4. Projekt-Templates
CREATE TABLE IF NOT EXISTS project_templates (
  id serial PRIMARY KEY,
  name text NOT NULL,
  package text,
  description text,
  default_price numeric(12,2) DEFAULT 0,
  milestones jsonb DEFAULT '[]',
  services jsonb DEFAULT '[]',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE project_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_templates ON project_templates FOR ALL USING (true) WITH CHECK (true);

-- 5. Team-Mitglieder
CREATE TABLE IF NOT EXISTS team_members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member')),
  phone text,
  avatar_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_team ON team_members FOR ALL USING (true) WITH CHECK (true);

-- 6. Pipelines
CREATE TABLE IF NOT EXISTS pipelines (
  id serial PRIMARY KEY,
  name text NOT NULL,
  stages jsonb NOT NULL DEFAULT '[]',
  color text DEFAULT '#FC682C',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_pipelines ON pipelines FOR ALL USING (true) WITH CHECK (true);

-- Default Pipelines
INSERT INTO pipelines (name, stages, color, is_default) VALUES
  ('Website-Projekte', '[{"id":"new","label":"Neu"},{"id":"contacted","label":"Kontaktiert"},{"id":"qualified","label":"Qualifiziert"},{"id":"proposal","label":"Angebot"},{"id":"won","label":"Gewonnen"}]', '#FC682C', true),
  ('SEO-Kunden', '[{"id":"new","label":"Anfrage"},{"id":"audit","label":"SEO-Audit"},{"id":"proposal","label":"Angebot"},{"id":"active","label":"Aktiv"},{"id":"reporting","label":"Reporting"}]', '#6366F1', false),
  ('Wartungsverträge', '[{"id":"new","label":"Anfrage"},{"id":"proposal","label":"Angebot"},{"id":"active","label":"Aktiv"},{"id":"renewal","label":"Verlängerung"}]', '#10B981', false);

-- Default Projekt-Templates
INSERT INTO project_templates (name, package, default_price, milestones, services, is_default) VALUES
  ('Growth Website', 'Growth', 2000, '["Erstgespräch","Konzept & Design","Entwicklung","Content","Testing","Go-Live"]', '["Responsive Design","SEO-Optimierung","CMS-Integration","SSL & Hosting","30 Tage Support"]', true),
  ('Business Website', 'Business', 3500, '["Erstgespräch","Wireframes","UI Design","Frontend","Backend","Testing","Go-Live","Schulung"]', '["Premium Design","SEO-Optimierung","CMS","Blog","Kontaktformular","Analytics","SSL & Hosting","60 Tage Support"]', false),
  ('One-Page Website', 'Starter', 500, '["Erstgespräch","Design","Entwicklung","Go-Live"]', '["One-Page Design","Mobile-First","Kontaktformular","SSL"]', false),
  ('SEO-Paket', 'SEO', 800, '["Audit","Keyword-Analyse","On-Page","Off-Page","Reporting"]', '["SEO-Audit","Keyword-Recherche","On-Page Optimierung","Backlink-Aufbau","Monatliches Reporting"]', false);

-- Default Admin-Einstellungen
INSERT INTO admin_settings (key, value) VALUES
  ('company', '{"name":"AgentFlowMarketing","address":"Achillesstraße 69A, 13125 Berlin","email":"kontakt@agentflowm.de","phone":"+49 179 949 8247","taxId":"","iban":"DE89 3704 0044 0532 0130 00","bic":"COBADEFFXXX"}'),
  ('goals', '{"leads":50,"revenue":15000,"checks":100}'),
  ('notifications', '{"emailOnNewLead":true,"telegramAlerts":true,"dailySummary":false}')
ON CONFLICT (key) DO NOTHING;

-- Default Team-Mitglied
INSERT INTO team_members (name, email, role) VALUES
  ('Mo Sul', 'kontakt@agentflowm.de', 'admin')
ON CONFLICT (email) DO NOTHING;
