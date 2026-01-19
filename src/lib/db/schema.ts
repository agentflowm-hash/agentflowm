import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ═══════════════════════════════════════════════════════════════
//                    LEADS / KONTAKTANFRAGEN
// ═══════════════════════════════════════════════════════════════

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Kontaktdaten
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  
  // Anfrage-Details
  source: text('source').notNull().default('website'), // website, referral, calendly
  packageInterest: text('package_interest'), // one-page, business, growth
  message: text('message'),
  budget: text('budget'),
  
  // Status-Tracking
  status: text('status').notNull().default('new'), // new, contacted, qualified, proposal, won, lost
  priority: text('priority').default('medium'), // low, medium, high
  notes: text('notes'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
  contactedAt: text('contacted_at'),
});

// ═══════════════════════════════════════════════════════════════
//                    WEBSITE-CHECKS
// ═══════════════════════════════════════════════════════════════

export const websiteChecks = sqliteTable('website_checks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // URL & Requester
  url: text('url').notNull(),
  email: text('email'), // optional - für Report per E-Mail
  
  // Scores (0-100)
  scoreOverall: integer('score_overall'),
  scoreSecurity: integer('score_security'),
  scoreSeo: integer('score_seo'),
  scoreAccessibility: integer('score_accessibility'),
  scorePerformance: integer('score_performance'),
  scoreStructure: integer('score_structure'),
  
  // Technical Data
  loadTime: integer('load_time'), // ms
  httpsEnabled: integer('https_enabled', { mode: 'boolean' }),
  
  // Full Result (JSON)
  resultJson: text('result_json'),
  
  // Tracking
  ipHash: text('ip_hash'), // Gehashed für Datenschutz
  userAgent: text('user_agent'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// ═══════════════════════════════════════════════════════════════
//                    REFERRALS / EMPFEHLUNGEN
// ═══════════════════════════════════════════════════════════════

export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  // Empfehlender
  referrerName: text('referrer_name').notNull(),
  referrerEmail: text('referrer_email').notNull(),
  referrerPhone: text('referrer_phone'),
  
  // Empfohlener Kontakt
  referredName: text('referred_name').notNull(),
  referredEmail: text('referred_email'),
  referredPhone: text('referred_phone'),
  referredCompany: text('referred_company'),
  
  // Details
  context: text('context'), // Wie kennt der Empfehlende den Kontakt?
  notes: text('notes'),
  
  // Status
  status: text('status').notNull().default('pending'), // pending, contacted, converted, invalid
  convertedLeadId: integer('converted_lead_id').references(() => leads.id),
  
  // Provision (wenn Lead konvertiert)
  commissionStatus: text('commission_status').default('pending'), // pending, approved, paid
  commissionAmount: real('commission_amount'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  updatedAt: text('updated_at').notNull().default(new Date().toISOString()),
});

// ═══════════════════════════════════════════════════════════════
//                    NEWSLETTER SUBSCRIBERS
// ═══════════════════════════════════════════════════════════════

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  email: text('email').notNull().unique(),
  name: text('name'),
  
  // Preferences
  topics: text('topics'), // JSON array of interests
  frequency: text('frequency').default('weekly'), // daily, weekly, monthly
  
  // Status
  status: text('status').notNull().default('pending'), // pending, confirmed, unsubscribed
  confirmToken: text('confirm_token'),
  
  // Timestamps
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
  confirmedAt: text('confirmed_at'),
  unsubscribedAt: text('unsubscribed_at'),
});

// ═══════════════════════════════════════════════════════════════
//                    RATE LIMITING
// ═══════════════════════════════════════════════════════════════

export const rateLimits = sqliteTable('rate_limits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  
  identifier: text('identifier').notNull(), // IP hash or email
  endpoint: text('endpoint').notNull(), // /api/contact, /api/website-check
  
  requestCount: integer('request_count').notNull().default(1),
  windowStart: text('window_start').notNull(),
  
  // Index für schnelle Lookups
  createdAt: text('created_at').notNull().default(new Date().toISOString()),
});

// Type exports für TypeScript
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type WebsiteCheck = typeof websiteChecks.$inferSelect;
export type NewWebsiteCheck = typeof websiteChecks.$inferInsert;

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
