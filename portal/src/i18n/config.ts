// i18n Configuration for Portal
export const locales = ['de', 'en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'de';

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  ar: 'العربية',
};

// RTL languages
export const rtlLocales: Locale[] = ['ar'];

export function isRtl(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
