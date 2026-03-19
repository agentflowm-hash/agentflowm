// AgentFlowMarketing Privacy Document Template Generator

interface PrivacyDocData {
  id: number;
  title: string;
  description?: string;
  category: string;
  content: string;
  version: number;
  status: string;
  created_at: string;
  updated_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  datenschutz: 'Datenschutzerklärung',
  impressum: 'Impressum',
  avv: 'Auftragsverarbeitungsvertrag (AVV)',
  loeschkonzept: 'Löschkonzept',
  tom: 'Technische & Organisatorische Maßnahmen',
  einwilligung: 'Einwilligungserklärung',
  other: 'Dokument',
};

export function generatePrivacyDocHTML(data: PrivacyDocData): string {
  const categoryLabel = CATEGORY_LABELS[data.category] || data.category;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const contentHTML = data.content
    ? data.content
        .replace(/^## (.+)$/gm, '<h3 class="doc-h3">$1</h3>')
        .replace(/^### (.+)$/gm, '<h4 class="doc-h4">$1</h4>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
    : '<p><em>Kein Inhalt vorhanden.</em></p>';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} | AgentFlowMarketing</title>
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

    .doc-info { text-align: right; }
    .doc-info .category {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #94a3b8;
      font-weight: 500;
    }
    .doc-info .title {
      font-size: 16px;
      font-weight: 700;
      color: #f97316;
      margin-top: 4px;
    }
    .doc-info .meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
    }

    .title-section {
      padding: 25px 50px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
    }

    .title-section h2 {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }

    .title-section p {
      font-size: 12px;
      color: #64748b;
    }

    .content {
      padding: 35px 50px 40px;
    }

    .content p {
      margin-bottom: 14px;
      font-size: 11pt;
      color: #334155;
      line-height: 1.9;
    }

    .content h3.doc-h3 {
      font-size: 14px;
      font-weight: 700;
      color: #f97316;
      margin: 28px 0 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #fee2d1;
    }

    .content h4.doc-h4 {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
      margin: 20px 0 8px;
    }

    .content ul {
      margin: 10px 0 14px 25px;
    }

    .content li {
      margin-bottom: 6px;
      font-size: 11pt;
      color: #334155;
    }

    .provider-info {
      margin: 30px 50px;
      padding: 20px 25px;
      background: #0f172a;
      border-radius: 10px;
      color: white;
    }

    .provider-info h4 {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f97316;
      margin-bottom: 10px;
    }

    .provider-info p {
      font-size: 11px;
      line-height: 1.7;
      color: rgba(255,255,255,0.8);
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
      <div class="doc-info">
        <div class="category">${categoryLabel}</div>
        <div class="title">${data.title}</div>
        <div class="meta">Version ${data.version} · Stand: ${formatDate(data.updated_at || data.created_at)}</div>
      </div>
    </div>

    <div class="title-section">
      <h2>${data.title}</h2>
      ${data.description ? `<p>${data.description}</p>` : ''}
    </div>

    <div class="content">
      <p>${contentHTML}</p>
    </div>

    <div class="provider-info">
      <h4>Verantwortlicher / Anbieter</h4>
      <p>
        AgentFlowMarketing — M. Ashaer Al-Sayed<br>
        Achillesstraße 69A, 13125 Berlin<br>
        E-Mail: info@agentflowm.de
      </p>
    </div>

    <div class="footer">
      ${data.title} · Version ${data.version} · ${formatDate(data.updated_at || data.created_at)} · AgentFlowMarketing
    </div>
  </div>
</body>
</html>`;
}
