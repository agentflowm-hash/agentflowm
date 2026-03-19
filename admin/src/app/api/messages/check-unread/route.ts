/**
 * ═══════════════════════════════════════════════════════════════
 *                    CHECK UNREAD CLIENT MESSAGES
 * ═══════════════════════════════════════════════════════════════
 *
 * GET /api/messages/check-unread
 * Checks for new unread client messages and creates notifications.
 * Called periodically by the dashboard polling mechanism.
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

export const GET = createHandler({
  auth: true,
}, async () => {
  // Find unread client messages that don't have a notification yet
  // We check messages from last 24h to avoid duplicate notifications
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: unreadMessages, error } = await db
    .from('portal_messages')
    .select(`
      id,
      project_id,
      sender_name,
      message,
      created_at,
      portal_projects (
        id,
        name,
        client_id,
        portal_clients (
          id,
          name
        )
      )
    `)
    .eq('sender_type', 'client')
    .eq('is_read', false)
    .gte('created_at', oneDayAgo)
    .order('created_at', { ascending: false });

  if (error) throw new DatabaseError(error.message);

  const messages = unreadMessages || [];

  // Check which messages already have notifications (by checking existing notifications with matching titles)
  const { data: existingNotifs } = await db
    .from('notifications')
    .select('message')
    .gte('created_at', oneDayAgo)
    .like('title', '%Neue Nachricht%');

  const existingMessages = new Set(
    (existingNotifs || []).map((n: any) => n.message)
  );

  // Create notifications for new unread messages
  let created = 0;
  for (const msg of messages) {
    const project = (msg as any).portal_projects;
    const client = project?.portal_clients;
    const clientName = client?.name || msg.sender_name || 'Kunde';
    const projectName = project?.name || 'Projekt';

    const notifMessage = `${clientName} in "${projectName}": ${msg.message.slice(0, 80)}${msg.message.length > 80 ? '...' : ''}`;

    // Skip if notification already exists for this message
    if (existingMessages.has(notifMessage)) continue;

    await db.from('notifications').insert({
      title: 'Neue Nachricht vom Kunden',
      message: notifMessage,
      type: 'info',
      link: `/clients`,
      read: false,
    });
    created++;
  }

  return {
    unreadCount: messages.length,
    notificationsCreated: created,
  };
});
