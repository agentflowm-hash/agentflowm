// AgentFlowMarketing Invoice Template Generator
// Exact replica of Mo's design

interface InvoiceData {
  document_type?: 'invoice' | 'offer';
  invoice_number: string;
  issue_date: string;
  due_date: string;
  
  // Client
  client_name: string;
  client_company?: string;
  client_address?: string;
  client_email?: string;
  
  // Items
  items: {
    title: string;
    description: string;
    amount: number;
  }[];
  
  // Totals
  subtotal: number;          // Summe aller Items
  discount_percent?: number; // Rabatt in %
  discount_amount?: number;  // Rabatt-Betrag
  net_after_discount: number; // Netto nach Rabatt
  tax_rate: number;
  tax_amount: number;
  total: number;
  
  // Payment
  payment_due: string; // "sofort" | "14 Tage" | "30 Tage"
  payment_terms?: string; // "50/50" | "70/30" | "100"
  notes?: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  const isOffer = data.document_type === 'offer';
  const docLabel = isOffer ? 'Angebot' : 'Rechnung';
  const senderLabel = isOffer ? 'Anbieter' : 'Rechnungssteller';
  const recipientLabel = isOffer ? 'Angebotsempfänger' : 'Rechnungsempfänger';
  const validLabel = isOffer ? 'Gültig bis' : 'Zahlungsziel';

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const itemsHTML = data.items.map(item => `
    <tr>
      <td>
        <div class="item-title">${item.title}</div>
        <div class="item-desc">${item.description.replace(/\n/g, '<br>')}</div>
      </td>
      <td>${formatCurrency(item.amount)}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docLabel} ${data.invoice_number} | AgentFlowMarketing</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.6;
      font-size: 11pt;
    }
    
    .page {
      max-width: 210mm;
      margin: 20px auto;
      padding: 0;
      background: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
    
    @media print {
      body { background: white; }
      .page { margin: 0; box-shadow: none; max-width: 100%; }
    }
    
    .header-accent {
      height: 8px;
      background: linear-gradient(90deg, #f97316 0%, #fb923c 50%, #fdba74 100%);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 40px 50px 30px;
    }
    
    .logo h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
    }
    
    .logo h1 span { color: #f97316; }
    
    .logo p { 
      font-size: 11px; 
      color: #64748b;
      margin-top: 4px;
      font-weight: 400;
    }
    
    .invoice-badge { text-align: right; }
    
    .invoice-badge .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #94a3b8;
      font-weight: 500;
    }
    
    .invoice-badge .number {
      font-size: 32px;
      font-weight: 700;
      color: #f97316;
      line-height: 1.2;
    }
    
    .invoice-badge .date {
      font-size: 13px;
      color: #64748b;
      margin-top: 8px;
    }
    
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      padding: 30px 50px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .party-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f97316;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .party-name {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 8px;
    }
    
    .party-details {
      font-size: 12px;
      color: #64748b;
      line-height: 1.8;
    }
    
    .content { padding: 40px 50px; }
    
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .invoice-table thead th {
      text-align: left;
      padding: 14px 0;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      font-weight: 500;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .invoice-table thead th:last-child { text-align: right; }
    
    .invoice-table tbody td {
      padding: 24px 0;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: top;
    }
    
    .invoice-table tbody td:last-child {
      text-align: right;
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
    }
    
    .item-title {
      font-weight: 600;
      font-size: 14px;
      color: #0f172a;
      margin-bottom: 6px;
    }
    
    .item-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    .totals { width: 280px; }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 13px;
      color: #64748b;
    }
    
    .totals-row.subtotal {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
    }
    
    .totals-row.grand-total {
      background: linear-gradient(90deg, #fff7ed 0%, #ffedd5 100%);
      margin: 15px -20px 0;
      padding: 18px 20px;
      border-radius: 8px;
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .totals-row.grand-total .amount { color: #f97316; }
    
    .payment-section {
      margin: 40px 50px;
      padding: 30px;
      background: #0f172a;
      border-radius: 12px;
      color: white;
    }
    
    .payment-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f97316;
      font-weight: 600;
      margin-bottom: 20px;
    }
    
    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .payment-item label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      display: block;
      margin-bottom: 6px;
    }
    
    .payment-item value {
      font-size: 14px;
      font-weight: 500;
      display: block;
    }
    
    .payment-item.iban value {
      font-family: 'SF Mono', 'Monaco', monospace;
      letter-spacing: 1px;
    }
    
    .due-badge {
      display: inline-block;
      background: #f97316;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 20px;
    }
    
    .footer {
      padding: 25px 50px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
    }
    
    .footer a {
      color: #f97316;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="page">
    
    <div class="header-accent"></div>
    
    <div class="header">
      <div class="logo">
        <h1>Agent<span>Flow</span>Marketing</h1>
        <p>KI-gestützte Marketing-Automatisierung</p>
      </div>
      <div class="invoice-badge">
        <div class="label">${docLabel}</div>
        <div class="number">#${data.invoice_number}</div>
        <div class="date">${formatDate(data.issue_date)}</div>
      </div>
    </div>
    
    <div class="parties">
      <div class="party">
        <div class="party-label">${recipientLabel}</div>
        <div class="party-name">${data.client_name}</div>
        <div class="party-details">
          ${data.client_company ? data.client_company + '<br>' : ''}
          ${data.client_address ? data.client_address.replace(/\n/g, '<br>') : ''}
        </div>
      </div>
      <div class="party">
        <div class="party-label">${senderLabel}</div>
        <div class="party-name">AgentFlowMarketing</div>
        <div class="party-details">
          Achillesstraße 69A<br>
          13125 Berlin<br>
          info@agentflowm.de
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="section-title">Leistungen</div>
      
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Beschreibung</th>
            <th>Betrag</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
      
      <div class="totals-wrapper">
        <div class="totals">
          <div class="totals-row subtotal">
            <span>Zwischensumme</span>
            <span>${formatCurrency(data.subtotal)}</span>
          </div>
          ${data.discount_percent && data.discount_amount ? `
          <div class="totals-row discount">
            <span>Rabatt ${data.discount_percent}%</span>
            <span style="color: #ef4444;">-${formatCurrency(data.discount_amount)}</span>
          </div>
          ` : ''}
          <div class="totals-row">
            <span>Nettobetrag</span>
            <span>${formatCurrency(data.net_after_discount)}</span>
          </div>
          <div class="totals-row">
            <span>MwSt. ${data.tax_rate}%</span>
            <span>${formatCurrency(data.tax_amount)}</span>
          </div>
          <div class="totals-row grand-total">
            <span>Gesamt</span>
            <span class="amount">${formatCurrency(data.total)}</span>
          </div>
        </div>
      </div>
    </div>
    
    ${isOffer ? `
    <div class="payment-section">
      <div class="payment-title">Zahlungsbedingungen</div>
      <div class="payment-grid">
        <div class="payment-item" style="grid-column: span 2;">
          <label>Zahlungsmodell</label>
          <value>${data.payment_terms === '50/50' ? '50% bei Auftragserteilung, 50% bei Projektabschluss'
            : data.payment_terms === '70/30' ? '70% bei Auftragserteilung, 30% bei Abgabe'
            : data.payment_terms === '100' ? '100% bei Auftragserteilung'
            : '50% bei Auftragserteilung, 50% bei Projektabschluss'}</value>
        </div>
      </div>
      <div class="due-badge">Angebot gültig ${data.payment_due}</div>
    </div>
    ` : `
    <div class="payment-section">
      <div class="payment-title">Zahlungsinformationen</div>
      <div class="payment-grid">
        <div class="payment-item">
          <label>Empfänger</label>
          <value>Mohammad Al-Sayed</value>
        </div>
        <div class="payment-item">
          <label>Verwendungszweck</label>
          <value>RE ${data.invoice_number}${data.client_company ? ' / ' + data.client_company : ''}</value>
        </div>
        <div class="payment-item iban" style="grid-column: span 2;">
          <label>IBAN</label>
          <value>DE93 1203 0000 1204 0856 49</value>
        </div>
      </div>
      <div class="due-badge">Zahlbar ${data.payment_due}</div>
    </div>
    `}
    
    <div class="footer">
      AgentFlowMarketing · Achillesstraße 69A, 13125 Berlin · <a href="mailto:info@agentflowm.de">info@agentflowm.de</a>
    </div>
    
  </div>
</body>
</html>`;
}

// Generate Agreement/Projektvereinbarung HTML
interface AgreementData {
  date: string;
  project_title: string;
  project_subtitle: string;
  
