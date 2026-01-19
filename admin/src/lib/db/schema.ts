import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ═══════════════════════════════════════════════════════════════
//                    LEADS / KONTAKTANFRAGEN
// ═══════════════════════════════════════════════════════════════

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),
  source: text('source').notNull().default('website'),
  packageInterest: text('package_interest'),
  message: text('message'),
  budget: text('budget'),
  status: text('status').notNull().default('new'),
  priority: text('priority').default('medium'),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  contactedAt: text('contacted_at'),
});

// ═══════════════════════════════════════════════════════════════
//                    WEBSITE-CHECKS
// ═══════════════════════════════════════════════════════════════

export const websiteChecks = sqliteTable('website_checks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  email: text('email'),
  scoreOverall: integer('score_overall'),
  scoreSecurity: integer('score_security'),
  scoreSeo: integer('score_seo'),
  scoreAccessibility: integer('score_accessibility'),
  scorePerformance: integer('score_performance'),
  scoreStructure: integer('score_structure'),
  loadTime: integer('load_time'),
  httpsEnabled: integer('https_enabled', { mode: 'boolean' }),
  resultJson: text('result_json'),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: text('created_at').notNull(),
});

// ═══════════════════════════════════════════════════════════════
//                    REFERRALS / EMPFEHLUNGEN
// ═══════════════════════════════════════════════════════════════

export const referrals = sqliteTable('referrals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  referrerName: text('referrer_name').notNull(),
  referrerEmail: text('referrer_email').notNull(),
  referrerPhone: text('referrer_phone'),
  referredName: text('referred_name').notNull(),
  referredEmail: text('referred_email'),
  referredPhone: text('referred_phone'),
  referredCompany: text('referred_company'),
  context: text('context'),
  notes: text('notes'),
  status: text('status').notNull().default('pending'),
  convertedLeadId: integer('converted_lead_id'),
  commissionStatus: text('commission_status').default('pending'),
  commissionAmount: real('commission_amount'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ═══════════════════════════════════════════════════════════════
//                    NEWSLETTER SUBSCRIBERS
// ═══════════════════════════════════════════════════════════════

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  topics: text('topics'),
  frequency: text('frequency').default('weekly'),
  status: text('status').notNull().default('pending'),
  confirmToken: text('confirm_token'),
  createdAt: text('created_at').notNull(),
  confirmedAt: text('confirmed_at'),
  unsubscribedAt: text('unsubscribed_at'),
});

// Type exports
export type Lead = typeof leads.$inferSelect;
export type WebsiteCheck = typeof websiteChecks.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
