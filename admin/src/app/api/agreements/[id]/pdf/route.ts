import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const { data: agreement, error } = await db
    .from('agreements')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !agreement) {
    return Response.json({ success: false, error: 'Agreement not found' }, { status: 404 });
  }

  const html = generateAgreementHTML(agreement);
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

function generateAgreementHTML(agreement: Record<string, unknown>): string {
  const issueDate = new Date(agreement.issue_date as string).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
  
  const services = (agreement.services as string[]) || [];
  const servicesHTML = services.length > 0 
    ? `<ul>${services.map(s => `<li>${s}</li>`).join('')}</ul>`
    : '<p>Individuelle Projektleistungen nach Absprache</p>';

  const amount = parseFloat(agreement.amount as string) || 0;
  const taxRate = parseFloat(agreement.tax_rate as string) || 19;
  const taxAmount = parseFloat(agreement.tax_amount as string) || 0;
  const totalAmount = parseFloat(agreement.total_amount as string) || 0;

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Projektvereinbarung | ${agreement.client_name} × AgentFlowMarketing</title>
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
      .no-print { display: none; }
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
    
    .section {
      margin: 35px 0;
    }
    
    .section h3 {
      font-size: 16px;
      font-weight: 700;
      color: #f97316;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #fee2d1;
    }
    
    .section p {
      margin-bottom: 12px;
    }
    
    .section ul {
      margin: 15px 0 15px 25px;
    }
    
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
    
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f97316;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    .print-btn:hover { background: #ea580c; }
  </style>
</head>
<body>
  <button class="print-btn no-print" onclick="window.print()">PDF Drucken</button>
  
  <div class="page">
    <div class="header">
      <div class="logo">
        <h1>AgentFlowMarketing</h1>
        <p>KI-gestützte Marketing-Automatisierung</p>
      </div>
      <div class="doc-info">
        <strong>Projektvereinbarung</strong>
        ${issueDate}
      </div>
    </div>
    
    <div class="title">
      <h2>Projektvereinbarung</h2>
      <p>${agreement.project_title || 'Projektvereinbarung'}</p>
    </div>
    
    <div class="parties">
      <div class="party">
        <h3>Auftraggeber</h3>
        <strong>${agreement.client_name}</strong>
        ${agreement.client_company ? `<p>${agreement.client_company}</p>` : ''}
        ${agreement.client_address ? `<p>${agreement.client_address}</p>` : ''}
        ${agreement.client_email ? `<p>${agreement.client_email}</p>` : ''}
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
      <h3>1. Leistungen</h3>
      ${agreement.project_description ? `<p>${agreement.project_description}</p>` : ''}
      ${servicesHTML}
      
      ${agreement.portal_code ? `
      <div class="portal-box">
        <strong>Portal-Zugang:</strong> portal-agentflowm.de/login → Code: <code>${agreement.portal_code}</code>
      </div>
      ` : ''}
    </div>
    
    <div class="section">
      <h3>2. Investition</h3>
      
      <div class="price-box">
        <div class="amount">${amount.toLocaleString('de-DE')} € netto</div>
        <div class="note">zzgl. ${taxRate}% MwSt. = ${totalAmount.toLocaleString('de-DE')} € brutto</div>
      </div>
      
      <p><strong>Zahlungsbedingungen:</strong> ${agreement.payment_terms || '100% bei Vertragsstart'}</p>
    </div>
    
    ${agreement.project_duration ? `
    <div class="section">
      <h3>3. Zeitraum</h3>
      <p><strong>Projektdauer:</strong> ${agreement.project_duration}</p>
      <p>Nach Abschluss des Projekts endet diese Vereinbarung automatisch. Änderungen oder Erweiterungen werden gesondert besprochen.</p>
    </div>
    ` : ''}
    
    <div class="section">
      <h3>${agreement.project_duration ? '4' : '3'}. Hinweise</h3>
      <p>Wir geben alles, um die besten Ergebnisse zu liefern — aber konkrete Zusagen können wir nicht machen, da der Erfolg auch von externen Faktoren abhängt.</p>
      <p>Bei Fragen sind wir innerhalb von 24 Stunden erreichbar.</p>
    </div>
    
    <div class="signatures">
      <div class="sig">
        <h4>Auftraggeber</h4>
        <div class="sig-line">
          Berlin, ______________
          <span>Datum, Unterschrift (${agreement.client_name})</span>
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
      AgentFlowMarketing × ${agreement.client_company || agreement.client_name} | Projektvereinbarung ${new Date().getFullYear()}
    </div>
  </div>
</body>
</html>`;
}
