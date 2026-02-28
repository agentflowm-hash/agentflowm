/**
 * ═══════════════════════════════════════════════════════════════
 *                    API TYPES - TYPE-SAFE RESPONSES
 * ═══════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    stack?: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────────────────────────
// HTTP Status Codes
// ─────────────────────────────────────────────────────────────────

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

// ─────────────────────────────────────────────────────────────────
// Error Codes
// ─────────────────────────────────────────────────────────────────

export const ErrorCode = {
  // Auth Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource Errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Server Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];

// ─────────────────────────────────────────────────────────────────
// Request Context
// ─────────────────────────────────────────────────────────────────

export interface RequestContext {
  authenticated: boolean;
  requestId: string;
  timestamp: Date;
  ip?: string;
  userAgent?: string;
}

// ─────────────────────────────────────────────────────────────────
// Handler Types
// ─────────────────────────────────────────────────────────────────

export type ApiHandler<TBody = unknown, TResponse = unknown> = (
  body: TBody,
  context: RequestContext
) => Promise<TResponse>;

export interface HandlerOptions<TBody = unknown> {
  auth?: boolean;
  schema?: import('zod').ZodSchema<TBody>;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

// ─────────────────────────────────────────────────────────────────
// Pagination
// ─────────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Common Entity Types
// ─────────────────────────────────────────────────────────────────

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface Client extends BaseEntity {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  access_code: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface Project extends BaseEntity {
  client_id: string;
  name: string;
  package: string;
  status: string;
  status_label: string;
  progress: number;
  manager: string;
}

export interface Invoice extends BaseEntity {
  client_id: string;
  project_id?: string;
  invoice_number: string;
  amount: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface CalendarEvent extends BaseEntity {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  client_id?: string;
  project_id?: string;
  event_type: 'meeting' | 'deadline' | 'milestone' | 'reminder';
  color?: string;
}

export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
}

export interface EmailTemplate extends BaseEntity {
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
}
