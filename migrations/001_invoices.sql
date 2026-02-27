-- Migration: Add Invoice System
-- Date: 2026-02-28
-- Description: Complete invoicing system for AgentFlowMarketing

-- ═══════════════════════════════════════════════════════════════
--                    INVOICES / RECHNUNGEN
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  client_id INTEGER REFERENCES portal_clients(id),
  lead_id INTEGER REFERENCES leads(id),
  
  -- Client Info (cached for PDF)
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,
  client_address TEXT,
  client_vat_id TEXT,
  
  -- Invoice Details
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Amounts
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Payment
  payment_method TEXT,
  stripe_invoice_id TEXT,
  stripe_payment_intent TEXT,
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(10,2),
  
  -- Metadata
  notes TEXT,
  internal_notes TEXT,
  pdf_url TEXT,
  reminder_sent_at TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoice Templates
CREATE TABLE IF NOT EXISTS invoice_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment History
CREATE TABLE IF NOT EXISTS payment_history (
  id SERIAL PRIMARY KEY,
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- Insert default templates
INSERT INTO invoice_templates (name, description, items, is_default) VALUES
('Launch Paket', 'Website Launch Paket - 3 Seiten', '[{"description": "Launch Paket - Landingpage + 2 Unterseiten", "quantity": 1, "unit_price": 3790}]', true),
('Business Paket', 'Business Paket - 9 Seiten + Workflow', '[{"description": "Business Paket - 9 Seiten + Publishing Workflow", "quantity": 1, "unit_price": 8390}]', false),
('Web App', 'Web App Entwicklung', '[{"description": "Web App - Login, Dashboard, API Integration", "quantity": 1, "unit_price": 18990}]', false),
('Mobile App', 'Native Mobile App iOS + Android', '[{"description": "Mobile App - iOS & Android", "quantity": 1, "unit_price": 35990}]', false)
ON CONFLICT DO NOTHING;
