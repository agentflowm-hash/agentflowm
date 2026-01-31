import { MetadataRoute } from 'next';

// ═══════════════════════════════════════════════════════════════
//                    SITEMAP
// Domain-basierte Sprachen:
// - agentflowm.de → Nur Deutsch
// - agentflowm.com → Englisch + Arabisch
// ═══════════════════════════════════════════════════════════════

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrlCom = 'https://agentflowm.com';
  const baseUrlDe = 'https://agentflowm.de';

  // Alle Seiten (nur existierende!)
  const pages = [
    '',
    '/pakete',
    '/pakete/start',
    '/pakete/growth',
    '/pakete/business',
    '/pakete/custom',
    '/pakete/one-page',
    '/pakete/webapp',
    '/pakete/mobile',
    '/pakete/konfigurator',
    '/projekte',
    '/loesung',
    '/workflows',
    '/tools',
    '/kontakt',
    '/termin',
    '/referral',
    '/website-check',
    '/impressum',
    '/datenschutz',
  ];

  const now = new Date().toISOString();

  // ═══════════════════════════════════════════════════════════════
  // agentflowm.com → Englisch + Arabisch
  // ═══════════════════════════════════════════════════════════════
  
  const comEnPages = pages.map((page) => ({
    url: `${baseUrlCom}/en${page}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1.0 : page.startsWith('/pakete') ? 0.9 : 0.8,
  }));

  const comArPages = pages.map((page) => ({
    url: `${baseUrlCom}/ar${page}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 0.9 : 0.7,
  }));

  // ═══════════════════════════════════════════════════════════════
  // agentflowm.de → Nur Deutsch
  // ═══════════════════════════════════════════════════════════════
  
  const dePages = pages.map((page) => ({
    url: `${baseUrlDe}/de${page}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1.0 : page.startsWith('/pakete') ? 0.9 : 0.8,
  }));

  return [...comEnPages, ...comArPages, ...dePages];
}
