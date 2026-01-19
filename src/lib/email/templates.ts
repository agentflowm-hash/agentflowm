// ===========================================
// Email Templates - AgentFlow Marketing
// ===========================================

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://agentflow.de';

// Shared email styles
const styles = {
  container: `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #0a0a0a;
    color: #ffffff;
  `,
  header: `
    background: linear-gradient(135deg, #FC682C 0%, #9D65C9 100%);
    padding: 32px;
    text-align: center;
  `,
  logo: `
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    text-decoration: none;
  `,
  content: `
    padding: 32px;
    background-color: #111111;
  `,
  h1: `
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 16px 0;
    color: #ffffff;
  `,
  h2: `
    font-size: 18px;
    font-weight: 600;
    margin: 24px 0 12px 0;
    color: #FC682C;
  `,
  p: `
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 16px 0;
    color: #cccccc;
  `,
  label: `
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888888;
    margin: 0 0 4px 0;
  `,
  value: `
    font-size: 16px;
    color: #ffffff;
    margin: 0 0 16px 0;
    padding: 12px;
    background-color: #1a1a1a;
    border-radius: 8px;
    border-left: 3px solid #FC682C;
  `,
  button: `
    display: inline-block;
    padding: 14px 28px;
    background: linear-gradient(135deg, #FC682C 0%, #e55a1f 100%);
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
  `,
  footer: `
    padding: 24px 32px;
    text-align: center;
    font-size: 14px;
    color: #666666;
    background-color: #0a0a0a;
  `,
  divider: `
    height: 1px;
    background-color: #333333;
    margin: 24px 0;
  `,
  badge: `
    display: inline-block;
    padding: 4px 12px;
    background-color: #FC682C;
    color: #ffffff;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  `,
};

// ===========================================
// Contact Form - Admin Notification
// ===========================================
interface ContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
  createdAt: string;
}

export function contactAdminTemplate(data: ContactData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <div style="${styles.badge}">Neue Anfrage</div>
      <h1 style="${styles.h1}; margin-top: 16px;">Kontaktanfrage erhalten</h1>
      
      <h2 style="${styles.h2}">Kontaktdaten</h2>
      <p style="${styles.label}">Name</p>
      <p style="${styles.value}">${data.name}</p>
      
      <p style="${styles.label}">E-Mail</p>
      <p style="${styles.value}"><a href="mailto:${data.email}" style="color: #FC682C;">${data.email}</a></p>
      
      ${data.phone ? `
      <p style="${styles.label}">Telefon</p>
      <p style="${styles.value}"><a href="tel:${data.phone}" style="color: #FC682C;">${data.phone}</a></p>
      ` : ''}
      
      ${data.company ? `
      <p style="${styles.label}">Unternehmen</p>
      <p style="${styles.value}">${data.company}</p>
      ` : ''}
      
      <h2 style="${styles.h2}">Projektdetails</h2>
      ${data.service ? `
      <p style="${styles.label}">Gewünschte Leistung</p>
      <p style="${styles.value}">${data.service}</p>
      ` : ''}
      
      ${data.budget ? `
      <p style="${styles.label}">Budget</p>
      <p style="${styles.value}">${data.budget}</p>
      ` : ''}
      
      <p style="${styles.label}">Nachricht</p>
      <p style="${styles.value}">${data.message.replace(/\n/g, '<br>')}</p>
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}; text-align: center;">
        <a href="mailto:${data.email}?subject=Re: Ihre Anfrage bei AgentFlow" style="${styles.button}">
          Direkt antworten
        </a>
      </p>
      
      <p style="${styles.p}; font-size: 12px; color: #666666; text-align: center; margin-top: 24px;">
        Eingegangen am ${new Date(data.createdAt).toLocaleString('de-DE', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })}
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow - KI-Automatisierung für Unternehmen</p>
      <p style="margin: 8px 0 0 0;"><a href="${baseUrl}/admin" style="color: #FC682C;">Zum Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Contact Form - Customer Confirmation
