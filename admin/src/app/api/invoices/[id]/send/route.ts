import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// SMTP Transporter (same as other email routes)
function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// POST: Send invoice via email
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = parseInt(params.id);
    const body = await request.json();
    const { email_override, message } = body;

    // Get invoice
    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(`*, invoice_items (*)`)
      .eq("id", invoiceId)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const recipientEmail = email_override || invoice.client_email;

    if (!recipientEmail) {
      return NextResponse.json({ error: "Keine E-Mail-Adresse vorhanden" }, { status: 400 });
    }

    // Load company settings from DB for dynamic bank info / contact
    const { data: settingsRows } = await supabase
      .from("admin_settings")
      .select("key, value")
      .in("key", ["company", "bankInfo"]);

    const settings: Record<string, any> = {};
    (settingsRows || []).forEach((row: any) => {
      try { settings[row.key] = typeof row.value === "string" ? JSON.parse(row.value) : row.value; } catch { settings[row.key] = row.value; }
    });

    const company = settings.company || {};
    const bank = settings.bankInfo || {};
    const companyName = company.name || "AgentFlowMarketing";
    const companyEmail = company.email || process.env.SMTP_USER || "kontakt@agentflowm.de";
    const companyPhone = company.phone || "";
    const companyAddress = company.address || "";
    const bankName = bank.bankName || companyName;
    const iban = bank.iban || "";
    const bic = bank.bic || "";

    // Format items for email
    const itemsHtml = (invoice.invoice_items || [])
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${Number(item.unit_price).toFixed(2)} EUR</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${Number(item.total).toFixed(2)} EUR</td>
        </tr>
      `
      )
      .join("");

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #FF6B35; }
          .invoice-box { background: #f9f9f9; border-radius: 12px; padding: 30px; margin: 20px 0; }
          .invoice-number { font-size: 14px; color: #666; }
          .amount { font-size: 32px; font-weight: bold; color: #1a1a1a; margin: 20px 0; }
          .due-date { color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { text-align: left; padding: 12px; background: #f5f5f5; font-weight: 600; }
          .totals { background: #fafafa; }
          .totals td { padding: 8px 12px; }
          .grand-total { font-size: 18px; font-weight: bold; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; }
          .bank-info { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">${companyName}</div>
          </div>

          <p>Hallo ${invoice.client_name},</p>

          ${message ? `<p>${message}</p>` : `<p>anbei finden Sie Ihre ${invoice.type === 'offer' ? 'Angebot' : 'Rechnung'} fuer unsere Zusammenarbeit.</p>`}

          <div class="invoice-box">
            <div class="invoice-number">${invoice.type === 'offer' ? 'Angebot' : 'Rechnung'} ${invoice.invoice_number}</div>
            <div class="amount">${Number(invoice.total).toFixed(2)} EUR</div>
            <div class="due-date">Faellig bis: ${new Date(invoice.due_date).toLocaleDateString("de-DE")}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Beschreibung</th>
                <th style="text-align: right;">Menge</th>
                <th style="text-align: right;">Einzelpreis</th>
                <th style="text-align: right;">Gesamt</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot class="totals">
              <tr>
                <td colspan="3">Zwischensumme</td>
                <td style="text-align: right;">${Number(invoice.subtotal).toFixed(2)} EUR</td>
              </tr>
              ${invoice.discount_amount > 0 ? `
              <tr>
                <td colspan="3">Rabatt (${invoice.discount_percent}%)</td>
                <td style="text-align: right;">-${Number(invoice.discount_amount).toFixed(2)} EUR</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3">MwSt. (${invoice.tax_rate}%)</td>
                <td style="text-align: right;">${Number(invoice.tax_amount).toFixed(2)} EUR</td>
              </tr>
              <tr class="grand-total">
                <td colspan="3"><strong>Gesamtbetrag</strong></td>
                <td style="text-align: right;"><strong>${Number(invoice.total).toFixed(2)} EUR</strong></td>
              </tr>
            </tfoot>
          </table>

          ${iban ? `
          <div class="bank-info">
            <strong>Bankverbindung:</strong><br>
            ${bankName}<br>
            IBAN: ${iban}<br>
            ${bic ? `BIC: ${bic}<br>` : ''}
            Verwendungszweck: ${invoice.invoice_number}
          </div>
          ` : ''}

          ${invoice.notes ? `<p><strong>Hinweise:</strong> ${invoice.notes}</p>` : ''}

          <p>Bei Fragen stehe ich Ihnen gerne zur Verfuegung.</p>

          <p>Mit freundlichen Gruessen,<br>
          <strong>${companyName}</strong></p>

          <div class="footer">
            <p>${companyName}${companyAddress ? ` | ${companyAddress}` : ''}<br>
            ${companyEmail}${companyPhone ? ` | ${companyPhone}` : ''}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Actually send the email via SMTP
    const transporter = getTransporter();

    if (!transporter) {
      return NextResponse.json({ error: "SMTP nicht konfiguriert. Bitte SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local setzen." }, { status: 500 });
    }

    // PDF als Attachment generieren (optional, Fehler blockiert nicht)
    let pdfAttachment: { filename: string; content: Buffer }[] = [];
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://admin.agentflowm.de';
      const pdfRes = await fetch(`${baseUrl}/api/invoices/${invoiceId}/pdf`);
      if (pdfRes.ok) {
        const pdfBuffer = Buffer.from(await pdfRes.arrayBuffer());
        pdfAttachment = [{ filename: `${invoice.invoice_number}.pdf`, content: pdfBuffer }];
      }
    } catch {
      // PDF-Generierung fehlgeschlagen, sende ohne Attachment
    }

    await transporter.sendMail({
      from: `"${companyName}" <${process.env.SMTP_USER || companyEmail}>`,
      to: recipientEmail,
      subject: `${invoice.type === 'offer' ? 'Angebot' : 'Rechnung'} ${invoice.invoice_number} - ${companyName}`,
      html: emailHtml,
      attachments: pdfAttachment,
    });

    // Update invoice status to sent
    const { data: updatedInvoice, error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `${invoice.type === 'offer' ? 'Angebot' : 'Rechnung'} per E-Mail an ${recipientEmail} gesendet`,
      invoice: updatedInvoice,
    });
  } catch (error: any) {
    return NextResponse.json({ error: `E-Mail-Versand fehlgeschlagen: ${error.message}` }, { status: 500 });
  }
}
