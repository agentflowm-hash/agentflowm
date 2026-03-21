/**
 * ═══════════════════════════════════════════════════════════════
 *                    REFERRER THANK-YOU EMAIL
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
    const { referrer_name, referrer_email, lead_name, internal } = await request.json();

    if (!internal) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!transporter) {
      return NextResponse.json({ error: 'SMTP nicht konfiguriert' }, { status: 500 });
    }

    const firstName = referrer_name.split(' ')[0];

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0B0F19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F19;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111827;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;background:linear-gradient(135deg,rgba(252,104,44,0.15),transparent);border-bottom:1px solid rgba(255,255,255,0.06);">
              <h1 style="margin:0;color:#FC682C;font-size:24px;font-weight:700;">Danke für deine Empfehlung!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#ffffff;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Hallo ${firstName},
              </p>
              <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 20px;">
                vielen Dank, dass du <strong style="color:#ffffff;">${lead_name}</strong> an uns empfohlen hast! Wir wissen dein Vertrauen sehr zu schätzen.
              </p>
              <div style="background:rgba(252,104,44,0.1);border:1px solid rgba(252,104,44,0.2);border-radius:12px;padding:20px;margin:24px 0;">
                <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:0 0 8px;">Was passiert als Nächstes?</p>
                <p style="color:#ffffff;font-size:15px;line-height:1.6;margin:0;">
                  Unser Team wird sich zeitnah mit ${lead_name} in Verbindung setzen. Sobald ein Projekt zustande kommt, erhältst du automatisch deine <strong style="color:#FC682C;">10% Empfehlungsprovision</strong>.
                </p>
              </div>
              <p style="color:rgba(255,255,255,0.7);font-size:15px;line-height:1.6;margin:0 0 20px;">
                Du kannst jederzeit weitere Empfehlungen aussprechen — je mehr, desto besser! 🚀
              </p>
              <p style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.6;margin:24px 0 0;">
                Beste Grüße,<br>
                <strong style="color:#ffffff;">Das AgentFlowMarketing Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);">
              <p style="color:rgba(255,255,255,0.3);font-size:12px;margin:0;text-align:center;">
                AgentFlowMarketing • Achillesstraße 69A, 13125 Berlin • kontakt@agentflowm.de
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `AgentFlowMarketing <${process.env.EMAIL_FROM || 'kontakt@agentflowm.de'}>`,
      to: referrer_email,
      subject: `Danke für deine Empfehlung, ${firstName}! 🙏`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Email konnte nicht gesendet werden' }, { status: 500 });
  }
}
