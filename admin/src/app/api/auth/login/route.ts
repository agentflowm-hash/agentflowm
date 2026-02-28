/**
 * ═══════════════════════════════════════════════════════════════
 *                    LOGIN API
 * ═══════════════════════════════════════════════════════════════
 */

import { 
  createHandler, 
  LoginSchema, 
  UnauthorizedError,
  type LoginInput 
} from '@/lib/api';
import { verifyPassword, createSession } from '@/lib/auth';

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/login - Authenticate admin
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: false, // Public endpoint
  schema: LoginSchema,
}, async (data: LoginInput) => {
  const { password } = data;

  const isValid = verifyPassword(password);

  if (!isValid) {
    throw new UnauthorizedError('Invalid password');
  }

  await createSession();

  return { 
    authenticated: true,
    message: 'Login successful',
  };
});
