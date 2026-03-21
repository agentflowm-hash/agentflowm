/**
 * ═══════════════════════════════════════════════════════════════
 *                    NOTIFICATION HELPER
 * ═══════════════════════════════════════════════════════════════
 *
 * Centralized helper to create notifications with the correct
 * column name ("read" not "is_read"), send webhook if configured,
 * and ensure consistent format.
 *
 * Usage:
 * ```ts
 * import { notify } from '@/lib/notify';
 *
 * await notify('Neuer Lead', 'Max Mueller hat eine Anfrage gesendet', 'info', '/leads/123');
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
    // 1. Create notification in DB
    await db.from('notifications').insert({
      title,
      message,
      type,
      link: link ?? null,
      read: false,
    });

    // 2. Fire webhook if configured
    fireWebhook(title, message, type, link).catch(() => {});
  } catch (error) {
    // Notification-Fehler soll nie die Hauptoperation blockieren
  }
}

/**
 * Sends a JSON POST to the configured webhook URL (if any).
 * Loaded from admin_settings where key='notifications'.
 */
async function fireWebhook(
  title: string,
  message: string,
  type: string,
  link?: string | null
): Promise<void> {
  try {
    const { data: row } = await db
      .from('admin_settings')
      .select('value')
      .eq('key', 'notifications')
      .single();

    const webhookUrl = row?.value?.webhookUrl;
    if (!webhookUrl) return;

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: type,
        title,
        message,
        link,
        timestamp: new Date().toISOString(),
        source: 'AgentFlowMarketing',
      }),
    });
  } catch {
    // Webhook failure should never block
  }
}