// ===========================================
export function contactConfirmationTemplate(data: ContactData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <h1 style="${styles.h1}">Vielen Dank für Ihre Anfrage!</h1>
      <p style="${styles.p}">
        Hallo ${data.name.split(' ')[0]},
      </p>
      <p style="${styles.p}">
        wir haben Ihre Nachricht erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
      </p>
      
      <div style="${styles.divider}"></div>
      
      <h2 style="${styles.h2}">Ihre Anfrage</h2>
      <p style="${styles.value}">${data.message.replace(/\n/g, '<br>')}</p>
      
      <div style="${styles.divider}"></div>
      
      <h2 style="${styles.h2}">So geht es weiter</h2>
      <p style="${styles.p}">
        <strong style="color: #ffffff;">1.</strong> Wir prüfen Ihre Anfrage<br>
        <strong style="color: #ffffff;">2.</strong> Sie erhalten einen Terminvorschlag für ein kostenloses Erstgespräch<br>
        <strong style="color: #ffffff;">3.</strong> Wir besprechen Ihr Projekt und erstellen ein individuelles Angebot
      </p>
      
      <p style="${styles.p}; text-align: center; margin-top: 32px;">
        <a href="${baseUrl}/termin" style="${styles.button}">
          Termin direkt buchen
        </a>
      </p>
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}">
        Haben Sie dringende Fragen? Rufen Sie uns an oder schreiben Sie uns auf WhatsApp:
      </p>
      <p style="${styles.p}">
        <a href="tel:+4915678123456" style="color: #FC682C;">+49 156 78123456</a>
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow - KI-Automatisierung für Unternehmen</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${baseUrl}/impressum" style="color: #666666;">Impressum</a> · 
        <a href="${baseUrl}/datenschutz" style="color: #666666;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Referral - Admin Notification
// ===========================================
interface ReferralData {
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  referredName: string;
  referredEmail: string;
  referredPhone?: string;
  referredCompany?: string;
  notes?: string;
  createdAt: string;
}

export function referralAdminTemplate(data: ReferralData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}; background: linear-gradient(135deg, #9D65C9 0%, #FC682C 100%);">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <div style="${styles.badge}; background-color: #9D65C9;">Neue Empfehlung</div>
      <h1 style="${styles.h1}; margin-top: 16px;">Referral eingegangen</h1>
      
      <h2 style="${styles.h2}; color: #9D65C9;">Empfohlen von</h2>
      <p style="${styles.label}">Name</p>
      <p style="${styles.value}; border-left-color: #9D65C9;">${data.referrerName}</p>
      
      <p style="${styles.label}">E-Mail</p>
      <p style="${styles.value}; border-left-color: #9D65C9;"><a href="mailto:${data.referrerEmail}" style="color: #9D65C9;">${data.referrerEmail}</a></p>
      
      ${data.referrerPhone ? `
      <p style="${styles.label}">Telefon</p>
      <p style="${styles.value}; border-left-color: #9D65C9;">${data.referrerPhone}</p>
      ` : ''}
      
      <h2 style="${styles.h2}">Empfohlene Person</h2>
      <p style="${styles.label}">Name</p>
      <p style="${styles.value}">${data.referredName}</p>
      
      <p style="${styles.label}">E-Mail</p>
      <p style="${styles.value}"><a href="mailto:${data.referredEmail}" style="color: #FC682C;">${data.referredEmail}</a></p>
      
      ${data.referredPhone ? `
      <p style="${styles.label}">Telefon</p>
      <p style="${styles.value}">${data.referredPhone}</p>
      ` : ''}
      
      ${data.referredCompany ? `
      <p style="${styles.label}">Unternehmen</p>
      <p style="${styles.value}">${data.referredCompany}</p>
      ` : ''}
      
      ${data.notes ? `
      <h2 style="${styles.h2}">Notizen</h2>
      <p style="${styles.value}">${data.notes.replace(/\n/g, '<br>')}</p>
      ` : ''}
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}; text-align: center;">
        <a href="mailto:${data.referredEmail}?subject=Empfehlung von ${data.referrerName} - AgentFlow" style="${styles.button}; background: linear-gradient(135deg, #9D65C9 0%, #FC682C 100%);">
          Kontakt aufnehmen
        </a>
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow Referral Programm</p>
      <p style="margin: 8px 0 0 0;"><a href="${baseUrl}/admin" style="color: #9D65C9;">Zum Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Referral - Referrer Confirmation
