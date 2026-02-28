/**
 * ═══════════════════════════════════════════════════════════════
 *                    UNIFIED API HANDLER
 * ═══════════════════════════════════════════════════════════════
 * 
 * Enterprise-grade API handler with:
 * - Automatic authentication
 * - Request validation via Zod
 * - Centralized error handling
 * - Request logging
 * - Type-safe responses
 * 
 * Usage:
 * ```ts
 * export const POST = createHandler({
 *   auth: true,
 *   schema: CreateClientSchema,
 * }, async (data, ctx) => {
 *   const client = await createClient(data);
 *   return { client };
 * });
 * ```
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';
import { isAuthenticated } from '@/lib/auth';
import { 
  ApiError, 
  UnauthorizedError, 
  ValidationError, 
  isApiError,
  handleSupabaseError 
} from './errors';
import { 
  ApiSuccessResponse, 
  ApiErrorResponse, 
  RequestContext, 
  HttpStatus 
} from './types';

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface HandlerConfig<TSchema = unknown> {
  /** Require authentication (default: true) */
  auth?: boolean;
  /** Zod schema for request body validation */
  schema?: ZodSchema<TSchema>;
  /** Rate limit config */
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

type HandlerFunction<TBody, TResponse> = (
  data: TBody,
  context: RequestContext,
  request: NextRequest
) => Promise<TResponse>;

// ─────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────

function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function getClientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    undefined
  );
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  
  for (const issue of error.issues) {
    const path = issue.path.join('.') || 'root';
    if (!details[path]) {
      details[path] = [];
    }
    details[path].push(issue.message);
  }
  
  return details;
}

// ─────────────────────────────────────────────────────────────────
// Response Helpers
// ─────────────────────────────────────────────────────────────────

export function success<T>(data: T, status: number = HttpStatus.OK): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function created<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return success(data, HttpStatus.CREATED);
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: HttpStatus.NO_CONTENT });
}

export function error(err: ApiError): NextResponse<ApiErrorResponse> {
  return NextResponse.json(err.toJSON(), { status: err.statusCode });
}

// ─────────────────────────────────────────────────────────────────
// Main Handler Factory
// ─────────────────────────────────────────────────────────────────

export function createHandler<TBody = unknown, TResponse = unknown>(
  config: HandlerConfig<TBody>,
  handler: HandlerFunction<TBody, TResponse>
) {
  const { auth = true, schema } = config;

  return async (
    request: NextRequest,
    { params }: { params?: Record<string, string> } = {}
  ): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const startTime = Date.now();

    const context: RequestContext = {
      authenticated: false,
      requestId,
      timestamp: new Date(),
      ip: getClientIp(request),
      userAgent: request.headers.get('user-agent') || undefined,
    };

    try {
      // ─────────────────────────────────────────────────────────
      // Authentication Check
      // ─────────────────────────────────────────────────────────
      if (auth) {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          throw new UnauthorizedError();
        }
        context.authenticated = true;
      }

      // ─────────────────────────────────────────────────────────
      // Parse & Validate Body
      // ─────────────────────────────────────────────────────────
      let body: TBody = {} as TBody;

      if (request.method !== 'GET' && request.method !== 'DELETE') {
        try {
          const contentType = request.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const rawBody = await request.text();
            if (rawBody) {
              body = JSON.parse(rawBody);
            }
          }
        } catch (e) {
          throw new ValidationError('Invalid JSON in request body');
        }
      }

      // Parse URL params and query params
      if (params) {
        body = { ...body, ...params } as TBody;
      }

      // Parse query params for GET requests
      if (request.method === 'GET') {
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        body = { ...body, ...searchParams } as TBody;
      }

      // Validate with Zod schema
      if (schema) {
        try {
          body = schema.parse(body);
        } catch (e) {
          if (e instanceof ZodError) {
            throw new ValidationError(
              'Validation failed',
              formatZodErrors(e)
            );
          }
          throw e;
        }
      }

      // ─────────────────────────────────────────────────────────
      // Execute Handler
      // ─────────────────────────────────────────────────────────
      const result = await handler(body, context, request);

      // ─────────────────────────────────────────────────────────
      // Success Response
      // ─────────────────────────────────────────────────────────
      const duration = Date.now() - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${requestId}] ${request.method} ${request.nextUrl.pathname} - ${duration}ms`);
      }

      // Handle null/undefined as 204 No Content
      if (result === null || result === undefined) {
        return noContent();
      }

      return success(result);

    } catch (err) {
      // ─────────────────────────────────────────────────────────
      // Error Handling
      // ─────────────────────────────────────────────────────────
      const duration = Date.now() - startTime;

      // Known API errors
      if (isApiError(err)) {
        console.error(`[${requestId}] ${err.code}: ${err.message} (${duration}ms)`);
        return error(err);
      }

      // Supabase errors
      const supabaseError = err as { code?: string; message?: string };
      if (supabaseError.code && /^2\d{4}$/.test(supabaseError.code)) {
        try {
          handleSupabaseError(err);
        } catch (apiErr) {
          if (isApiError(apiErr)) {
            console.error(`[${requestId}] DB Error: ${apiErr.message} (${duration}ms)`);
            return error(apiErr);
          }
        }
      }

      // Unknown errors
      console.error(`[${requestId}] Unhandled error (${duration}ms):`, err);
      
      const internalError = new ApiError(
        'INTERNAL_ERROR',
        process.env.NODE_ENV === 'development' 
          ? (err as Error).message 
          : 'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
      
      return error(internalError);
    }
  };
}

// ─────────────────────────────────────────────────────────────────
// Method-specific Factories (convenience)
// ─────────────────────────────────────────────────────────────────

export function GET<TQuery = unknown, TResponse = unknown>(
  config: Omit<HandlerConfig<TQuery>, 'method'>,
  handler: HandlerFunction<TQuery, TResponse>
) {
  return createHandler(config, handler);
}

export function POST<TBody = unknown, TResponse = unknown>(
  config: Omit<HandlerConfig<TBody>, 'method'>,
  handler: HandlerFunction<TBody, TResponse>
) {
  return createHandler(config, handler);
}

export function PUT<TBody = unknown, TResponse = unknown>(
  config: Omit<HandlerConfig<TBody>, 'method'>,
  handler: HandlerFunction<TBody, TResponse>
) {
  return createHandler(config, handler);
}

export function PATCH<TBody = unknown, TResponse = unknown>(
  config: Omit<HandlerConfig<TBody>, 'method'>,
  handler: HandlerFunction<TBody, TResponse>
) {
  return createHandler(config, handler);
}

export function DELETE<TParams = unknown, TResponse = unknown>(
  config: Omit<HandlerConfig<TParams>, 'method'>,
  handler: HandlerFunction<TParams, TResponse>
) {
  return createHandler(config, handler);
}

// ─────────────────────────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────────────────────────

export * from './errors';
export * from './types';
export * from './schemas';
