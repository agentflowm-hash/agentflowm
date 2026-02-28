-- ========================================
-- PHASE 1: Calendar, Email, Notifications
-- ========================================

-- Calendar Events
CREATE TABLE IF NOT EXISTS portal_calendar_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  type VARCHAR(50) DEFAULT 'event', -- event, deadline, meeting, reminder, milestone
  project_id INTEGER REFERENCES portal_projects(id) ON DELETE SET NULL,
  client_id INTEGER REFERENCES portal_clients(id) ON DELETE SET NULL,
  color VARCHAR(20) DEFAULT '#FC682C',
  all_day BOOLEAN DEFAULT FALSE,
  reminder_minutes INTEGER DEFAULT 30,
  location TEXT,
  attendees JSONB,
  completed BOOLEAN DEFAULT FALSE,
  calendly_id VARCHAR(255),
  google_calendar_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_calendar_events_date ON portal_calendar_events(start_date);
CREATE INDEX idx_calendar_events_project ON portal_calendar_events(project_id);
CREATE INDEX idx_calendar_events_client ON portal_calendar_events(client_id);
CREATE INDEX idx_calendar_events_type ON portal_calendar_events(type);

-- Email Templates
CREATE TABLE IF NOT EXISTS portal_email_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general', -- welcome, followup, proposal, reminder, invoice
  variables JSONB DEFAULT '[]',
  preview_text VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_templates_category ON portal_email_templates(category);

-- Emails (Sent History with Tracking)
CREATE TABLE IF NOT EXISTS portal_emails (
  id SERIAL PRIMARY KEY,
  tracking_id VARCHAR(100) UNIQUE NOT NULL,
  to_email TEXT NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  client_id INTEGER REFERENCES portal_clients(id) ON DELETE SET NULL,
  template_id INTEGER REFERENCES portal_email_templates(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sending, sent, failed, scheduled, bounced
  resend_id VARCHAR(255),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_emails_client ON portal_emails(client_id);
CREATE INDEX idx_emails_status ON portal_emails(status);
CREATE INDEX idx_emails_tracking ON portal_emails(tracking_id);
CREATE INDEX idx_emails_sent_at ON portal_emails(sent_at);

-- Notifications Hub
CREATE TABLE IF NOT EXISTS portal_notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, warning, success, error, deadline, message, approval
  channels JSONB DEFAULT '["push"]', -- telegram, email, push, whatsapp
  project_id INTEGER REFERENCES portal_projects(id) ON DELETE SET NULL,
  client_id INTEGER REFERENCES portal_clients(id) ON DELETE SET NULL,
  action_url TEXT,
  priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
  read_at TIMESTAMP WITH TIME ZONE,
  dismissed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_read ON portal_notifications(read_at);
CREATE INDEX idx_notifications_type ON portal_notifications(type);
CREATE INDEX idx_notifications_priority ON portal_notifications(priority);
CREATE INDEX idx_notifications_created ON portal_notifications(created_at);

-- Notification Triggers (für Auto-Notifications)
CREATE TABLE IF NOT EXISTS portal_notification_triggers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  event VARCHAR(100) NOT NULL, -- new_message, deadline_approaching, approval_needed, project_update
  conditions JSONB,
  channels JSONB DEFAULT '["push"]',
  template TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up Sequences
CREATE TABLE IF NOT EXISTS portal_followup_sequences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(100), -- after_proposal, after_meeting, no_response
  steps JSONB NOT NULL, -- [{delay_days: 1, template_id: 1, channel: "email"}, ...]
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follow-up Queue
CREATE TABLE IF NOT EXISTS portal_followup_queue (
  id SERIAL PRIMARY KEY,
  sequence_id INTEGER REFERENCES portal_followup_sequences(id) ON DELETE CASCADE,
  client_id INTEGER REFERENCES portal_clients(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, paused, completed, cancelled
  next_action_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB
);

CREATE INDEX idx_followup_queue_next ON portal_followup_queue(next_action_at);
CREATE INDEX idx_followup_queue_status ON portal_followup_queue(status);

-- ========================================
-- DEFAULT EMAIL TEMPLATES
-- ========================================

INSERT INTO portal_email_templates (name, subject, body, category, variables) VALUES
('Willkommen', 'Willkommen bei AgentFlowMarketing, {{name}}!', '<h1>Willkommen, {{name}}!</h1><p>Ihr Portal-Zugang ist bereit.</p><p>Zugangscode: <strong>{{access_code}}</strong></p><p>Login: <a href="https://portal.agentflowm.de">Portal öffnen</a></p>', 'welcome', '["name", "access_code"]'),
('Projekt Update', 'Update zu Ihrem Projekt: {{project_name}}', '<h1>Projekt Update</h1><p>Hallo {{name}},</p><p>Ihr Projekt "{{project_name}}" hat einen neuen Status:</p><p><strong>{{status}}</strong> - {{progress}}% abgeschlossen</p>', 'update', '["name", "project_name", "status", "progress"]'),
('Approval Required', 'Ihre Freigabe wird benötigt', '<h1>Freigabe erforderlich</h1><p>Hallo {{name}},</p><p>Wir benötigen Ihre Freigabe für: <strong>{{approval_title}}</strong></p><p><a href="{{approval_link}}">Jetzt ansehen und freigeben</a></p>', 'approval', '["name", "approval_title", "approval_link"]'),
('Follow-up 1', 'Kurze Rückfrage zu unserem Gespräch', '<p>Hallo {{name}},</p><p>ich wollte kurz nachfragen, ob Sie noch Fragen zu unserem Angebot haben?</p><p>Gerne stehe ich für ein kurzes Gespräch zur Verfügung.</p><p>Beste Grüße</p>', 'followup', '["name"]'),
('Rechnung', 'Ihre Rechnung #{{invoice_number}}', '<h1>Rechnung #{{invoice_number}}</h1><p>Sehr geehrte(r) {{name}},</p><p>anbei finden Sie Ihre Rechnung über {{amount}}.</p><p>Zahlungsziel: {{due_date}}</p>', 'invoice', '["name", "invoice_number", "amount", "due_date"]')
ON CONFLICT DO NOTHING;

-- ========================================
-- DEFAULT NOTIFICATION TRIGGERS
-- ========================================

INSERT INTO portal_notification_triggers (name, event, channels, template) VALUES
('Neue Nachricht', 'new_message', '["telegram", "push"]', '📩 Neue Nachricht von {{client_name}}: {{preview}}'),
('Deadline in 3 Tagen', 'deadline_approaching', '["telegram", "email"]', '⏰ Projekt "{{project_name}}" - Deadline in 3 Tagen!'),
('Neue Freigabe', 'approval_needed', '["telegram", "push"]', '✋ Freigabe erforderlich: {{approval_title}}'),
('Projekt abgeschlossen', 'project_completed', '["telegram"]', '🎉 Projekt "{{project_name}}" wurde abgeschlossen!')
ON CONFLICT DO NOTHING;