// ===========================================
export function referralConfirmationTemplate(data: ReferralData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}; background: linear-gradient(135deg, #9D65C9 0%, #FC682C 100%);">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <h1 style="${styles.h1}">Danke für Ihre Empfehlung!</h1>
      <p style="${styles.p}">
        Hallo ${data.referrerName.split(' ')[0]},
      </p>
      <p style="${styles.p}">
        vielen Dank, dass Sie <strong style="color: #ffffff;">${data.referredName}</strong> an uns empfohlen haben!
      </p>
      
      <div style="${styles.divider}"></div>
      
      <h2 style="${styles.h2}; color: #9D65C9;">So geht es weiter</h2>
      <p style="${styles.p}">
        <strong style="color: #ffffff;">1.</strong> Wir kontaktieren ${data.referredName.split(' ')[0]} in den nächsten 24-48 Stunden<br>
        <strong style="color: #ffffff;">2.</strong> Bei einem erfolgreichen Projektabschluss erhalten Sie Ihre Provision<br>
        <strong style="color: #ffffff;">3.</strong> Die Auszahlung erfolgt innerhalb von 30 Tagen nach Projektstart
      </p>
      
      <div style="background: linear-gradient(135deg, rgba(157, 101, 201, 0.2) 0%, rgba(252, 104, 44, 0.2) 100%); padding: 24px; border-radius: 12px; margin: 24px 0;">
        <p style="${styles.p}; margin: 0; text-align: center;">
          <strong style="color: #ffffff; font-size: 18px;">Ihre potenzielle Provision</strong><br>
          <span style="color: #9D65C9; font-size: 32px; font-weight: bold;">10%</span><br>
          <span style="color: #888888; font-size: 14px;">des Auftragswertes</span>
        </p>
      </div>
      
      <p style="${styles.p}; text-align: center;">
        <a href="${baseUrl}/referral" style="${styles.button}; background: linear-gradient(135deg, #9D65C9 0%, #FC682C 100%);">
          Weitere Person empfehlen
        </a>
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow Referral Programm</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${baseUrl}/impressum" style="color: #666666;">Impressum</a> · 
        <a href="${baseUrl}/datenschutz" style="color: #666666;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Newsletter - Welcome Email
// ===========================================
interface SubscriberData {
  email: string;
  createdAt: string;
}

export function newsletterWelcomeTemplate(data: SubscriberData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <h1 style="${styles.h1}">Willkommen im Newsletter!</h1>
      <p style="${styles.p}">
        Sie erhalten ab jetzt regelmäßig Updates zu:
      </p>
      <ul style="color: #cccccc; line-height: 2;">
        <li>Neuesten KI-Trends und Tools</li>
        <li>Automatisierungs-Tipps für Ihr Business</li>
        <li>Exklusive Angebote und Early Access</li>
        <li>Case Studies und Erfolgsgeschichten</li>
      </ul>
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}; text-align: center;">
        <a href="${baseUrl}/tools" style="${styles.button}">
          Entdecken Sie unsere Tools
        </a>
      </p>
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}; font-size: 12px; color: #666666; text-align: center;">
        Sie können sich jederzeit abmelden, indem Sie auf "Abmelden" am Ende jeder E-Mail klicken.
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow - KI-Automatisierung für Unternehmen</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${baseUrl}/impressum" style="color: #666666;">Impressum</a> · 
        <a href="${baseUrl}/datenschutz" style="color: #666666;">Datenschutz</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Newsletter - Admin Notification
