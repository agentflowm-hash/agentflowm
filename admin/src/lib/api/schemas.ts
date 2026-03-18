/**
 * ═══════════════════════════════════════════════════════════════
 *                    ZOD VALIDATION SCHEMAS
 * ═══════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────
// Common Schemas
// ─────────────────────────────────────────────────────────────────

// Accept both integer IDs and UUID strings
export const IdSchema = z.union([
  z.string().uuid(),
  z.string().regex(/^\d+$/),
  z.number().int().positive(),
]).transform(val => typeof val === 'number' ? String(val) : val);

export const EmailSchema = z.string().email('Invalid email address').toLowerCase().trim();

export const PhoneSchema = z.string()
  .regex(/^\+?[\d\s\-()]{6,20}$/, 'Invalid phone number')
  .optional()
  .nullable();

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const DateRangeSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ─────────────────────────────────────────────────────────────────
// Client Schemas
// ─────────────────────────────────────────────────────────────────

export const CreateClientSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: EmailSchema,
  company: z.string().max(100).optional().nullable(),
  phone: PhoneSchema,
  packageType: z.string().optional().default('Starter'),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'archived']).optional(),
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;

// ─────────────────────────────────────────────────────────────────
// Invoice Schemas
// ─────────────────────────────────────────────────────────────────

export const InvoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required').max(500),
  quantity: z.number().positive('Quantity must be positive'),
  unit_price: z.number().min(0, 'Unit price cannot be negative'),
});

export const CreateInvoiceSchema = z.object({
  // Either client_id OR client details
  client_id: IdSchema.optional().nullable(),
  client_name: z.string().min(1).max(100).optional(),
  client_email: EmailSchema.optional(),
  client_company: z.string().max(100).optional().nullable(),
  client_address: z.string().max(500).optional().nullable(),
  project_id: IdSchema.optional().nullable(),
  items: z.array(InvoiceItemSchema).min(1, 'At least one item is required'),
  tax_rate: z.number().min(0).max(100).default(19),
  discount_percent: z.number().min(0).max(100).default(0),
  due_date: z.string(),  // Accept any date string format
  notes: z.string().max(1000).optional(),
  type: z.enum(['invoice', 'offer']).optional().default('invoice'),
}).refine(
  data => data.client_id || (data.client_name && data.client_email),
  { message: 'Either client_id or client_name+email required' }
);

export const UpdateInvoiceSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  items: z.array(InvoiceItemSchema).min(1).optional(),
  tax_rate: z.number().min(0).max(100).optional(),
  due_date: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;

// ─────────────────────────────────────────────────────────────────
// Calendar Schemas
// ─────────────────────────────────────────────────────────────────

const EventBaseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  start_time: z.string().datetime('Invalid start time'),
  end_time: z.string().datetime('Invalid end time'),
  client_id: IdSchema.optional().nullable(),
  project_id: IdSchema.optional().nullable(),
  event_type: z.enum(['meeting', 'deadline', 'milestone', 'reminder']).default('meeting'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
});

export const CreateEventSchema = EventBaseSchema.refine(
  (data) => new Date(data.end_time) > new Date(data.start_time),
  { message: 'End time must be after start time', path: ['end_time'] }
);

export const UpdateEventSchema = EventBaseSchema.partial();

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;

// ─────────────────────────────────────────────────────────────────
// Notification Schemas
// ─────────────────────────────────────────────────────────────────

export const CreateNotificationSchema = z.object({
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  link: z.string().url().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateNotificationSchema = z.object({
  is_read: z.boolean().optional(),
});

export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;

// ─────────────────────────────────────────────────────────────────
// Email Template Schemas
// ─────────────────────────────────────────────────────────────────

export const CreateEmailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(50000),
  category: z.string().max(50).default('general'),
  variables: z.array(z.string()).default([]),
});

export const UpdateEmailTemplateSchema = CreateEmailTemplateSchema.partial();

export type CreateEmailTemplateInput = z.infer<typeof CreateEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof UpdateEmailTemplateSchema>;

// ─────────────────────────────────────────────────────────────────
// Email Sending Schemas
// ─────────────────────────────────────────────────────────────────

export const SendEmailSchema = z.object({
  to: EmailSchema,
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  template_id: IdSchema.optional(),
  variables: z.record(z.string(), z.string()).optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    content: z.string(), // base64
    contentType: z.string(),
  })).optional(),
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

// ─────────────────────────────────────────────────────────────────
// Lead Schemas
// ─────────────────────────────────────────────────────────────────

export const CreateLeadSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: EmailSchema,
  company: z.string().max(100).optional(),
  phone: PhoneSchema,
  message: z.string().max(5000).optional(),
  source: z.string().max(50).optional(),
  package_interest: z.string().optional(),
  referrer_id: z.number().int().positive().optional().nullable(),
});

export const UpdateLeadSchema = CreateLeadSchema.partial().extend({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'lost']).optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>;
export type UpdateLeadInput = z.infer<typeof UpdateLeadSchema>;

// ─────────────────────────────────────────────────────────────────
// Referral Schemas
// ─────────────────────────────────────────────────────────────────

export const CreateReferralSchema = z.object({
  referrer_id: IdSchema,
  referred_email: EmailSchema,
  referred_name: z.string().min(2).max(100),
  notes: z.string().max(1000).optional(),
});

export const UpdateReferralSchema = z.object({
  status: z.enum(['pending', 'contacted', 'converted', 'expired']).optional(),
  reward_status: z.enum(['pending', 'approved', 'paid']).optional(),
});

export type CreateReferralInput = z.infer<typeof CreateReferralSchema>;
export type UpdateReferralInput = z.infer<typeof UpdateReferralSchema>;

// ─────────────────────────────────────────────────────────────────
// Auth Schemas
// ─────────────────────────────────────────────────────────────────

export const LoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
