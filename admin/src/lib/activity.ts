/**
 * ═══════════════════════════════════════════════════════════════
 *                    ACTIVITY LOG HELPER
 * ═══════════════════════════════════════════════════════════════
 *
 * Import this function in any API route to automatically log
 * actions to the activity_log table.
 *
 * Usage:
 * ```ts
 * import { logActivity } from '@/lib/activity';
 *
 * await logActivity('lead_created', 'lead', lead.id, lead.name, {
 *   source: 'website',
 *   package: 'Starter'
 * });
 * ```
 */

import { db } from '@/lib/db';

interface ActivityDetails {
  [key: string]: string | number | boolean | null | undefined;
}

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: number | null,
  entityName?: string | null,
  details?: ActivityDetails,
  userName: string = 'Admin'
): Promise<void> {
  try {
    await db.from('activity_log').insert({
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      entity_name: entityName ?? null,
      details: details ?? {},
      user_name: userName,
    });
  } catch (error) {
    // Activity logging should never break the main operation
  }
}