// ===========================================
export function newsletterAdminTemplate(data: SubscriberData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <div style="${styles.badge}">Neuer Subscriber</div>
      <h1 style="${styles.h1}; margin-top: 16px;">Newsletter-Anmeldung</h1>
      
      <p style="${styles.label}">E-Mail</p>
      <p style="${styles.value}">${data.email}</p>
      
      <p style="${styles.p}; font-size: 12px; color: #666666;">
        Angemeldet am ${new Date(data.createdAt).toLocaleString('de-DE', { 
          dateStyle: 'full', 
          timeStyle: 'short' 
        })}
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;"><a href="${baseUrl}/admin" style="color: #FC682C;">Zum Admin Dashboard</a></p>
    </div>
  </div>
</body>
</html>
  `;
}

// ===========================================
// Website Check - Results Email
// ===========================================
interface WebsiteCheckData {
  url: string;
  score: number;
  categoryScores: {
    security: number;
    seo: number;
    accessibility: number;
    performance: number;
    structure: number;
  };
  createdAt: string;
}

export function websiteCheckResultsTemplate(data: WebsiteCheckData): string {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    return '#ef4444';
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; background-color: #000000;">
  <div style="${styles.container}">
    <div style="${styles.header}; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);">
      <a href="${baseUrl}" style="${styles.logo}">AgentFlow</a>
    </div>
    <div style="${styles.content}">
      <h1 style="${styles.h1}">Website-Check Ergebnisse</h1>
      <p style="${styles.p}">
        Hier sind die Ergebnisse für <strong style="color: #06b6d4;">${data.url}</strong>
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(${getScoreColor(data.score)} ${data.score * 3.6}deg, #333333 0deg); position: relative;">
          <div style="position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; background: #111111; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px; font-weight: bold; color: ${getScoreColor(data.score)};">${data.score}</span>
          </div>
        </div>
        <p style="${styles.p}; margin-top: 12px;">Gesamtbewertung</p>
      </div>
      
      <div style="${styles.divider}"></div>
      
      <h2 style="${styles.h2}; color: #06b6d4;">Kategorien im Detail</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; color: #cccccc;">Sicherheit</td>
          <td style="padding: 12px 0; text-align: right; color: ${getScoreColor(data.categoryScores.security)}; font-weight: bold;">${data.categoryScores.security}/100</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #cccccc;">SEO</td>
          <td style="padding: 12px 0; text-align: right; color: ${getScoreColor(data.categoryScores.seo)}; font-weight: bold;">${data.categoryScores.seo}/100</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #cccccc;">Barrierefreiheit</td>
          <td style="padding: 12px 0; text-align: right; color: ${getScoreColor(data.categoryScores.accessibility)}; font-weight: bold;">${data.categoryScores.accessibility}/100</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #cccccc;">Performance</td>
          <td style="padding: 12px 0; text-align: right; color: ${getScoreColor(data.categoryScores.performance)}; font-weight: bold;">${data.categoryScores.performance}/100</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #cccccc;">Struktur</td>
          <td style="padding: 12px 0; text-align: right; color: ${getScoreColor(data.categoryScores.structure)}; font-weight: bold;">${data.categoryScores.structure}/100</td>
        </tr>
      </table>
      
      <div style="${styles.divider}"></div>
      
      <p style="${styles.p}; text-align: center;">
        Möchten Sie Ihre Website professionell optimieren lassen?
      </p>
      
      <p style="${styles.p}; text-align: center;">
        <a href="${baseUrl}/termin" style="${styles.button}; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);">
          Kostenloses Beratungsgespräch
        </a>
      </p>
    </div>
    <div style="${styles.footer}">
      <p style="margin: 0;">AgentFlow Website-Check</p>
      <p style="margin: 8px 0 0 0;">
        <a href="${baseUrl}/website-check" style="color: #06b6d4;">Erneut testen</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
