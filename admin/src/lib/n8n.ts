/**
 * ═══════════════════════════════════════════════════════════════
 *                    N8N WEBHOOK HELPER
 * ═══════════════════════════════════════════════════════════════
 *
 * Fires events to n8n webhook endpoints. All calls are fire-and-forget
 * so they never block the main request.
 *
 * Configure N8N_WEBHOOK_URL in .env.local (e.g. http://localhost:5678)
 */

const N8N_BASE = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678';

type N8nEvent =
  | 'afm-lead-welcome'
  | 'afm-portal-approval'
  | 'afm-portal-changes'
  | 'afm-milestone-done';

async function fireN8n(event: N8nEvent, payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch(`${N8N_BASE}/webhook/${event}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString() }),
    });
  } catch {
    // n8n webhook failure should never block the main request
  }
}

/** New lead created → Welcome email + Telegram */
export function n8nLeadWelcome(lead: {
  name: string;
  email: string;
  phone?: string | null;
  package_interest?: string | null;
  company?: string | null;
}) {
  fireN8n('afm-lead-welcome', lead).catch(() => {});
}

/** Milestone marked as done → Email to client */
export function n8nMilestoneDone(data: {
  milestone_title: string;
  project_name: string;
  client_name: string;
  client_email: string;
}) {
  fireN8n('afm-milestone-done', data).catch(() => {});
}

/** Design approved → Telegram to admin */
export function n8nDesignApproved(data: {
  client_name: string;
  project_name: string;
  approval_title?: string;
}) {
  fireN8n('afm-portal-approval', { ...data, status: 'approved' }).catch(() => {});
}

/** Changes requested → Telegram + Email to admin */
export function n8nChangesRequested(data: {
  client_name: string;
  project_name: string;
  feedback?: string;
}) {
  fireN8n('afm-portal-changes', { ...data, status: 'changes_requested' }).catch(() => {});
}
