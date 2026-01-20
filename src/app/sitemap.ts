import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrlCom = 'https://agentflowm.com';
  const baseUrlDe = 'https://agentflowm.de';

  // Common pages for both domains
  const pages = [
    '',
    '/pakete',
    '/pakete/starter',
    '/pakete/growth',
    '/pakete/scale',
    '/pakete/enterprise',
    '/pakete/compare',
    '/projekte',
    '/loesung',
    '/workflows',
    '/workflows/chatbot',
    '/workflows/email-automation',
    '/workflows/crm-integration',
    '/workflows/analytics',
    '/tools',
    '/kontakt',
    '/termin',
    '/empfehlen',
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
