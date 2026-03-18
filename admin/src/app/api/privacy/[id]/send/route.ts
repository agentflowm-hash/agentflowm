/**
 * Send privacy document to client via email
 */
import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';
import nodemailer from 'nodemailer';

export const POST = createHandler({ auth: true }, async (data: any, _ctx, request) => {
  const id = request.nextUrl.pathname.split('/')[3];
  const { to_email, to_name, message } = data;

  if (!to_email) throw new DatabaseError('E-Mail-Adresse erforderlich');

  // Get document
  const { data: doc } = await db.from('privacy_documents').select('*').eq('id', id).single();
  if (!doc) throw new DatabaseError('Dokument nicht gefunden');

  // Get company info
  const { data: settings } = await db.from('admin_settings').select('value').eq('key', 'company').single();
  const company = settings?.value || {};

  if (!process.env.SMTP_HOST) throw new DatabaseError('SMTP nicht konfiguriert');

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const CATEGORY_LABELS: Record<string, string> = {
    datenschutz: 'Datenschutzerklärung', impressum: 'Impressum', avv: 'Auftragsverarbeitungsvertrag',
    loeschkonzept: 'Löschkonzept', tom: 'Technische & Organisatorische Maßnahmen',
    einwilligung: 'Einwilligungsformular', other: 'Dokument',
  };

  const docLabel = CATEGORY_LABELS[doc.category] || doc.title;
  const firstName = (to_name || '').split(' ')[0] || 'Sehr geehrte Damen und Herren';
  const companyName = company.name || 'AgentFlowMarketing';
  const companyAddr = company.address || 'Achillesstraße 69A, 13125 Berlin';
  const companyEmail = company.email || 'kontakt@agentflowm.de';
  const companyPhone = company.phone || '+49 179 949 8247';
  const datum = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  // Replace placeholders in content
  const processedContent = doc.content
    .replace(/\{\{KUNDENNAME\}\}/g, to_name || '[Name]')
    .replace(/\{\{KUNDENFIRMA\}\}/g, '')
    .replace(/\{\{DATUM\}\}/g, datum)
    .replace(/\n/g, '<br>');

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Roboto,-apple-system,BlinkMacSystemFont,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
<tr><td align="center">
<table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

  <!-- Orange Top Bar -->
  <tr><td style="height:5px;background:#FC682C;"></td></tr>

  <!-- Header -->
  <tr><td style="padding:32px 40px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <h1 style="margin:0;font-size:22px;color:#1a1a2e;font-weight:700;">Agent<span style="color:#FC682C;font-style:italic;">Flow</span>Marketing</h1>
          <p style="margin:4px 0 0;color:#999;font-size:12px;">KI-gestützte Marketing-Automatisierung</p>
        </td>
        <td style="text-align:right;">
          <p style="margin:0;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:1px;">${docLabel}</p>
          <p style="margin:4px 0 0;color:#1a1a2e;font-size:13px;">${datum}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #eee;"></div></td></tr>

  <!-- Parties -->
  <tr><td style="padding:24px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="width:50%;vertical-align:top;">
          <p style="margin:0 0 8px;color:#FC682C;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Empfänger</p>
          <p style="margin:0;color:#1a1a2e;font-size:15px;font-weight:600;">${to_name || ''}</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <p style="margin:0 0 8px;color:#FC682C;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Absender</p>
          <p style="margin:0;color:#1a1a2e;font-size:15px;font-weight:600;">${companyName}</p>
          <p style="margin:4px 0 0;color:#666;font-size:12px;line-height:1.5;">${companyAddr}<br>${companyEmail}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Message (if any) -->
  ${message ? `
  <tr><td style="padding:0 40px 16px;">
    <div style="padding:16px 20px;background:#FFF7ED;border-left:3px solid #FC682C;border-radius:0 8px 8px 0;">
      <p style="margin:0;color:#92400e;font-size:13px;line-height:1.6;">${message}</p>
    </div>
  </td></tr>` : ''}

  <!-- Divider -->
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #eee;"></div></td></tr>

  <!-- Document Title -->
  <tr><td style="padding:24px 40px 8px;">
    <p style="margin:0;color:#FC682C;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Dokument</p>
  </td></tr>

  <!-- Document Content -->
  <tr><td style="padding:8px 40px 32px;">
    <div style="color:#333;font-size:13px;line-height:1.8;">${processedContent}</div>
  </td></tr>

  <!-- Version Footer -->
  <tr><td style="padding:0 40px;"><div style="border-top:1px solid #eee;"></div></td></tr>
  <tr><td style="padding:16px 40px;">
    <p style="margin:0;color:#bbb;font-size:11px;">Version ${doc.version} &middot; Stand: ${new Date(doc.updated_at).toLocaleDateString('de-DE')}</p>
  </td></tr>

  <!-- Company Footer -->
  <tr><td style="padding:20px 40px;background:#f9fafb;border-top:1px solid #eee;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td>
          <p style="margin:0;color:#999;font-size:11px;">${companyName}</p>
          <p style="margin:2px 0 0;color:#bbb;font-size:10px;">${companyAddr}</p>
        </td>
        <td style="text-align:right;">
          <p style="margin:0;color:#bbb;font-size:10px;">${companyEmail} &middot; ${companyPhone}</p>
          ${company.taxId ? `<p style="margin:2px 0 0;color:#bbb;font-size:10px;">St.-Nr.: ${company.taxId}</p>` : ''}
          ${company.iban ? `<p style="margin:2px 0 0;color:#bbb;font-size:10px;">IBAN: ${company.iban}</p>` : ''}
        </td>
      </tr>
    </table>
  </td></tr>

</table>
</td></tr></table></body></html>`;

  await transporter.sendMail({
    from: `${company.name || 'AgentFlowMarketing'} <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
    to: to_email,
    subject: `${docLabel} — ${company.name || 'AgentFlowMarketing'}`,
    html,
  });

  // Track sent
  const sentTo = doc.sent_to || [];
  if (!sentTo.includes(to_email)) sentTo.push(to_email);
  await db.from('privacy_documents').update({ sent_to: sentTo, last_sent_at: new Date().toISOString() }).eq('id', id);

  return { success: true, sent_to: to_email };
});
