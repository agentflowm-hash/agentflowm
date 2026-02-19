/**
 * Invoice Generator for AgentFlowMarketing
 * Generates professional PDF invoices matching the brand design
 */

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  
  // Customer
  customer: {
    name: string;
    company?: string;
    address: string;
    zip: string;
    city: string;
    country?: string;
    email?: string;
  };
  
  // Items
  items: {
    description: string;
    details?: string[];
    quantity: number;
    unitPrice: number;
  }[];
  
  // Pricing
  subtotal: number;
  discount?: {
    description: string;
    amount: number;
  };
  vatRate: number; // e.g., 19
  vatAmount: number;
  total: number;
  
  // Payment
  paymentMethod?: string;
  paymentStatus?: "paid" | "pending" | "overdue";
  paidDate?: string;
  stripeSessionId?: string;
  
  // Notes
  notes?: string;
}

export interface InvoiceTemplateData extends InvoiceData {
  // Company info (AgentFlowMarketing)
  company: {
    name: string;
    address: string;
    zip: string;
    city: string;
    email: string;
    website: string;
    phone?: string;
    taxId?: string;
  };
}

// Generate invoice number
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `AFM-${year}${month}-${random}`;
}

// Format currency for German locale
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date for German locale
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

// Company defaults
export const AGENTFLOW_COMPANY = {
  name: "AgentFlowMarketing",
  address: "Achillesstraße 69A",
  zip: "13125",
  city: "Berlin",
  country: "Deutschland",
  email: "info@agentflowm.de",
  website: "www.agentflowm.de",
  phone: "+49 179 949 8247",
  taxId: "", // Add if needed
  bankName: "Bank",
  iban: "", // Add if needed
  bic: "", // Add if needed
};

