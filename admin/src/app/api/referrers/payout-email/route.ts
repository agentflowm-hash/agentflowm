/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRER PAYOUT EMAIL
 * ═══════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

export async function POST(request: NextRequest) {
  try {
    const { referrer_name, referrer_email, commission_amount, deal_value, commission_rate, notes, internal } = await request.json();
    if (!internal) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!transporter) return NextResponse.json({ error: 'SMTP nicht konfiguriert' }, { status: 500 });

    const firstName = referrer_name.split(' ')[0];
    const amount = parseFloat(String(commission_amount)).toLocaleString('de-DE', { minimumFractionDigits: 2 });
    const deal = parseFloat(String(deal_value)).toLocaleString('de-DE', { minimumFractionDigits: 2 });

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F19;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <tr>
          <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(16,185,129,0.15),transparent);border-bottom:1px solid rgba(255,255,255,0.06);">
            <h1 style="margin:0;color:#10B981;font-size:24px;font-weight:700;">Deine Provision wurde ausgezahlt!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 40px;">
            <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0 0 20px;">Hallo ${firstName},</p>
            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 24px;">
              großartige Neuigkeiten! Deine Empfehlungsprovision wurde soeben überwiesen.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.04);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:rgba(255,255,255,0.5);font-size:13px;">Deal-Wert</td>
                      <td style="color:#ffffff;font-size:15px;text-align:right;font-weight:600;">${deal}€</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 24px;border-bottom:1px solid rgba(255,255,255,0.04);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:rgba(255,255,255,0.5);font-size:13px;">Provisions-Rate</td>
                      <td style="color:#ffffff;font-size:15px;text-align:right;font-weight:600;">${commission_rate}%</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 24px;background:rgba(16,185,129,0.08);">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#10B981;font-size:14px;font-weight:600;">Auszahlungsbetrag</td>
                      <td style="color:#10B981;font-size:22px;text-align:right;font-weight:800;">${amount}€</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            ${notes ? `<p style="color:rgba(255,255,255,0.5);font-size:13px;margin:16px 0 0;"><em>Notiz: ${notes}</em></p>` : ''}

            <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:24px 0 0;">
              Vielen Dank für deine Empfehlung! Wir freuen uns auf weitere Zusammenarbeit.
            </p>
            <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:24px 0 0;">
              Beste Grüße,<br><strong style="color:#ffffff;">Das AgentFlowMarketing Team</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);">
            <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;text-align:center;">
              AgentFlowMarketing &bull; Achillesstraße 69A, 13125 Berlin &bull; kontakt@agentflowm.de
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `AgentFlowMarketing <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
      to: referrer_email,
      subject: `Deine Provision von ${amount}€ wurde ausgezahlt!`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payout email error:', error);
    return NextResponse.json({ error: 'Email Fehler' }, { status: 500 });
  }
}
