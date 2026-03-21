/**
 * Seed Premium E-Mail Templates in die Datenbank
 * POST /api/email-templates/seed — Fuegt alle Templates ein (skippt bestehende)
 */

import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';
import { PREMIUM_TEMPLATES, wrapEmailHTML } from '@/lib/email-templates';

export const POST = createHandler({ auth: true }, async () => {
  let inserted = 0;
  let skipped = 0;

  for (const tmpl of PREMIUM_TEMPLATES) {
    // Check ob Template mit diesem Namen schon existiert
    const { data: existing } = await db
      .from('email_templates')
      .select('id')
      .eq('name', tmpl.name)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    // Template mit Premium-Wrapper einfuegen
    const wrappedBody = wrapEmailHTML(tmpl.body);

    await db.from('email_templates').insert({
      name: tmpl.name,
      subject: tmpl.subject,
      body: wrappedBody,
      category: tmpl.category,
      variables: tmpl.variables,
      usage_count: 0,
    });

    inserted++;
  }

  return {
    inserted,
    skipped,
    total: PREMIUM_TEMPLATES.length,
    message: `${inserted} Templates eingefuegt, ${skipped} uebersprungen`,
  };
});
