import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrlCom = 'https://agentflowm.com';
  const baseUrlDe = 'https://agentflowm.de';

  // KORRIGIERT: Nur Seiten die tatsächlich existieren!
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

  // Generate sitemap entries for .com (EN and AR)
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

  // Generate sitemap entries for .de (DE only)
  const dePages = pages.map((page) => ({
    url: `${baseUrlDe}/de${page}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1.0 : page.startsWith('/pakete') ? 0.9 : 0.8,
  }));

  return [...comEnPages, ...comArPages, ...dePages];
}
