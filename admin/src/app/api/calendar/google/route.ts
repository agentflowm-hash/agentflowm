/**
 * ═══════════════════════════════════════════════════════════════
 *                    GOOGLE CALENDAR API (Placeholder)
 * ═══════════════════════════════════════════════════════════════
 * TODO: Google OAuth2 Flow implementieren mit googleapis npm package
 */

import { createHandler } from '@/lib/api';

// GET: Google Calendar connection status
export const GET = createHandler({
  auth: true,
}, async () => {
  return {
    connected: false,
    message: 'Google Kalender Integration wird eingerichtet',
  };
});

// POST: Placeholder for OAuth flow
export const POST = createHandler({
  auth: true,
}, async () => {
  return {
    connected: false,
    message: 'Google Kalender Verbindung ist noch nicht verfügbar. Kommt bald!',
  };
});