  // Client
  client_name: string;
  client_company?: string;
  client_address?: string;
  client_email?: string;
  
  // Services
  services: string[];
  
  // Portal
  portal_code?: string;
  
  // Pricing
  price_net: number;
  price_gross: number;
  payment_terms: string;
  
  // Timeline
  duration: string;
  
  // Notes
  notes?: string;
}

export function generateAgreementHTML(data: AgreementData): string {
  const formatCurrency = (amount: number) => 
    amount.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' €';
  
  const servicesHTML = data.services.map(s => `<li>${s}</li>`).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projektvereinbarung | ${data.client_name} × AgentFlowMarketing</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      line-height: 1.8;
      font-size: 12pt;
    }
    
    .page {
      max-width: 210mm;
      margin: 0 auto;
      padding: 30mm 30mm;
      background: white;
    }
    
    @media print {
      body { background: white; }
      .page { padding: 20mm; max-width: 100%; }
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 50px;
      padding-bottom: 20px;
      border-bottom: 3px solid #f97316;
    }
    
    .logo h1 {
      font-size: 26px;
      font-weight: 700;
      color: #f97316;
    }
    
    .logo p { font-size: 12px; color: #666; }
    
    .doc-info {
      text-align: right;
      font-size: 12px;
      color: #666;
    }
    
    .doc-info strong {
      display: block;
      font-size: 16px;
      color: #1a1a1a;
    }
    
    .title {
      text-align: center;
      margin: 50px 0 40px;
    }
    
    .title h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .title p { color: #666; font-size: 14px; }
    
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin: 40px 0;
      padding: 25px;
      background: #f9fafb;
      border-radius: 12px;
    }
    
    .party h3 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #f97316;
      margin-bottom: 12px;
    }
    