// Generate HTML invoice template
export function generateInvoiceHTML(data: InvoiceTemplateData): string {
  const statusBadge = data.paymentStatus === "paid" 
    ? '<span style="background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">BEZAHLT</span>'
    : data.paymentStatus === "overdue"
    ? '<span style="background: #ef4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">ÜBERFÄLLIG</span>'
    : '<span style="background: #f59e0b; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">OFFEN</span>';

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rechnung ${data.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background: #fff;
    }
    .invoice {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #FC682C;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
    }
    .logo-text span {
      color: #FC682C;
    }
    .invoice-title {
      text-align: right;
    }
    .invoice-title h1 {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    .invoice-meta {
      color: #666;
      font-size: 14px;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .party {
      flex: 1;
    }
    .party-label {
      font-size: 12px;
      color: #FC682C;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    .party-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .party-details {
      color: #666;
      font-size: 14px;
    }
    .summary-box {
      background: linear-gradient(135deg, #FC682C 0%, #ff8f5c 100%);
      color: white;
      padding: 24px 32px;
      border-radius: 12px;
      margin-bottom: 40px;
    }
    .summary-box h2 {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .summary-box .amount {
      font-size: 36px;
      font-weight: 700;
    }
    .summary-box .vat-note {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .items-table th {
      text-align: left;
      padding: 12px 16px;
      background: #f5f5f5;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
    }
    .items-table th:last-child {
      text-align: right;
    }
    .items-table td {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }
    .items-table td:last-child {
      text-align: right;
      font-weight: 600;
    }
    .item-description {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .item-details {
      font-size: 13px;
      color: #666;
    }
    .item-details li {
      margin-left: 16px;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-row.subtotal {
      border-bottom: 1px solid #eee;
    }
    .total-row.discount {
      color: #22c55e;
    }
    .total-row.grand-total {
      font-size: 18px;
      font-weight: 700;
      border-top: 2px solid #1a1a1a;
      padding-top: 12px;
      margin-top: 8px;
    }
    .payment-info {
      background: #f9f9f9;
      padding: 24px;
      border-radius: 8px;
      margin-top: 40px;
    }
    .payment-info h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .payment-info p {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #888;
    }
    .status-badge {
      display: inline-block;
      margin-left: 12px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .invoice { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="invoice">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <svg class="logo-icon" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 42V20C8 10 16 2 26 2C36 2 44 10 44 20V42" stroke="#1a1a1a" stroke-width="4" stroke-linecap="round"/>
          <circle cx="19" cy="28" r="6" fill="#FC682C"/>
          <circle cx="33" cy="28" r="6" fill="#FC682C"/>
        </svg>
        <div class="logo-text">Agent<span>Flow</span></div>
      </div>
      <div class="invoice-title">
        <h1>RECHNUNG ${statusBadge}</h1>
        <div class="invoice-meta">
          <div>Nr. ${data.invoiceNumber}</div>
          <div>Datum: ${formatDate(data.invoiceDate)}</div>
          ${data.dueDate ? `<div>Fällig: ${formatDate(data.dueDate)}</div>` : ""}
        </div>
      </div>
    </div>

    <!-- Parties -->
    <div class="parties">
      <div class="party">
        <div class="party-label">Rechnungsempfänger</div>
        <div class="party-name">${data.customer.name}</div>
        <div class="party-details">
          ${data.customer.company ? `${data.customer.company}<br>` : ""}
          ${data.customer.address}<br>
          ${data.customer.zip} ${data.customer.city}
          ${data.customer.country ? `<br>${data.customer.country}` : ""}
        </div>
      </div>
      <div class="party" style="text-align: right;">
        <div class="party-label">Rechnungssteller</div>
        <div class="party-name">${data.company.name}</div>
        <div class="party-details">
          ${data.company.address}<br>
          ${data.company.zip} ${data.company.city}<br>
          ${data.company.email}
        </div>
      </div>
    </div>

    <!-- Summary Box -->
    <div class="summary-box">
      <h2>Gesamtbetrag</h2>
      <div class="amount">${formatCurrency(data.total)}</div>
      <div class="vat-note">inkl. ${data.vatRate}% MwSt. (${formatCurrency(data.vatAmount)})</div>
    </div>

    <!-- Items -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Beschreibung</th>
          <th>Menge</th>
          <th>Betrag</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>
              <div class="item-description">${item.description}</div>
              ${item.details ? `
                <ul class="item-details">
                  ${item.details.map(d => `<li>${d}</li>`).join("")}
                </ul>
              ` : ""}
            </td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice * item.quantity)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="total-row subtotal">
        <span>Zwischensumme (netto)</span>
        <span>${formatCurrency(data.subtotal)}</span>
      </div>
      ${data.discount ? `
        <div class="total-row discount">
          <span>${data.discount.description}</span>
          <span>-${formatCurrency(data.discount.amount)}</span>
        </div>
      ` : ""}
      <div class="total-row">
        <span>MwSt. ${data.vatRate}%</span>
        <span>${formatCurrency(data.vatAmount)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Gesamt</span>
        <span>${formatCurrency(data.total)}</span>
      </div>
    </div>

    <!-- Payment Info -->
    <div class="payment-info">
      <h3>Zahlungsinformationen</h3>
      ${data.paymentStatus === "paid" ? `
        <p><strong>✓ Bezahlt am ${data.paidDate ? formatDate(data.paidDate) : formatDate(new Date())}</strong></p>
        ${data.paymentMethod ? `<p>Zahlungsart: ${data.paymentMethod}</p>` : ""}
      ` : `
        <p>Bitte überweisen Sie den Betrag innerhalb von 14 Tagen.</p>
        <p>Bei Fragen: ${data.company.email}</p>
      `}
      ${data.notes ? `<p style="margin-top: 12px;">${data.notes}</p>` : ""}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div>
        ${data.company.name} · ${data.company.address} · ${data.company.zip} ${data.company.city}
      </div>
      <div>
        ${data.company.website}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: InvoiceData["items"], vatRate: number = 19, discount?: number) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const afterDiscount = discount ? subtotal - discount : subtotal;
  const vatAmount = afterDiscount * (vatRate / 100);
  const total = afterDiscount + vatAmount;
  
  return {
    subtotal,
    vatRate,
    vatAmount,
    total,
  };
}
