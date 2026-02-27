import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    // Format items for email
    const itemsHtml = invoice.invoice_items
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${item.unit_price.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">€${item.total.toFixed(2)}</td>
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
          .cta-button { display: inline-block; background: #FF6B35; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 40px; }
          .bank-info { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">AgentFlowMarketing</div>
          </div>
          
          <p>Hallo ${invoice.client_name},</p>
          
          ${message ? `<p>${message}</p>` : `<p>anbei finden Sie Ihre Rechnung für unsere Zusammenarbeit.</p>`}
          
          <div class="invoice-box">
            <div class="invoice-number">Rechnung ${invoice.invoice_number}</div>
            <div class="amount">€${invoice.total.toFixed(2)}</div>
            <div class="due-date">Fällig bis: ${new Date(invoice.due_date).toLocaleDateString("de-DE")}</div>
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
                <td style="text-align: right;">€${invoice.subtotal.toFixed(2)}</td>
              </tr>
              ${invoice.discount_amount > 0 ? `
              <tr>
                <td colspan="3">Rabatt (${invoice.discount_percent}%)</td>
                <td style="text-align: right;">-€${invoice.discount_amount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr>
                <td colspan="3">MwSt. (${invoice.tax_rate}%)</td>
                <td style="text-align: right;">€${invoice.tax_amount.toFixed(2)}</td>
              </tr>
              <tr class="grand-total">
                <td colspan="3"><strong>Gesamtbetrag</strong></td>
                <td style="text-align: right;"><strong>€${invoice.total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="bank-info">
            <strong>Bankverbindung:</strong><br>
            AgentFlowMarketing<br>
            IBAN: DE89 3704 0044 0532 0130 00<br>
            BIC: COBADEFFXXX<br>
            Verwendungszweck: ${invoice.invoice_number}
          </div>
          
          ${invoice.notes ? `<p><strong>Hinweise:</strong> ${invoice.notes}</p>` : ''}
          
          <p>Bei Fragen stehe ich Ihnen gerne zur Verfügung.</p>
          
          <p>Mit freundlichen Grüßen,<br>
          <strong>Mo Sul</strong><br>
          AgentFlowMarketing</p>
          
          <div class="footer">
            <p>AgentFlowMarketing | Achillesstraße 69A, 13125 Berlin<br>
            kontakt@agentflowm.com | +49 179 949 8247</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // TODO: Send actual email via Resend/SendGrid/etc
    // For now, we'll just update the status
    console.log(`Would send invoice ${invoice.invoice_number} to ${recipientEmail}`);

    // Update invoice status to sent
    const { data: updatedInvoice, error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${recipientEmail}`,
      invoice: updatedInvoice,
      // email_html: emailHtml, // Uncomment for debugging
    });
  } catch (error: any) {
    console.error("Error sending invoice:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
