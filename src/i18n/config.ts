// ═══════════════════════════════════════════════════════════════
//                    I18N CONFIGURATION
// Domain-basierte Sprachsteuerung:
// - agentflowm.de → Nur Deutsch
// - agentflowm.com → Englisch + Arabisch
// ═══════════════════════════════════════════════════════════════

export const locales = ['en', 'ar', 'de'] as const;
export type Locale = (typeof locales)[number];

// Domain-spezifische Konfiguration
export const domainConfig = {
  'agentflowm.de': {
    locales: ['de'] as const,
    defaultLocale: 'de' as Locale,
  },
  'agentflowm.com': {
    locales: ['en', 'ar'] as const,
    defaultLocale: 'en' as Locale,
  },
  // Localhost/Development
  'localhost': {
    locales: ['en', 'ar', 'de'] as const,
    defaultLocale: 'de' as Locale,
  },
} as const;

// Fallback für unbekannte Domains
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
  de: 'Deutsch'
};

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
  de: 'ltr'
};

// Helper: Hole erlaubte Sprachen für Domain
export function getLocalesForDomain(hostname: string): readonly Locale[] {
  // Check for exact match or subdomain
  for (const [domain, config] of Object.entries(domainConfig)) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return config.locales;
    }
  }
  // Fallback: alle Sprachen (für Development)
  return locales;
}

// Helper: Hole Default-Sprache für Domain
export function getDefaultLocaleForDomain(hostname: string): Locale {
  for (const [domain, config] of Object.entries(domainConfig)) {
    if (hostname === domain || hostname.endsWith(`.${domain}`)) {
      return config.defaultLocale;
    }
  }
  return defaultLocale;
}
