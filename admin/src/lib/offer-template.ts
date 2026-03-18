// AgentFlowMarketing — Angebots-Template Generator
// Basierend auf den originalen Start/Business Paket PDFs

interface OfferData {
  offer_number: string;
  issue_date: string;
  valid_until: string;

  // Client
  client_name: string;
  client_company?: string;
  client_email?: string;

  // Package
  package_name: string;
  package_subtitle: string;
  package_description: string;
  badges: string[]; // z.B. ["Top SEO", "1-2 Wochen", "NDA möglich"]

  // Leistungen
  services: { title: string; description: string }[];

  // Ablauf
  steps: { title: string; subtitle: string }[];
  timeline: string; // z.B. "1-2 Wochen"

  // Investment
  price_net: number;
  tax_rate: number;
  payment_terms: string; // "50/50" | "70/30" | "100"

  // Optionals
  notes?: string;
  kurzueberblick?: string;
  ausgangslage?: string[];
  zielbild?: string[];
}

export function generateOfferHTML(data: OfferData): string {
  const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const formatDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });

  const taxAmount = Math.round(data.price_net * data.tax_rate) / 100;
  const priceGross = data.price_net + taxAmount;
  const anzahlung = data.payment_terms === '70/30' ? Math.round(priceGross * 0.7 * 100) / 100 : data.payment_terms === '100' ? priceGross : Math.round(priceGross * 0.5 * 100) / 100;
  const rest = priceGross - anzahlung;
  const anzahlungPct = data.payment_terms === '70/30' ? 70 : data.payment_terms === '100' ? 100 : 50;
  const restPct = 100 - anzahlungPct;

  const badgesHTML = data.badges.map(b => `<span class="badge">${b}</span>`).join('');

  const servicesHTML = data.services.map(s => `
    <div class="service-item">
      <div class="service-check">&#10003;</div>
      <div>
        <div class="service-title">${s.title}</div>
        ${s.description ? `<div class="service-desc">${s.description}</div>` : ''}
      </div>
    </div>`).join('');

  const stepsHTML = data.steps.map((s, i) => `
    <div class="step">
      <div class="step-num">${i + 1}</div>
      <div class="step-label">${s.title}</div>
      ${s.subtitle ? `<div class="step-sub">${s.subtitle}</div>` : ''}
    </div>`).join('');

  const ausgangsHTML = (data.ausgangslage || []).map(a => `
    <div class="problem-item"><span class="problem-icon">!</span> ${a}</div>`).join('');

  const zielHTML = (data.zielbild || []).map(z => `
    <div class="goal-item"><span class="goal-check">&#10003;</span> ${z}</div>`).join('');

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angebot ${data.offer_number} | AgentFlowMarketing</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #e0e0e0; background: #0a0a0f; }
    .page { max-width: 800px; margin: 0 auto; padding: 48px 56px; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
    .logo { font-size: 20px; font-weight: 800; color: #fff; }
    .logo span { color: #FC682C; font-style: italic; }
    .logo-sub { font-size: 11px; color: #666; margin-top: 2px; }
    .offer-badge { text-align: right; }
    .offer-badge .label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #888; font-weight: 600; }
    .offer-badge .number { font-size: 24px; font-weight: 900; color: #fff; }
    .offer-badge .date { font-size: 12px; color: #666; }

    /* Package Title */
    .package-header { margin-bottom: 36px; }
    .package-name { font-size: 42px; font-weight: 900; line-height: 1.1; color: #fff; }
    .package-name em { color: #FC682C; font-style: normal; }
    .package-subtitle { font-size: 18px; color: #FC682C; margin-top: 8px; font-weight: 500; }
    .package-desc { font-size: 14px; color: #888; margin-top: 12px; line-height: 1.7; }

    /* Client Info */
    .client-bar { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1px; background: #222; border-radius: 12px; overflow: hidden; margin: 32px 0; }
    .client-field { background: #151520; padding: 18px 22px; }
    .client-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; font-weight: 600; margin-bottom: 6px; }
    .client-value { font-size: 14px; font-weight: 700; color: #fff; }

    /* Badges */
    .badges { display: flex; flex-wrap: wrap; gap: 8px; margin: 28px 0 36px; }
    .badge { padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1.5px solid rgba(252,104,44,0.4); color: #FC682C; background: rgba(252,104,44,0.08); }

    /* Divider */
    .divider { height: 1px; background: #1a1a25; margin: 32px 0; }

    /* Section Headers */
    .section { margin: 36px 0 16px; }
    .section-title { font-size: 18px; font-weight: 800; color: #fff; padding-bottom: 12px; border-bottom: 1px solid #1a1a25; }

    /* Kurzueberblick */
    .kurzueberblick { font-size: 13px; color: #999; line-height: 1.8; margin-bottom: 24px; }

    /* Ausgangslage */
    .problems { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
    .problem-item { padding: 14px 18px; background: #151520; border-radius: 10px; font-size: 12px; color: #aaa; line-height: 1.6; border: 1px solid #1a1a25; }
    .problem-icon { color: #ef4444; font-weight: 700; margin-right: 8px; }

    /* Quote */
    .quote { padding: 18px 24px; border-left: 4px solid #FC682C; background: #151520; margin: 24px 0; font-size: 14px; font-weight: 700; font-style: italic; color: #fff; }

    /* Zielbild */
    .goals { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .goal-item { padding: 12px 18px; background: #151520; border-radius: 10px; font-size: 12px; color: #ccc; border: 1px solid #1a1a25; }
    .goal-check { color: #FC682C; font-weight: 700; margin-right: 10px; }

    /* Services */
    .services-list { display: flex; flex-direction: column; gap: 4px; }
    .service-item { display: flex; gap: 14px; padding: 14px 18px; background: #151520; border-radius: 10px; align-items: flex-start; border: 1px solid #1a1a25; }
    .service-check { color: #FC682C; font-weight: 700; font-size: 14px; margin-top: 1px; flex-shrink: 0; }
    .service-title { font-size: 13px; font-weight: 700; color: #fff; }
    .service-desc { font-size: 11px; color: #777; margin-top: 3px; }

    /* Steps */
    .steps { display: flex; gap: 8px; margin: 16px 0; }
    .step { flex: 1; text-align: center; padding: 20px 8px; background: #151520; border-radius: 12px; border: 1px solid #1a1a25; }
    .step-num { width: 30px; height: 30px; border-radius: 50%; background: #FC682C; color: #fff; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
    .step-label { font-size: 11px; font-weight: 600; color: #fff; }
    .step-sub { font-size: 10px; color: #666; }
    .timeline { text-align: center; font-size: 13px; color: #888; margin-top: 16px; }
    .timeline strong { color: #FC682C; }

    /* Investment */
    .investment-box { background: linear-gradient(135deg, #1a1a2e, #151520); border-radius: 16px; padding: 36px; color: #fff; margin: 28px 0; border: 1px solid #252535; }
    .inv-label { text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 12px; }
    .inv-price { text-align: center; font-size: 52px; font-weight: 900; color: #fff; }
    .inv-price em { color: #FC682C; font-style: italic; font-size: 24px; font-weight: 600; }
    .inv-gross { text-align: center; font-size: 13px; color: #666; margin-top: 6px; }
    .inv-split { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); border-radius: 12px; overflow: hidden; margin-top: 28px; }
    .inv-split-item { background: rgba(255,255,255,0.03); padding: 22px; text-align: center; }
    .inv-split-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #666; margin-bottom: 10px; }
    .inv-split-value { font-size: 24px; font-weight: 800; color: #fff; }
    .inv-split-sub { font-size: 10px; color: #555; margin-top: 6px; }

    /* Code Uebergabe */
    .code-box { padding: 22px; background: #151520; border-radius: 12px; border: 1px solid #1a1a25; margin: 20px 0; }
    .code-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px; }
    .code-desc { font-size: 12px; color: #888; line-height: 1.6; }
    .code-points { margin-top: 10px; }
    .code-points div { font-size: 11px; color: #777; padding: 3px 0; }
    .code-points div::before { content: "\\2192 "; color: #FC682C; }

    /* Rahmenbedingungen */
    .conditions { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
    .condition-box { padding: 18px; border-radius: 12px; border: 1px solid #1a1a25; background: #151520; }
    .condition-title { font-size: 13px; font-weight: 700; color: #fff; margin-bottom: 10px; }
    .condition-list { font-size: 11px; color: #888; line-height: 2; }
    .condition-list div::before { content: "\\2022 "; color: #FC682C; }

    /* Annahme - Light mode for print */
    .acceptance { background: #fff; border-radius: 12px; border-left: 4px solid #FC682C; padding: 36px; margin: 36px 0; page-break-inside: avoid; }
    .acceptance-title { font-size: 20px; font-weight: 800; color: #FC682C; margin-bottom: 4px; }
    .acceptance-sub { font-size: 12px; color: #888; margin-bottom: 24px; }
    .acceptance-text { font-size: 12px; color: #555; line-height: 1.7; padding: 14px 18px; background: #f5f5f5; border-radius: 8px; margin-bottom: 28px; }
    .acceptance-text strong { color: #1a1a2e; }
    .fields { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .field-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; font-weight: 600; margin-bottom: 10px; }
    .field-line { border-bottom: 1px solid #ccc; height: 28px; }
    .sig-area { border: 2px dashed #ddd; border-radius: 12px; padding: 28px; min-height: 100px; display: flex; align-items: flex-end; justify-content: space-between; margin-top: 12px; }
    .sig-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #bbb; }

    /* Footer */
    .footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #555; padding-top: 24px; border-top: 1px solid #1a1a25; margin-top: 40px; }
    .footer-left { }
    .footer-left strong { color: #fff; }
    .footer-left span { color: #FC682C; }
    .footer-right { text-align: right; color: #666; }
    .footer-note { text-align: center; font-size: 10px; color: #FC682C; font-style: italic; margin-bottom: 12px; }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 32px 40px; }
      .investment-box { -webkit-print-color-adjust: exact; }
      .acceptance { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo">Agent<span>Flow</span>Marketing</div>
        <div class="logo-sub">Digitale Systeme für Wachstum</div>
      </div>
      <div class="offer-badge">
        <div class="label">Angebot</div>
        <div class="number">#${data.offer_number}</div>
        <div class="date">${formatDate(data.issue_date)}</div>
      </div>
    </div>

    <!-- Package Header -->
    <div class="package-header">
      <div class="package-name"><em>${data.package_name.split(' ')[0]}</em> ${data.package_name.split(' ').slice(1).join(' ')}</div>
      <div class="package-subtitle">${data.package_subtitle}</div>
      <div class="package-desc">${data.package_description}</div>
    </div>

    <!-- Client Info -->
    <div class="client-bar">
      <div class="client-field">
        <div class="client-label">Kunde</div>
        <div class="client-value">${data.client_name}</div>
      </div>
      <div class="client-field">
        <div class="client-label">Unternehmen</div>
        <div class="client-value">${data.client_company || '—'}</div>
      </div>
      <div class="client-field">
        <div class="client-label">Gültig bis</div>
        <div class="client-value">${formatDate(data.valid_until)}</div>
      </div>
    </div>

    <!-- Badges -->
    <div class="badges">${badgesHTML}</div>

    ${data.kurzueberblick ? `
    <!-- Kurzüberblick -->
    <div class="section"><div class="section-title">Kurzüberblick</div></div>
    <div class="kurzueberblick">${data.kurzueberblick}</div>
    ` : ''}

    ${data.ausgangslage && data.ausgangslage.length > 0 ? `
    <!-- Ausgangslage -->
    <div class="section"><div class="section-title">Ausgangslage</div></div>
    <div class="problems">${ausgangsHTML}</div>
    <div class="quote">Wenn Struktur fehlt, entsteht Stress. Wenn Struktur steht, werden Ergebnisse planbar.</div>
    ` : ''}

    ${data.zielbild && data.zielbild.length > 0 ? `
    <!-- Zielbild -->
    <div class="section"><div class="section-title">Zielbild</div></div>
    <div class="goals">${zielHTML}</div>
    ` : ''}

    <!-- Leistungsumfang -->
    <div class="section"><div class="section-title">Leistungsumfang</div></div>
    <div class="services-list">${servicesHTML}</div>

    <!-- Code-Übergabe -->
    <div class="code-box">
      <div class="code-title">Code-Übergabe — 100% Eigentum</div>
      <div class="code-desc">Sie erhalten nach Projektabschluss den vollständigen Projekt-Code.</div>
      <div class="code-points">
        <div>Vollständiger Code-Stand (Projektstruktur, Komponenten, Seiten)</div>
        <div>Dokumentierter Übergabe-Stand</div>
        <div>Eigentum/Nutzungsrechte gemäß Angebot</div>
      </div>
    </div>

    <!-- Ablauf -->
    <div class="section"><div class="section-title">Projektablauf</div></div>
    <div class="steps">${stepsHTML}</div>
    <div class="timeline">Zeitrahmen: <strong>${data.timeline}</strong> ab Projektstart</div>

    <!-- Investment -->
    <div class="section"><div class="section-title">Investment</div></div>
    <div class="investment-box">
      <div class="inv-label">${data.package_name} — Gesamtpreis</div>
      <div class="inv-price">${fmtInt(data.price_net)} <em>€ netto</em></div>
      <div class="inv-gross">${fmt(priceGross)} € brutto (inkl. ${data.tax_rate}% MwSt.)</div>
      ${data.payment_terms !== '100' ? `
      <div class="inv-split">
        <div class="inv-split-item">
          <div class="inv-split-label">Anzahlung bei Beauftragung</div>
          <div class="inv-split-value">${fmt(anzahlung)} €</div>
          <div class="inv-split-sub">${anzahlungPct}% des Bruttobetrags</div>
        </div>
        <div class="inv-split-item">
          <div class="inv-split-label">Restbetrag</div>
          <div class="inv-split-value">${fmt(rest)} €</div>
          <div class="inv-split-sub">${restPct}% bei ${data.payment_terms === '70/30' ? 'Abgabe' : 'Projektabschluss'}</div>
        </div>
      </div>
      ` : `
      <div style="text-align:center;margin-top:16px;font-size:13px;color:#888;">100% bei Auftragserteilung</div>
      `}
    </div>

    <!-- Rahmenbedingungen -->
    <div class="conditions">
      <div class="condition-box">
        <div class="condition-title">Rahmenbedingungen</div>
        <div class="condition-list">
          <div>Alle Preise netto zzgl. ${data.tax_rate}% USt.</div>
          <div>Hosting & Domain separat (ca. 10-30 €/Monat)</div>
          <div>Unbegrenzte Korrekturschleifen inklusive</div>
          <div>Angebot gültig bis ${formatDate(data.valid_until)}</div>
        </div>
      </div>
      <div class="condition-box">
        <div class="condition-title">Vertraulichkeit</div>
        <div class="condition-list">
          <div>NDA auf Wunsch möglich</div>
          <div>Konzepte & Code vertraulich</div>
          <div>Servicegebühr für Integrationen: ab 490 €</div>
        </div>
      </div>
    </div>

    <!-- Annahme -->
    <div class="acceptance">
      <div class="acceptance-title">Annahme des Angebots</div>
      <div class="acceptance-sub">Bitte ausfüllen und unterschrieben an kontakt@agentflowm.de senden.</div>
      <div class="acceptance-text">
        <strong>Ich nehme das Angebot an</strong> und bestätige die genannten Konditionen, Leistungen und Zahlungsbedingungen.
        Nach Erhalt der Anzahlung (${anzahlungPct}%) wird der Projektstart verbindlich reserviert.
      </div>
      <div class="fields">
        <div><div class="field-label">Vollständiger Name</div><div class="field-line"></div></div>
        <div><div class="field-label">Unternehmen</div><div class="field-line"></div></div>
        <div><div class="field-label">E-Mail Adresse</div><div class="field-line"></div></div>
        <div><div class="field-label">Projektstart</div><div class="field-line"></div></div>
      </div>
      <div class="field-label">Unterschrift & Datum</div>
      <div class="sig-area">
        <div style="flex:1;border-bottom:1px solid #ccc;margin-right:24px;padding-bottom:4px;"><div class="sig-label">Unterschrift</div></div>
        <div style="width:140px;border-bottom:1px solid #ccc;padding-bottom:4px;"><div class="sig-label">Datum</div></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-note">Dieses Dokument ist ein Angebot. Die finalen Details werden im Projektvertrag festgehalten. ${data.offer_number}</div>
    <div class="footer">
      <div class="footer-left">
        <strong>Agent<span>Flow</span>Marketing</strong><br>
        Digitale Systeme für Wachstum
      </div>
      <div class="footer-right">
        kontakt@agentflowm.de<br>
        Achillesstraße 69A, 13125 Berlin<br>
        www.agentflowm.de
      </div>
    </div>

  </div>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════
//                    PAKET-VORLAGEN
// ═══════════════════════════════════════════════════════════════

export const PACKAGE_TEMPLATES: Record<string, Partial<OfferData>> = {
  "START Website": {
    package_name: "Start Paket",
    package_subtitle: "Website als System",
    package_description: "Klare Struktur nach außen, geordnete Abläufe nach innen - damit Anfragen zu Gesprächen werden.",
    badges: ["Top SEO inklusive", "1-2 Wochen Umsetzung", "Saubere Übergabe", "NDA möglich"],
    kurzueberblick: "Dieses Angebot richtet sich an Selbstständige und Unternehmen, die eine Website brauchen, die Besucher führt - statt nur gut auszusehen. Ziel ist ein klarer Ablauf vom ersten Eindruck bis zur Kontaktaufnahme.",
    ausgangslage: [
      "Anfragen ohne Führung: Interessenten finden keinen klaren nächsten Schritt.",
      "Zu viel Handarbeit: Manuelles Nachfassen kostet Zeit und erzeugt Fehler.",
      "Übergaben hängen: Informationen verteilt, Zuständigkeiten unklar.",
      "Keine Übersicht: Probleme werden zu spät bemerkt.",
    ],
    zielbild: [
      "Besucher verstehen in Sekunden Angebot + nächsten Schritt.",
      "Kontakt- und Terminfluss ist klar aufgebaut.",
      "Technik ist live-ready: sauber, schnell, stabil.",
      "Grundlage für spätere Erweiterungen ist vorbereitet.",
    ],
    services: [
      { title: "Landingpage + 2 Unterseiten", description: "Insgesamt 3 perfekt optimierte Seiten" },
      { title: "Individuelles Design", description: "Im AgentFlowMarketing Look" },
      { title: "Copy & Struktur", description: "Besucherführung bis Kontakt" },
      { title: "Top SEO inklusive", description: "Struktur, Meta, interne Logik" },
      { title: "Performance- & Mobil-Check", description: "Optimiert für alle Geräte" },
      { title: "Admin-Portal", description: "Zur Pflege der Inhalte" },
      { title: "Go-live & saubere Übergabe", description: "Vollständiger Code-Stand" },
    ],
    steps: [
      { title: "Analyse", subtitle: "& Klarheit" },
      { title: "Struktur", subtitle: "& Architektur" },
      { title: "Umsetzung", subtitle: "& Tests" },
      { title: "Go-live", subtitle: "& Übergabe" },
    ],
    timeline: "1-2 Wochen",
  },
  "BUSINESS Website": {
    package_name: "BUSINESS Paket",
    package_subtitle: "Website + Admin + Portale",
    package_description: "Für Unternehmen, die Wachstum wollen - mit Kontrolle, Übersicht und internen Bereichen. Das komplette System aus einer Hand.",
    badges: ["High-Quality SEO", "3-4 Wochen", "Admin-Portal", "Kundenportal", "NDA möglich"],
    kurzueberblick: 'Sie haben kein "Website-Problem" - Sie haben ein System-Problem: Anfragen kommen rein, aber der Ablauf bremst. Übergaben hängen, Zuständigkeiten sind unklar, interne Bereiche fehlen - und dadurch verliert man Zeit, Qualität und Umsatz. Mit dem Business Paket bauen wir ein tragfähiges System: Website + Admin + Portale.',
    ausgangslage: [
      "Besucher sehen Inhalte - aber der nächste Schritt ist nicht eindeutig.",
      'Anfragen/Leads werden "verteilt", statt zentral geführt.',
      "Intern fehlt Struktur: Freigaben, Uploads, Status, Aufgaben.",
      "Ohne Portale entsteht Rückfragen-Chaos statt klarer Abläufe.",
    ],
    zielbild: [
      "Eine Website, die klar führt (Verstehen → Vertrauen → Anfrage/Termin)",
      "Ein System, das Übersicht & Kontrolle schafft (Leads, Inhalte, Rollen)",
      "Interne Bereiche, die Prozesse effizient machen und mitwachsen",
    ],
    services: [
      { title: "Landingpage + 8 Unterseiten", description: "Bis zu 9 perfekt optimierte Seiten für Ihren Webauftritt" },
      { title: "High-Quality SEO + Performance", description: "Erweiterte Suchmaschinenoptimierung für maximale Sichtbarkeit" },
      { title: "Live-ready Setup + Betriebsstart", description: "Technisch sauber mit vollständiger Betriebsbereitschaft" },
      { title: "Admin-Portal (erweitert)", description: "Umfangreiche Verwaltung für Inhalte und Anfragen" },
      { title: "Kundenportal", description: "Freigaben, Uploads, Status, Dokumente - projektabhängig" },
      { title: "Mitarbeiterportal", description: "Aufgaben, Zuständigkeiten, interne Bereiche" },
    ],
    steps: [
      { title: "Strategie", subtitle: "Call" },
      { title: "Konzeption", subtitle: "& Flows" },
      { title: "Design", subtitle: "UI/UX" },
      { title: "Entwicklung", subtitle: "& Portale" },
      { title: "Testing", subtitle: "& QA" },
      { title: "Go-Live", subtitle: "& Einweisung" },
    ],
    timeline: "3-4 Wochen",
  },
  "ONE PAGE": {
    package_name: "ONE PAGE",
    package_subtitle: "Kompakte Präsenz",
    package_description: "Eine modern gestaltete Einzelseite mit allen wichtigen Informationen - perfekt für den schnellen Start.",
    badges: ["SEO-Grundlagen", "3-5 Werktage", "Mobile-First", "NDA möglich"],
    services: [
      { title: "One-Page Website", description: "Scroll-basiertes Design mit allen Sektionen" },
      { title: "Responsives Design", description: "Optimiert für Desktop, Tablet & Mobil" },
      { title: "Kontaktformular", description: "Direkte Anfragen-Erfassung" },
      { title: "SEO-Grundlagen", description: "Meta-Tags, Struktur, Performance" },
      { title: "SSL-Zertifikat", description: "Sichere Verbindung inklusive" },
    ],
    steps: [
      { title: "Briefing", subtitle: "" },
      { title: "Design", subtitle: "" },
      { title: "Umsetzung", subtitle: "" },
      { title: "Go-live", subtitle: "" },
    ],
    timeline: "3-5 Werktage",
  },
  "Web App": {
    package_name: "Web App",
    package_subtitle: "Maßgeschneiderte Applikation",
    package_description: "Individuelle Web-Applikation mit Benutzer-Authentifizierung, Datenbank und Admin-Dashboard für Ihre Geschäftsprozesse.",
    badges: ["Full-Stack", "6-10 Wochen", "REST-API", "Cloud-Hosting", "NDA möglich"],
    services: [
      { title: "Benutzer-Authentifizierung", description: "Login, Registrierung, Rollenmanagement" },
      { title: "Datenbank-Integration", description: "PostgreSQL mit optimierter Struktur" },
      { title: "Admin-Dashboard", description: "Vollständige Verwaltungsoberfläche" },
      { title: "REST-API", description: "Saubere Schnittstellen für alle Funktionen" },
      { title: "Responsives Frontend", description: "React/Next.js mit modernem UI" },
      { title: "Cloud-Hosting Setup", description: "Deployment und Konfiguration" },
    ],
    steps: [
      { title: "Analyse", subtitle: "& Planung" },
      { title: "Architektur", subtitle: "& DB-Design" },
      { title: "Frontend", subtitle: "& UI/UX" },
      { title: "Backend", subtitle: "& API" },
      { title: "Testing", subtitle: "& QA" },
      { title: "Deployment", subtitle: "& Launch" },
    ],
    timeline: "6-10 Wochen",
  },
  "Mobile App": {
    package_name: "Mobile App",
    package_subtitle: "iOS & Android App",
    package_description: "Native Mobile App für beide Plattformen mit Push-Benachrichtigungen, Offline-Funktionalität und App Store Veröffentlichung.",
    badges: ["iOS + Android", "10-16 Wochen", "Push-Notifications", "App Store", "NDA"],
    services: [
      { title: "iOS & Android App", description: "Native Performance auf beiden Plattformen" },
      { title: "Push-Benachrichtigungen", description: "Echtzeit-Kommunikation mit Nutzern" },
      { title: "Offline-Funktionalität", description: "App funktioniert auch ohne Internet" },
      { title: "Backend-API", description: "Sichere Server-Kommunikation" },
      { title: "Admin-Panel", description: "Inhalte und Nutzer verwalten" },
      { title: "App Store Veröffentlichung", description: "Apple App Store + Google Play Store" },
      { title: "90 Tage Support", description: "Nachbetreuung und Bugfixes" },
    ],
    steps: [
      { title: "Konzept", subtitle: "& Wireframes" },
      { title: "UI/UX", subtitle: "Design" },
      { title: "Entwicklung", subtitle: "iOS + Android" },
      { title: "Backend", subtitle: "& API" },
      { title: "Testing", subtitle: "& QA" },
      { title: "Store", subtitle: "Submission" },
    ],
    timeline: "10-16 Wochen",
  },
  "AI-Agenten": {
    package_name: "AI-Agenten Paket",
    package_subtitle: "KI-gestützte Automatisierung",
    package_description: "Individuelle AI-Agenten für E-Mail, Chat, Vertrieb oder Analyse - inklusive Training, Integration und Dashboard.",
    badges: ["KI-gestützt", "4-6 Wochen", "API-Integration", "Dashboard"],
    services: [
      { title: "AI-Agenten Entwicklung", description: "Maßgeschneiderte KI für Ihre Prozesse" },
      { title: "Training & Feintuning", description: "Auf Ihre Daten und Workflows trainiert" },
      { title: "API-Integration", description: "Nahtlose Anbindung an bestehende Systeme" },
      { title: "Dashboard & Monitoring", description: "Übersicht über alle Agenten-Aktivitäten" },
      { title: "Laufende Optimierung", description: "Regelmäßige Verbesserung der Ergebnisse" },
    ],
    steps: [
      { title: "Analyse", subtitle: "& Use Cases" },
      { title: "Entwicklung", subtitle: "& Training" },
      { title: "Integration", subtitle: "& Testing" },
      { title: "Launch", subtitle: "& Monitoring" },
    ],
    timeline: "4-6 Wochen",
  },
  "Logo & Branding": {
    package_name: "Logo & Branding",
    package_subtitle: "Visuelle Identität",
    package_description: "Professionelles Logo-Design mit Brand Guidelines, Farbpalette und allen Dateiformaten für Print und Digital.",
    badges: ["3 Konzepte", "1-2 Wochen", "Alle Formate"],
    services: [
      { title: "3 Logo-Konzeptentwürfe", description: "Verschiedene Richtungen zur Auswahl" },
      { title: "Farbpalette", description: "Primär- und Sekundärfarben definiert" },
      { title: "Typografie-Set", description: "Passende Schriftarten für alle Medien" },
      { title: "Brand Guidelines", description: "Nutzungsregeln und Anwendungsbeispiele" },
      { title: "Alle Dateiformate", description: "SVG, PNG, PDF für Print und Digital" },
    ],
    steps: [
      { title: "Briefing", subtitle: "& Recherche" },
      { title: "Konzepte", subtitle: "& Entwürfe" },
      { title: "Feinschliff", subtitle: "& Varianten" },
      { title: "Übergabe", subtitle: "& Guidelines" },
    ],
    timeline: "1-2 Wochen",
  },
};
