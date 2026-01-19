import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
//                    COMMON VALIDATORS
// ═══════════════════════════════════════════════════════════════

// Sichere String-Validierung (verhindert SQL Injection & XSS)
const safeString = (minLength = 1, maxLength = 500) =>
  z.string()
    .min(minLength, `Mindestens ${minLength} Zeichen`)
    .max(maxLength, `Maximal ${maxLength} Zeichen`)
    .transform((val) => val.trim())
    // Entfernt gefährliche Zeichen
    .refine((val) => !/<script|javascript:|on\w+=/i.test(val), 'Ungültige Eingabe');

// E-Mail Validierung
const emailSchema = z.string()
  .email('Ungültige E-Mail-Adresse')
  .max(255)
  .transform((val) => val.toLowerCase().trim());

// Telefon Validierung (optional)
const phoneSchema = z.string()
  .max(30)
  .regex(/^[\d\s\+\-\(\)\/]*$/, 'Ungültige Telefonnummer')
  .optional()
  .or(z.literal(''));

// URL Validierung
const urlSchema = z.string()
  .url('Ungültige URL')
  .max(2000)
  .refine((val) => {
    try {
      const url = new URL(val);
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, 'URL muss mit http:// oder https:// beginnen');

// ═══════════════════════════════════════════════════════════════
//                    LEAD / CONTACT FORM
// ═══════════════════════════════════════════════════════════════

export const leadSchema = z.object({
  name: safeString(2, 100),
  email: emailSchema,
  phone: phoneSchema,
  company: safeString(0, 100).optional().or(z.literal('')),
  message: safeString(10, 2000),
  packageInterest: z.enum(['one-page', 'business', 'growth', '']).optional(),
  budget: z.enum(['unter-2000', '2000-5000', '5000-10000', 'ueber-10000', '']).optional(),
  source: z.enum(['website', 'referral', 'calendly', 'other']).default('website'),
  
  // Honeypot field - muss leer sein
  website: z.string().max(0, 'Spam detected').optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

// ═══════════════════════════════════════════════════════════════
//                    WEBSITE CHECK
// ═══════════════════════════════════════════════════════════════

export const websiteCheckSchema = z.object({
  url: z.string()
    .min(1, 'URL ist erforderlich')
    .max(2000)
    .transform((val) => {
      let url = val.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      return url;
    })
    .pipe(urlSchema),
  email: emailSchema.optional().or(z.literal('')),
});

export type WebsiteCheckInput = z.infer<typeof websiteCheckSchema>;

// ═══════════════════════════════════════════════════════════════
//                    REFERRAL
// ═══════════════════════════════════════════════════════════════

export const referralSchema = z.object({
  // Empfehlender
  referrerName: safeString(2, 100),
  referrerEmail: emailSchema,
  referrerPhone: phoneSchema,
  
  // Empfohlene Person
  referredName: safeString(2, 100),
  referredEmail: emailSchema.optional().or(z.literal('')),
  referredPhone: phoneSchema,
  referredCompany: safeString(0, 100).optional().or(z.literal('')),
  
  // Kontext
  context: safeString(10, 1000).optional().or(z.literal('')),
  
  // Honeypot
  website: z.string().max(0, 'Spam detected').optional(),
});

export type ReferralInput = z.infer<typeof referralSchema>;

// ═══════════════════════════════════════════════════════════════
//                    NEWSLETTER
// ═══════════════════════════════════════════════════════════════

export const subscriberSchema = z.object({
  email: emailSchema,
  name: safeString(0, 100).optional().or(z.literal('')),
  topics: z.array(z.enum(['updates', 'tipps', 'angebote'])).optional(),
  
  // Honeypot
  website: z.string().max(0, 'Spam detected').optional(),
});

export type SubscriberInput = z.infer<typeof subscriberSchema>;

// ═══════════════════════════════════════════════════════════════
//                    VALIDATION HELPER
// ═══════════════════════════════════════════════════════════════

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Formatiere Fehler für Frontend
  const errors: Record<string, string> = {};
  for (const error of result.error.issues) {
    const path = error.path.join('.') || 'general';
    errors[path] = error.message;
  }
  
  return { success: false, errors };
}
