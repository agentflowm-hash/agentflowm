/**
 * ═══════════════════════════════════════════════════════════════
 *                    CUSTOM API ERRORS
 * ═══════════════════════════════════════════════════════════════
 */

import { ErrorCode, ErrorCodeType, HttpStatus, HttpStatusCode } from './types';

// ─────────────────────────────────────────────────────────────────
// Base API Error
// ─────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  public readonly code: ErrorCodeType;
  public readonly statusCode: HttpStatusCode;
  public readonly details?: Record<string, string[]>;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCodeType,
    message: string,
    statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: false as const,
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────
// Specific Error Classes
// ─────────────────────────────────────────────────────────────────

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(ErrorCode.UNAUTHORIZED, message, HttpStatus.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied') {
    super(ErrorCode.UNAUTHORIZED, message, HttpStatus.FORBIDDEN);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, HttpStatus.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(ErrorCode.ALREADY_EXISTS, message, HttpStatus.CONFLICT);
    this.name = 'ConflictError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(ErrorCode.VALIDATION_ERROR, message, HttpStatus.BAD_REQUEST, details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends ApiError {
  constructor(message = 'Database operation failed') {
    super(ErrorCode.DATABASE_ERROR, message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.name = 'DatabaseError';
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter?: number) {
    super(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded${retryAfter ? `. Retry after ${retryAfter}s` : ''}`,
      HttpStatus.TOO_MANY_REQUESTS
    );
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends ApiError {
  constructor(service: string, originalError?: Error) {
    super(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      `External service error: ${service}`,
      HttpStatus.SERVICE_UNAVAILABLE
    );
    this.name = 'ExternalServiceError';
    if (originalError) {
      this.stack = `${this.stack}\nCaused by: ${originalError.stack}`;
    }
  }
}

// ─────────────────────────────────────────────────────────────────
// Error Helpers
// ─────────────────────────────────────────────────────────────────

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function handleSupabaseError(error: unknown): never {
  const err = error as { code?: string; message?: string; details?: string };
  
  // Duplicate key
  if (err.code === '23505') {
    throw new ConflictError('A record with this value already exists');
  }
  
  // Foreign key violation
  if (err.code === '23503') {
    throw new ValidationError('Referenced record does not exist');
  }
  
  // Not null violation
  if (err.code === '23502') {
    throw new ValidationError('Required field is missing');
  }
  
  // Check violation
  if (err.code === '23514') {
    throw new ValidationError('Value does not meet requirements');
  }
  
  // Generic database error
  throw new DatabaseError(err.message || 'Database operation failed');
}
