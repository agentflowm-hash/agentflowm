import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/portal/'],
      },
    ],
    sitemap: [
      'https://agentflowm.com/sitemap.xml',
      'https://agentflowm.de/sitemap.xml',
    ],
  };
}
