/**
 * ═══════════════════════════════════════════════════════════════
 *                    API MODULE EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

// Handler & Response Helpers
export {
  createHandler,
  success,
  created,
  noContent,
  error,
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
} from './handler';

// Errors
export {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  DatabaseError,
  RateLimitError,
  ExternalServiceError,
  isApiError,
  handleSupabaseError,
} from './errors';

// Types
export type {
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiResponse,
  RequestContext,
  HandlerOptions,
  PaginationParams,
  PaginatedResponse,
  BaseEntity,
  Client,
  Project,
  Invoice,
  InvoiceItem,
  CalendarEvent,
  Notification,
  EmailTemplate,
} from './types';

export { HttpStatus, ErrorCode } from './types';

// Schemas
export {
  // Common
  IdSchema,
  EmailSchema,
  PhoneSchema,
  PaginationSchema,
  DateRangeSchema,
  // Client
  CreateClientSchema,
  UpdateClientSchema,
  // Invoice
  InvoiceItemSchema,
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  // Calendar
  CreateEventSchema,
  UpdateEventSchema,
  // Notification
  CreateNotificationSchema,
  UpdateNotificationSchema,
  // Email
  CreateEmailTemplateSchema,
  UpdateEmailTemplateSchema,
  SendEmailSchema,
  // Lead
  CreateLeadSchema,
  UpdateLeadSchema,
  // Referral
  CreateReferralSchema,
  UpdateReferralSchema,
  // Auth
  LoginSchema,
} from './schemas';

export type {
  CreateClientInput,
  UpdateClientInput,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  CreateEventInput,
  UpdateEventInput,
  CreateNotificationInput,
  UpdateNotificationInput,
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  SendEmailInput,
  CreateLeadInput,
  UpdateLeadInput,
  CreateReferralInput,
  UpdateReferralInput,
  LoginInput,
} from './schemas';
