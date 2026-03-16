-- AgentFlowM Empfehlungs-System (Referral System)
-- Ausführen in Supabase SQL Editor

-- 1. Empfehlungsgeber-Tabelle
CREATE TABLE IF NOT EXISTS referrers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  company text,
  total_referrals integer DEFAULT 0,
  converted_referrals integer DEFAULT 0,
  total_commission numeric(12,2) DEFAULT 0,
  commission_rate numeric(5,2) DEFAULT 10, -- 10% Standard
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE referrers ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_referrers ON referrers FOR ALL USING (true) WITH CHECK (true);

-- 2. Leads-Tabelle erweitern: referrer_id Spalte
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer_id integer REFERENCES referrers(id);

-- 3. Referral-Provisions-Tracking
CREATE TABLE IF NOT EXISTS referral_commissions (
  id serial PRIMARY KEY,
  referrer_id integer NOT NULL REFERENCES referrers(id),
  lead_id integer REFERENCES leads(id),
  deal_value numeric(12,2) NOT NULL DEFAULT 0,
  commission_rate numeric(5,2) NOT NULL DEFAULT 10,
  commission_amount numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY allow_all_commissions ON referral_commissions FOR ALL USING (true) WITH CHECK (true);

-- 4. Index für schnelle Abfragen
CREATE INDEX IF NOT EXISTS idx_leads_referrer_id ON leads(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_referrer ON referral_commissions(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrers_email ON referrers(email);
