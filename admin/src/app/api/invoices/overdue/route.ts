/**
 * Automatische Mahnungen fuer ueberfaellige Rechnungen
 * POST: Prueft alle "sent" Rechnungen, setzt ueberfaellige auf "overdue" und sendet Mahnung per E-Mail
 * Kann per n8n Cron oder manuell aufgerufen werden
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import nodemailer from 'nodemailer';

export const POST = createHandler({ auth: true }, async () => {
  const today = new Date().toISOString().split('T')[0];

  // Finde alle gesendeten Rechnungen die ueberfaellig sind
  const { data: overdue, error } = await db
    .from('invoices')
    .select('id, invoice_number, client_name, client_email, total, due_date, status')
    .eq('status', 'sent')
    .lt('due_date', today);

  if (error) throw new DatabaseError(error.message);

  if (!overdue || overdue.length === 0) {
    return { processed: 0, message: 'Keine ueberfaelligen Rechnungen' };
  }

  let reminded = 0;
  let failed = 0;

  // SMTP Transporter
  const transporter = (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    : null;

  // Company info aus Settings laden
  const { data: settingsRows } = await db
    .from('admin_settings')
    .select('key, value')
    .in('key', ['company', 'bankInfo']);

  const settings: Record<string, any> = {};
  (settingsRows || []).forEach((row: any) => {
    try { settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value; } catch { settings[row.key] = row.value; }
  });

  const companyName = settings.company?.name || 'AgentFlowMarketing';
  const iban = settings.bankInfo?.iban || '';

  for (const inv of overdue) {
    try {
      // Status auf overdue setzen
      await db.from('invoices').update({
        status: 'overdue',
        updated_at: new Date().toISOString(),
      }).eq('id', inv.id);

      // Notification erstellen
      await db.from('notifications').insert({
        title: 'Rechnung ueberfaellig',
        message: `${inv.invoice_number}: ${Number(inv.total).toLocaleString('de-DE')} EUR von ${inv.client_name} - faellig seit ${new Date(inv.due_date).toLocaleDateString('de-DE')}`,
        type: 'warning',
        link: '/invoices',
        read: false,
      });

      // Mahnung per E-Mail senden
      if (transporter && inv.client_email) {
        const daysPast = Math.floor((Date.now() - new Date(inv.due_date).getTime()) / 86400000);

        await transporter.sendMail({
          from: `"${companyName}" <${process.env.SMTP_USER}>`,
          to: inv.client_email,
          subject: `Zahlungserinnerung: ${inv.invoice_number} - ${companyName}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #eee;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="color:#FC682C;font-size:24px;margin:0;">${companyName}</h1>
            </div>
            <p>Hallo ${inv.client_name},</p>
            <p>wir erlauben uns Sie freundlich daran zu erinnern, dass die folgende Rechnung seit <strong>${daysPast} Tagen</strong> ueberfaellig ist:</p>
            <div style="background:#f9f9f9;border-radius:12px;padding:24px;margin:24px 0;border-left:4px solid #FC682C;">
              <p style="margin:0 0 8px;font-size:14px;color:#666;">Rechnung ${inv.invoice_number}</p>
              <p style="margin:0;font-size:28px;font-weight:bold;color:#1a1a2e;">${Number(inv.total).toFixed(2)} EUR</p>
              <p style="margin:8px 0 0;font-size:14px;color:#dc2626;">Faellig seit: ${new Date(inv.due_date).toLocaleDateString('de-DE')}</p>
            </div>
            ${iban ? `<div style="background:#f0f7ff;padding:16px;border-radius:8px;margin:16px 0;">
              <strong>Bankverbindung:</strong><br>
              ${companyName}<br>
              IBAN: ${iban}<br>
              Verwendungszweck: ${inv.invoice_number}
            </div>` : ''}
            <p>Bitte ueberweisen Sie den Betrag innerhalb der naechsten 5 Werktage. Sollte sich diese Nachricht mit Ihrer Zahlung ueberschneiden, betrachten Sie sie als gegenstandslos.</p>
            <p>Bei Fragen stehen wir Ihnen gerne zur Verfuegung.</p>
            <p>Mit freundlichen Gruessen,<br><strong>${companyName}</strong></p>
          </div>`,
        });
      }

      reminded++;
    } catch {
      failed++;
    }
  }

  return {
    processed: overdue.length,
    reminded,
    failed,
    message: `${reminded} Mahnungen versendet${failed > 0 ? `, ${failed} fehlgeschlagen` : ''}`,
  };
});
