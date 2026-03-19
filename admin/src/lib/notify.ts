/**
 * ═══════════════════════════════════════════════════════════════
 *                    NOTIFICATION HELPER
 * ═══════════════════════════════════════════════════════════════
 *
 * Centralized helper to create notifications with the correct
 * column name ("read" not "is_read") and consistent format.
 *
 * Usage:
 * ```ts
 * import { notify } from '@/lib/notify';
 *
 * await notify('Neuer Lead', 'Max Müller hat eine Anfrage gesendet', 'info', '/leads/123');
 * ```
 */

import { db } from '@/lib/db';

export async function notify(
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string | null
): Promise<void> {
  try {
    await db.from('notifications').insert({
      title,
      message,
      type,
      link: link ?? null,
      read: false,
    });
  } catch (error) {
    // Notification creation should never break the main operation
    console.error('[Notify] Failed to create notification:', error);
  }
}