    .party strong {
      font-size: 16px;
      display: block;
      margin-bottom: 8px;
    }
    
    .party p { font-size: 12px; margin-bottom: 4px; }
    
    .section { margin: 35px 0; }
    
    .section h3 {
      font-size: 16px;
      font-weight: 700;
      color: #f97316;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #fee2d1;
    }
    
    .section p { margin-bottom: 12px; }
    
    .section ul { margin: 15px 0 15px 25px; }
    .section li { margin-bottom: 8px; }
    
    .price-box {
      background: #fff7ed;
      border: 2px solid #f97316;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      text-align: center;
    }
    
    .price-box .amount {
      font-size: 32px;
      font-weight: 700;
      color: #f97316;
    }
    
    .price-box .note {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    
    .portal-box {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
      color: white;
      padding: 20px 25px;
      border-radius: 12px;
      margin: 25px 0;
    }
    
    .portal-box strong { font-size: 14px; }
    .portal-box code {
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      margin-top: 80px;
    }
    
    .sig h4 {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 50px;
    }
    
    .sig-line {
      border-top: 1px solid #1a1a1a;
      padding-top: 10px;
      font-size: 12px;
    }
    
    .sig-line span {
      display: block;
      color: #666;
      font-size: 10px;
      margin-top: 4px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 10px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="page">
    
    <div class="header">
      <div class="logo">
        <h1>AgentFlowMarketing</h1>
        <p>KI-gestützte Marketing-Automatisierung</p>
      </div>
      <div class="doc-info">
        <strong>Projektvereinbarung</strong>
        ${data.date}
      </div>
    </div>
    
    <div class="title">
      <h2>${data.project_title}</h2>
      <p>${data.project_subtitle}</p>
    </div>
    
    <div class="parties">
      <div class="party">
        <h3>Auftraggeber</h3>
        <strong>${data.client_name}</strong>
        ${data.client_company ? `<p>${data.client_company}</p>` : ''}
        ${data.client_address ? `<p>${data.client_address}</p>` : ''}
        ${data.client_email ? `<p>${data.client_email}</p>` : ''}
      </div>
      <div class="party">
        <h3>Auftragnehmer</h3>
        <strong>AgentFlowMarketing</strong>
        <p>M. Ashaer Al-Sayed</p>
        <p>Achillesstraße 69A, 13125 Berlin</p>
        <p>info@agentflowmarketing.de</p>
      </div>
    </div>
    
    <div class="section">
      <h3>1. Was wir für dich machen</h3>
      <p>Wir bauen ein automatisiertes System für dein Projekt:</p>
      <ul>
        ${servicesHTML}
      </ul>
      
      ${data.portal_code ? `
      <div class="portal-box">
        <strong>Euer Portal-Zugang:</strong> portal-agentflowm.de/login &nbsp;→&nbsp; Code: <code>${data.portal_code}</code>
      </div>
      ` : ''}
    </div>
    
    <div class="section">
      <h3>2. Investition</h3>
      
      <div class="price-box">
        <div class="amount">${formatCurrency(data.price_net)} netto</div>
        <div class="note">zzgl. 19% MwSt. = ${formatCurrency(data.price_gross)} brutto</div>
      </div>
      
      <p><strong>Zahlungsbedingungen:</strong> ${data.payment_terms}</p>
    </div>
    
    <div class="section">
      <h3>3. Zeitraum</h3>
      <p><strong>Projektdauer:</strong> ${data.duration}</p>
      <p>Nach Abschluss des Projekts endet diese Vereinbarung automatisch. Änderungen oder Erweiterungen werden gesondert besprochen.</p>
    </div>
    
    <div class="section">
      <h3>4. Gut zu wissen</h3>
      ${data.notes ? `<p>${data.notes}</p>` : `
      <p>Wir geben alles, um die besten Ergebnisse zu liefern — aber konkrete Zusagen (z.B. "X Ergebnisse garantiert") können wir nicht machen, da der Erfolg auch von externen Faktoren abhängt.</p>
      <p>Bei Fragen sind wir innerhalb von 24 Stunden erreichbar.</p>
      `}
    </div>
    
    <div class="signatures">
      <div class="sig">
        <h4>Auftraggeber</h4>
        <div class="sig-line">
          Berlin, ______________
          <span>Datum, Unterschrift (${data.client_name})</span>
        </div>
      </div>
      <div class="sig">
        <h4>Auftragnehmer</h4>
        <div class="sig-line">
          Berlin, ______________
          <span>Datum, Unterschrift</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      AgentFlowMarketing × ${data.client_company || data.client_name} | Projektvereinbarung ${new Date().getFullYear()}
    </div>
    
  </div>
</body>
</html>`;
}
