/**
 * ═══════════════════════════════════════════════════════════════
 *             PREMIUM E-MAIL TEMPLATES
 * ═══════════════════════════════════════════════════════════════
 *
 * Fertige HTML-E-Mail-Templates mit AgentFlowMarketing Branding.
 * Platzhalter: {{name}}, {{firma}}, {{projekt}}, {{betrag}}, {{datum}}, {{link}}
 */

// ── Premium E-Mail Wrapper ─────────────────────────────────────
export function wrapEmailHTML(bodyContent: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${preheader ? `<span style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <style>
    body { margin: 0; padding: 0; background: #f5f6fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #0B0F19 0%, #1a2235 100%); padding: 32px 40px; text-align: center; }
    .logo { font-size: 22px; font-weight: 800; color: #FC682C; letter-spacing: -0.5px; }
    .content { padding: 40px; color: #1a1a2e; line-height: 1.7; font-size: 15px; }
    .content h2 { font-size: 22px; font-weight: 700; margin: 0 0 20px; color: #1a1a2e; }
    .content p { margin: 0 0 16px; }
    .highlight-box { background: #f8f9fc; border-left: 4px solid #FC682C; border-radius: 0 12px 12px 0; padding: 20px 24px; margin: 24px 0; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #FC682C, #FF8F5C); color: #ffffff !important; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin: 24px 0; }
    .cta-btn:hover { opacity: 0.9; }
    .divider { height: 1px; background: #eef0f5; margin: 24px 0; }
    .footer { padding: 24px 40px; background: #f8f9fc; text-align: center; font-size: 12px; color: #999; }
    .footer a { color: #FC682C; text-decoration: none; }
    .signature { margin-top: 24px; padding-top: 16px; border-top: 1px solid #eef0f5; }
    .signature strong { color: #FC682C; }
    @media (max-width: 640px) {
      .wrapper { margin: 0 !important; border-radius: 0 !important; }
      .content, .footer { padding: 24px !important; }
    }
  </style>
</head>
<body>
  <div style="padding: 24px 16px; background: #f5f6fa;">
    <div class="wrapper">
      <div class="header">
        <div class="logo">AgentFlowMarketing</div>
      </div>
      <div class="content">
        ${bodyContent}
        <div class="signature">
          <p style="margin:0;font-size:14px;">Mit freundlichen Gruessen,</p>
          <p style="margin:4px 0 0;font-size:14px;"><strong>M. Ashaer</strong><br>
          <span style="color:#888;font-size:13px;">AgentFlowMarketing</span></p>
        </div>
      </div>
      <div class="footer">
        <p>AgentFlowMarketing | kontakt@agentflowm.de</p>
        <p style="margin-top:8px;"><a href="https://agentflowm.de">agentflowm.de</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ── Template-Definitionen ──────────────────────────────────────

export interface EmailTemplateData {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  variables: string[];
}

export const PREMIUM_TEMPLATES: EmailTemplateData[] = [
  // ── WILLKOMMEN ────────────────────────────────────────────
  {
    id: "welcome",
    name: "Willkommen - Neuer Kunde",
    category: "welcome",
    subject: "Willkommen bei AgentFlowMarketing, {{name}}!",
    variables: ["name", "firma", "projekt", "portal_link"],
    body: `<h2>Willkommen an Bord! 🚀</h2>
<p>Hallo {{name}},</p>
<p>wir freuen uns sehr, Sie als neuen Kunden begrüßen zu dürfen! Ihr Projekt <strong>"{{projekt}}"</strong> ist angelegt und unser Team startet in Kürze mit der Umsetzung.</p>
<div class="highlight-box">
  <strong>Was passiert als Nächstes?</strong><br>
  1. Wir analysieren Ihre Anforderungen<br>
  2. Sie erhalten ein erstes Konzept zur Freigabe<br>
  3. Umsetzung und regelmäßige Updates über Ihr Portal
</div>
<p>Über Ihr persönliches Kundenportal können Sie den Fortschritt jederzeit verfolgen, Nachrichten senden und Dateien austauschen:</p>
<a href="{{portal_link}}" class="cta-btn">Zum Kundenportal</a>
<p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>`,
  },

  // ── PROJEKT-UPDATE ────────────────────────────────────────
  {
    id: "project-update",
    name: "Projekt-Update",
    category: "update",
    subject: "Update zu Ihrem Projekt \"{{projekt}}\"",
    variables: ["name", "projekt", "fortschritt", "meilenstein", "portal_link"],
    body: `<h2>Projekt-Update</h2>
<p>Hallo {{name}},</p>
<p>wir möchten Sie über den aktuellen Stand Ihres Projekts <strong>"{{projekt}}"</strong> informieren.</p>
<div class="highlight-box">
  <strong>Fortschritt: {{fortschritt}}%</strong><br>
  Aktueller Meilenstein: {{meilenstein}}
</div>
<p>Alle Details und den vollständigen Projektverlauf finden Sie in Ihrem Portal:</p>
<a href="{{portal_link}}" class="cta-btn">Projekt ansehen</a>`,
  },

  // ── FREIGABE ANFORDERN ────────────────────────────────────
  {
    id: "approval-request",
    name: "Freigabe anfordern",
    category: "approval",
    subject: "Freigabe benötigt: {{projekt}}",
    variables: ["name", "projekt", "beschreibung", "portal_link"],
    body: `<h2>Freigabe erforderlich</h2>
<p>Hallo {{name}},</p>
<p>für Ihr Projekt <strong>"{{projekt}}"</strong> liegt eine neue Version zur Freigabe bereit.</p>
<div class="highlight-box">
  {{beschreibung}}
</div>
<p>Bitte prüfen Sie die Änderungen und geben Sie Ihr Feedback:</p>
<a href="{{portal_link}}" class="cta-btn">Jetzt freigeben</a>
<p style="color:#888;font-size:13px;">Tipp: Sie können direkt im Portal Anmerkungen hinterlassen oder Änderungswünsche formulieren.</p>`,
  },

  // ── RECHNUNG ──────────────────────────────────────────────
  {
    id: "invoice",
    name: "Rechnungsversand",
    category: "invoice",
    subject: "Rechnung {{rechnungsnr}} - AgentFlowMarketing",
    variables: ["name", "rechnungsnr", "betrag", "faellig", "link"],
    body: `<h2>Ihre Rechnung</h2>
<p>Hallo {{name}},</p>
<p>anbei erhalten Sie Ihre Rechnung für unsere Zusammenarbeit.</p>
<div class="highlight-box">
  <strong>Rechnung: {{rechnungsnr}}</strong><br>
  Betrag: <strong style="font-size:18px;color:#FC682C;">{{betrag}} EUR</strong><br>
  Fällig bis: {{faellig}}
</div>
<a href="{{link}}" class="cta-btn">Rechnung als PDF ansehen</a>
<p style="color:#888;font-size:13px;">Bitte überweisen Sie den Betrag unter Angabe der Rechnungsnummer.</p>`,
  },

  // ── ZAHLUNGSERINNERUNG ────────────────────────────────────
  {
    id: "payment-reminder",
    name: "Zahlungserinnerung",
    category: "invoice",
    subject: "Zahlungserinnerung: {{rechnungsnr}}",
    variables: ["name", "rechnungsnr", "betrag", "faellig", "tage_ueberfaellig"],
    body: `<h2>Freundliche Zahlungserinnerung</h2>
<p>Hallo {{name}},</p>
<p>wir erlauben uns, Sie freundlich an die offene Rechnung zu erinnern:</p>
<div class="highlight-box" style="border-left-color:#dc2626;">
  <strong>Rechnung: {{rechnungsnr}}</strong><br>
  Betrag: <strong style="font-size:18px;color:#dc2626;">{{betrag}} EUR</strong><br>
  Fällig seit: {{faellig}} ({{tage_ueberfaellig}} Tage)
</div>
<p>Sollte sich diese Nachricht mit Ihrer Zahlung überschneiden, betrachten Sie sie bitte als gegenstandslos.</p>
<p>Bei Fragen zur Rechnung stehen wir Ihnen gerne zur Verfügung.</p>`,
  },

  // ── ANGEBOT ───────────────────────────────────────────────
  {
    id: "offer",
    name: "Angebot senden",
    category: "offer",
    subject: "Ihr individuelles Angebot - AgentFlowMarketing",
    variables: ["name", "firma", "paket", "betrag", "link"],
    body: `<h2>Ihr individuelles Angebot</h2>
<p>Hallo {{name}},</p>
<p>vielen Dank für Ihr Interesse an unseren Leistungen! Basierend auf unserem Gespräch haben wir folgendes Angebot für {{firma}} zusammengestellt:</p>
<div class="highlight-box">
  <strong>{{paket}}</strong><br>
  Investition: <strong style="font-size:18px;color:#FC682C;">{{betrag}} EUR</strong> (zzgl. MwSt.)
</div>
<p>Das detaillierte Angebot mit allen Leistungen finden Sie hier:</p>
<a href="{{link}}" class="cta-btn">Angebot ansehen</a>
<p>Das Angebot ist 30 Tage gültig. Gerne bespreche ich alle Details persönlich mit Ihnen.</p>`,
  },

  // ── FOLLOW-UP ─────────────────────────────────────────────
  {
    id: "follow-up",
    name: "Follow-Up nach Erstgespräch",
    category: "sales",
    subject: "Schön, dass wir uns kennenlernen durften, {{name}}!",
    variables: ["name", "firma"],
    body: `<h2>Danke für das Gespräch!</h2>
<p>Hallo {{name}},</p>
<p>vielen Dank für das angenehme Gespräch! Es war spannend, mehr über {{firma}} und Ihre Ziele zu erfahren.</p>
<p>Wie besprochen, hier eine kurze Zusammenfassung der nächsten Schritte:</p>
<div class="highlight-box">
  <strong>Nächste Schritte:</strong><br>
  1. Wir erstellen ein individuelles Angebot für Sie<br>
  2. Sie erhalten es innerhalb von 1-2 Werktagen<br>
  3. Bei Fragen können Sie sich jederzeit melden
</div>
<p>Ich freue mich auf die Zusammenarbeit!</p>`,
  },

  // ── PROJEKT ABGESCHLOSSEN ─────────────────────────────────
  {
    id: "project-complete",
    name: "Projekt abgeschlossen",
    category: "milestone",
    subject: "Ihr Projekt \"{{projekt}}\" ist fertig! 🎉",
    variables: ["name", "projekt", "portal_link"],
    body: `<h2>Projekt abgeschlossen! 🎉</h2>
<p>Hallo {{name}},</p>
<p>wir freuen uns, Ihnen mitteilen zu können, dass Ihr Projekt <strong>"{{projekt}}"</strong> erfolgreich abgeschlossen wurde!</p>
<div class="highlight-box" style="border-left-color:#16a34a;">
  <strong style="color:#16a34a;">✓ Projekt ist live!</strong><br>
  Alle Meilensteine wurden erfolgreich umgesetzt.
</div>
<p>Im Kundenportal finden Sie alle Projektdateien und Dokumentation:</p>
<a href="{{portal_link}}" class="cta-btn">Zum Portal</a>
<p>Wir würden uns sehr über eine <strong>Google-Bewertung</strong> freuen — das hilft uns enorm!</p>
<p style="color:#888;font-size:13px;">Für Wartung und Support stehen wir Ihnen weiterhin zur Verfügung.</p>`,
  },

  // ── REFERRAL EINLADUNG ────────────────────────────────────
  {
    id: "referral-invite",
    name: "Empfehlungsprogramm",
    category: "referral",
    subject: "Empfehlen Sie uns weiter und verdienen Sie 10%!",
    variables: ["name", "referral_link"],
    body: `<h2>Unser Empfehlungsprogramm</h2>
<p>Hallo {{name}},</p>
<p>kennen Sie jemanden, der eine professionelle Website oder digitale Lösung benötigt?</p>
<div class="highlight-box">
  <strong>So funktioniert es:</strong><br>
  1. Teilen Sie Ihren persönlichen Link<br>
  2. Ihr Kontakt meldet sich bei uns<br>
  3. Sie erhalten <strong style="color:#FC682C;">10% Provision</strong> auf jeden abgeschlossenen Deal!
</div>
<a href="{{referral_link}}" class="cta-btn">Meinen Empfehlungslink teilen</a>
<p style="color:#888;font-size:13px;">Die Provision wird nach Zahlungseingang automatisch berechnet und ausgezahlt.</p>`,
  },

  // ── TERMIN ERINNERUNG ─────────────────────────────────────
  {
    id: "meeting-reminder",
    name: "Terminerinnerung",
    category: "reminder",
    subject: "Erinnerung: Termin morgen um {{uhrzeit}}",
    variables: ["name", "datum", "uhrzeit", "thema"],
    body: `<h2>Terminerinnerung</h2>
<p>Hallo {{name}},</p>
<p>wir möchten Sie an unseren morgigen Termin erinnern:</p>
<div class="highlight-box">
  <strong>{{thema}}</strong><br>
  Datum: {{datum}}<br>
  Uhrzeit: {{uhrzeit}} Uhr
</div>
<p>Falls Sie den Termin verschieben müssen, geben Sie uns bitte rechtzeitig Bescheid.</p>
<p>Wir freuen uns auf das Gespräch!</p>`,
  },

  // ── NEWSLETTER / MARKETING ────────────────────────────────
  {
    id: "newsletter",
    name: "Newsletter / Marketing",
    category: "marketing",
    subject: "{{betreff}}",
    variables: ["name", "betreff", "inhalt", "cta_text", "cta_link"],
    body: `<h2>{{betreff}}</h2>
<p>Hallo {{name}},</p>
{{inhalt}}
<a href="{{cta_link}}" class="cta-btn">{{cta_text}}</a>`,
  },
];
