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
  const firstName = (to_name || '').split(' ')[0] || 'Hallo';

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0F19;padding:40px 20px;"><tr><td align="center">
<table width="650" cellpadding="0" cellspacing="0" style="background:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr><td style="padding:32px 40px;background:linear-gradient(135deg,rgba(252,104,44,0.15),transparent);border-bottom:1px solid rgba(255,255,255,0.06);">
  <h1 style="margin:0;color:#ffffff;font-size:22px;">${docLabel}</h1>
  <p style="margin:4px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">${company.name || 'AgentFlowMarketing'}</p>
</td></tr>
<tr><td style="padding:32px 40px;">
  <p style="color:#ffffff;font-size:15px;">Hallo ${firstName},</p>
  ${message ? `<p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;">${message}</p>` : ''}
  <p style="color:rgba(255,255,255,0.6);font-size:14px;line-height:1.6;">anbei erhalten Sie das Dokument <strong style="color:#FC682C;">"${doc.title}"</strong>.</p>
  <div style="margin:24px 0;padding:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;">
    <div style="color:rgba(255,255,255,0.8);font-size:14px;line-height:1.8;white-space:pre-wrap;">${doc.content}</div>
  </div>
  <p style="color:rgba(255,255,255,0.4);font-size:12px;">Version ${doc.version} · Stand: ${new Date(doc.updated_at).toLocaleDateString('de-DE')}</p>
  <p style="color:rgba(255,255,255,0.5);font-size:14px;margin-top:24px;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
  <p style="color:rgba(255,255,255,0.5);font-size:14px;">Mit freundlichen Grüßen,<br><strong style="color:#ffffff;">${company.name || 'AgentFlowMarketing'}</strong></p>
  ${company.address ? `<p style="color:rgba(255,255,255,0.3);font-size:12px;margin-top:16px;">${company.address}</p>` : ''}
</td></tr>
<tr><td style="padding:16px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);">
  <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:0;text-align:center;">${company.name || 'AgentFlowMarketing'} · ${company.email || 'kontakt@agentflowm.de'}</p>
</td></tr>
</table></td></tr></table></body></html>`;

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
