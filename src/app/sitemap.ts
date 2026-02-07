import { MetadataRoute } from 'next';

const BASE_URL_DE = 'https://agentflowm.de';
const BASE_URL_COM = 'https://agentflowm.com';

// All available pages
const pages = [
  '',
  '/workflows',
  '/contact',
  '/imprint',
  '/privacy',
];

// Bot categories for deep linking
const categories = [
  'ai-power',
  'ai-agents', 
  'viral-growth',
  'money-makers',
  'ai-creative',
  'spy-intelligence',
  'whatsapp-power',
  'telegram-bots',
  'lead-generation',
  'e-commerce',
  'marketing',
  'crm-sales',
  'social-media',
  'analytics',
  'customer-support',
  'hr-recruiting',
  'project-management',
  'finance',
  'legal-compliance',
  'healthcare',
  'real-estate',
  'education',
  'crypto-trading',
  'security-monitoring',
  'document-management',
  'video-content',
  'events-webinars',
  'web-scraping',
  'no-code-automation',
  'personal-ai',
  'hr-recruiting-pro',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  const entries: MetadataRoute.Sitemap = [];

  // German domain (.de) - Only German
  pages.forEach((page) => {
    entries.push({
      url: `${BASE_URL_DE}/de${page}`,
      lastModified: now,
      changeFrequency: page === '' || page === '/workflows' ? 'daily' : 'weekly',
      priority: page === '' ? 1.0 : page === '/workflows' ? 0.9 : 0.7,
    });
  });

  // Category pages for DE
  categories.forEach((cat) => {
    entries.push({
      url: `${BASE_URL_DE}/de/workflows?category=${cat}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });
  });

  // International domain (.com) - English + Arabic
  ['en', 'ar'].forEach((locale) => {
    pages.forEach((page) => {
      entries.push({
        url: `${BASE_URL_COM}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === '' || page === '/workflows' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : page === '/workflows' ? 0.9 : 0.7,
      });
    });

    // Category pages
    categories.forEach((cat) => {
      entries.push({
        url: `${BASE_URL_COM}/${locale}/workflows?category=${cat}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });
  });

  return entries;
}
