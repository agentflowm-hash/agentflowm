// AgentFlowMarketing Contract Template Generator

interface ContractData {
  id: number;
  title: string;
  contract_type: string;
  party_name: string;
  party_email?: string;
  party_company?: string;
  content: string;
  status: string;
  valid_from?: string;
  valid_until?: string;
  monthly_amount?: number;
  notes?: string;
  created_at: string;
}

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  employment: 'Arbeitsvertrag',
  freelance: 'Freelancer-Vertrag',
  nda: 'Geheimhaltungsvereinbarung (NDA)',
  service: 'Dienstleistungsvertrag',
  other: 'Vertrag',
};

export function generateContractHTML(data: ContractData): string {
  const typeLabel = CONTRACT_TYPE_LABELS[data.contract_type] || 'Vertrag';

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateLong = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const issueDate = formatDateLong(data.created_at);
  const validFromText = data.valid_from ? formatDate(data.valid_from) : '—';
  const validUntilText = data.valid_until ? formatDate(data.valid_until) : 'unbefristet';
  const monthlyText = data.monthly_amount
    ? parseFloat(String(data.monthly_amount)).toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'
    : null;

  const contentHTML = data.content
    ? data.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
    : '<p><em>Vertragsinhalte werden ergänzt.</em></p>';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${typeLabel} — ${data.party_name} | AgentFlowMarketing</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.8;
      font-size: 11pt;
    }

    .page {
      max-width: 210mm;
      margin: 20px auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    @media print {
      body { background: white; }
      .page { margin: 0; box-shadow: none; max-width: 100%; }
      .no-print { display: none !important; }
    }

    .toolbar {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 100;
    }

    .toolbar button {
      background: #f97316;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      font-family: inherit;
    }
    .toolbar button:hover { background: #ea580c; }
    .toolbar button.secondary {
      background: #0f172a;
    }
    .toolbar button.secondary:hover { background: #1e293b; }

    .header-accent {
      height: 6px;
      background: linear-gradient(90deg, #f97316 0%, #fb923c 50%, #fdba74 100%);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 40px 50px 30px;
    }

    .logo h1 {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
    }
    .logo h1 span { color: #f97316; }
    .logo p { font-size: 11px; color: #64748b; margin-top: 4px; }

    .doc-badge { text-align: right; }
    .doc-badge .label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #94a3b8;
      font-weight: 500;
    }
    .doc-badge .type {
      font-size: 18px;
      font-weight: 700;
      color: #f97316;
      line-height: 1.3;
    }
    .doc-badge .date {
      font-size: 12px;
      color: #64748b;
      margin-top: 6px;
    }

    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 50px;
      padding: 25px 50px;
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
      margin-bottom: 10px;
    }

    .party-name {
      font-size: 15px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .party-details {
      font-size: 11px;
      color: #64748b;
      line-height: 1.7;
    }

    .meta-bar {
      display: flex;
      gap: 30px;
      padding: 18px 50px;
      background: #fff7ed;
      border-bottom: 1px solid #fed7aa;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-item .meta-label {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      font-weight: 500;
    }
    .meta-item .meta-value {
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
    }

    .content { padding: 35px 50px 20px; }

    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f97316;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #fee2d1;
    }

    .contract-body {
      font-size: 11pt;
      line-height: 1.9;
      color: #334155;
    }
    .contract-body p { margin-bottom: 14px; }

    .notes-section {
      margin: 25px 50px;
      padding: 20px;
      background: #f1f5f9;
      border-radius: 8px;
      border-left: 3px solid #94a3b8;
    }
    .notes-section h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .notes-section p {
      font-size: 11px;
      color: #475569;
      line-height: 1.7;
    }

    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 80px;
      margin: 60px 50px 30px;
    }

    .sig h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 50px;
    }

    .sig-line {
      border-top: 1px solid #0f172a;
      padding-top: 10px;
      font-size: 12px;
    }
    .sig-line span {
      display: block;
      color: #94a3b8;
      font-size: 10px;
      margin-top: 4px;
    }

    .footer {
      padding: 20px 50px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="toolbar no-print">
    <button onclick="window.print()">Als PDF speichern</button>
    <button class="secondary" onclick="window.close()">Schließen</button>
  </div>

  <div class="page">
    <div class="header-accent"></div>

    <div class="header">
      <div class="logo">
        <h1>Agent<span>Flow</span>Marketing</h1>
        <p>KI-gestützte Marketing-Automatisierung</p>
      </div>
      <div class="doc-badge">
        <div class="label">Vertrag</div>
        <div class="type">${typeLabel}</div>
        <div class="date">${issueDate}</div>
      </div>
    </div>

    <div class="parties">
      <div>
        <div class="party-label">Vertragspartner</div>
        <div class="party-name">${data.party_name}</div>
        <div class="party-details">
          ${data.party_company ? data.party_company + '<br>' : ''}
          ${data.party_email || ''}
        </div>
      </div>
      <div>
        <div class="party-label">Auftragnehmer</div>
        <div class="party-name">AgentFlowMarketing</div>
        <div class="party-details">
          M. Ashaer Al-Sayed<br>
          Achillesstraße 69A, 13125 Berlin<br>
          info@agentflowm.de
        </div>
      </div>
    </div>

    <div class="meta-bar">
      <div class="meta-item">
        <span class="meta-label">Vertragsart</span>
        <span class="meta-value">${typeLabel}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Gültig ab</span>
        <span class="meta-value">${validFromText}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Gültig bis</span>
        <span class="meta-value">${validUntilText}</span>
      </div>
      ${monthlyText ? `
      <div class="meta-item">
        <span class="meta-label">Monatl. Vergütung</span>
        <span class="meta-value">${monthlyText}</span>
      </div>
      ` : ''}
    </div>

    <div class="content">
      <div class="section-title">${data.title}</div>
      <div class="contract-body">
        <p>${contentHTML}</p>
      </div>
    </div>

    ${data.notes ? `
    <div class="notes-section">
      <h4>Interne Notizen</h4>
      <p>${data.notes.replace(/\n/g, '<br>')}</p>
    </div>
    ` : ''}

    <div class="signatures">
      <div class="sig">
        <h4>Vertragspartner</h4>
        <div class="sig-line">
          Berlin, ______________
          <span>Datum, Unterschrift (${data.party_name})</span>
        </div>
      </div>
      <div class="sig">
        <h4>AgentFlowMarketing</h4>
        <div class="sig-line">
          Berlin, ______________
          <span>Datum, Unterschrift (M. Ashaer Al-Sayed)</span>
        </div>
      </div>
    </div>

    <div class="footer">
      AgentFlowMarketing · Achillesstraße 69A, 13125 Berlin · info@agentflowm.de
    </div>
  </div>
</body>
</html>`;
}
