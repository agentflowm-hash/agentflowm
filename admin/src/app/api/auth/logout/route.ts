/**
 * ═══════════════════════════════════════════════════════════════
 *                    LOGOUT API
 * ═══════════════════════════════════════════════════════════════
 */

import { createHandler } from '@/lib/api';
import { destroySession } from '@/lib/auth';

// ─────────────────────────────────────────────────────────────────
// POST /api/auth/logout - Destroy session
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: false, // Allow logout even if session is invalid
}, async () => {
  await destroySession();

  return { 
    success: true,
    message: 'Logged out successfully',
  };
});
