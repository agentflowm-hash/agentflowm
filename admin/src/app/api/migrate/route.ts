import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'run-migration-2026') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const pool = new Pool({
    connectionString: `postgresql://postgres:20A6nfELnDHBuUFxsMb50KfGwUHwFFl5@db.qzjqldjroqzaymxkhysd.supabase.co:5432/postgres`,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  const results: string[] = [];

  const statements = [
    {
      name: 'accounting_transactions',
      sql: `CREATE TABLE IF NOT EXISTS accounting_transactions (
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
      DO $$ BEGIN
        CREATE POLICY allow_all_accounting ON accounting_transactions FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'admin_settings',
      sql: `CREATE TABLE IF NOT EXISTS admin_settings (
        id serial PRIMARY KEY,
        key text UNIQUE NOT NULL,
        value jsonb NOT NULL DEFAULT '{}',
        updated_at timestamptz DEFAULT now()
      );
      ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        CREATE POLICY allow_all_settings ON admin_settings FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'subscriptions',
      sql: `CREATE TABLE IF NOT EXISTS subscriptions (
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
      DO $$ BEGIN
        CREATE POLICY allow_all_subs ON subscriptions FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'project_templates',
      sql: `CREATE TABLE IF NOT EXISTS project_templates (
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
      DO $$ BEGIN
        CREATE POLICY allow_all_templates ON project_templates FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'team_members',
      sql: `CREATE TABLE IF NOT EXISTS team_members (
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
      DO $$ BEGIN
        CREATE POLICY allow_all_team ON team_members FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'pipelines',
      sql: `CREATE TABLE IF NOT EXISTS pipelines (
        id serial PRIMARY KEY,
        name text NOT NULL,
        stages jsonb NOT NULL DEFAULT '[]',
        color text DEFAULT '#FC682C',
        is_default boolean DEFAULT false,
        created_at timestamptz DEFAULT now()
      );
      ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;
      DO $$ BEGIN
        CREATE POLICY allow_all_pipelines ON pipelines FOR ALL USING (true) WITH CHECK (true);
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;`
    },
    {
      name: 'default_pipelines',
      sql: `INSERT INTO pipelines (name, stages, color, is_default)
      SELECT 'Website-Projekte', '[{"id":"new","label":"Neu"},{"id":"contacted","label":"Kontaktiert"},{"id":"qualified","label":"Qualifiziert"},{"id":"proposal","label":"Angebot"},{"id":"won","label":"Gewonnen"}]'::jsonb, '#FC682C', true
      WHERE NOT EXISTS (SELECT 1 FROM pipelines WHERE name = 'Website-Projekte');
      INSERT INTO pipelines (name, stages, color, is_default)
      SELECT 'SEO-Kunden', '[{"id":"new","label":"Anfrage"},{"id":"audit","label":"SEO-Audit"},{"id":"proposal","label":"Angebot"},{"id":"active","label":"Aktiv"},{"id":"reporting","label":"Reporting"}]'::jsonb, '#6366F1', false
      WHERE NOT EXISTS (SELECT 1 FROM pipelines WHERE name = 'SEO-Kunden');
      INSERT INTO pipelines (name, stages, color, is_default)
      SELECT 'Wartungsverträge', '[{"id":"new","label":"Anfrage"},{"id":"proposal","label":"Angebot"},{"id":"active","label":"Aktiv"},{"id":"renewal","label":"Verlängerung"}]'::jsonb, '#10B981', false
      WHERE NOT EXISTS (SELECT 1 FROM pipelines WHERE name = 'Wartungsverträge');`
    },
    {
      name: 'default_templates',
      sql: `INSERT INTO project_templates (name, package, default_price, milestones, services, is_default)
      SELECT 'Growth Website', 'Growth', 2000, '["Erstgespräch","Konzept & Design","Entwicklung","Content","Testing","Go-Live"]'::jsonb, '["Responsive Design","SEO-Optimierung","CMS-Integration","SSL & Hosting","30 Tage Support"]'::jsonb, true
      WHERE NOT EXISTS (SELECT 1 FROM project_templates WHERE name = 'Growth Website');
      INSERT INTO project_templates (name, package, default_price, milestones, services, is_default)
      SELECT 'Business Website', 'Business', 3500, '["Erstgespräch","Wireframes","UI Design","Frontend","Backend","Testing","Go-Live","Schulung"]'::jsonb, '["Premium Design","SEO-Optimierung","CMS","Blog","Kontaktformular","Analytics","SSL & Hosting","60 Tage Support"]'::jsonb, false
      WHERE NOT EXISTS (SELECT 1 FROM project_templates WHERE name = 'Business Website');
      INSERT INTO project_templates (name, package, default_price, milestones, services, is_default)
      SELECT 'One-Page Website', 'Starter', 500, '["Erstgespräch","Design","Entwicklung","Go-Live"]'::jsonb, '["One-Page Design","Mobile-First","Kontaktformular","SSL"]'::jsonb, false
      WHERE NOT EXISTS (SELECT 1 FROM project_templates WHERE name = 'One-Page Website');
      INSERT INTO project_templates (name, package, default_price, milestones, services, is_default)
      SELECT 'SEO-Paket', 'SEO', 800, '["Audit","Keyword-Analyse","On-Page","Off-Page","Reporting"]'::jsonb, '["SEO-Audit","Keyword-Recherche","On-Page Optimierung","Backlink-Aufbau","Monatliches Reporting"]'::jsonb, false
      WHERE NOT EXISTS (SELECT 1 FROM project_templates WHERE name = 'SEO-Paket');`
    },
    {
      name: 'default_settings',
      sql: `INSERT INTO admin_settings (key, value) VALUES
      ('company', '{"name":"AgentFlowMarketing","address":"Achillesstraße 69A, 13125 Berlin","email":"kontakt@agentflowm.de","phone":"+49 179 949 8247","taxId":"","iban":"DE89 3704 0044 0532 0130 00","bic":"COBADEFFXXX"}'),
      ('goals', '{"leads":50,"revenue":15000,"checks":100}'),
      ('notifications', '{"emailOnNewLead":true,"telegramAlerts":true,"dailySummary":false}')
      ON CONFLICT (key) DO NOTHING;`
    },
    {
      name: 'default_team',
      sql: `INSERT INTO team_members (name, email, role) VALUES ('Mo Sul', 'kontakt@agentflowm.de', 'admin') ON CONFLICT (email) DO NOTHING;`
    },
    {
      name: 'agreements_signature_data',
      sql: `ALTER TABLE agreements ADD COLUMN IF NOT EXISTS signature_data text;`
    },
  ];

  for (const stmt of statements) {
    try {
      await pool.query(stmt.sql);
      results.push(`${stmt.name}: OK`);
    } catch (e: any) {
      results.push(`${stmt.name}: ERROR - ${e.message}`);
    }
  }

  await pool.end();

  return NextResponse.json({ success: true, results });
}
