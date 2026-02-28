/**
 * ═══════════════════════════════════════════════════════════════
 *                    WEBSITE CHECKS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

// ─────────────────────────────────────────────────────────────────
// GET /api/checks - List website checks
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async () => {
  const { data: rawChecks, error } = await db
    .from('website_checks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new DatabaseError(error.message);

  // Transform snake_case to camelCase for frontend compatibility
  const checks = (rawChecks || []).map((check: any) => ({
    id: check.id,
    url: check.url,
    email: check.email,
    scoreOverall: check.score_overall,
    scoreSecurity: check.score_security,
    scoreSeo: check.score_seo,
    scoreAccessibility: check.score_accessibility,
    scorePerformance: check.score_performance,
    scoreStructure: check.score_structure,
    loadTime: check.load_time,
    httpsEnabled: check.https_enabled,
    resultJson: check.result_json,
    createdAt: check.created_at,
  }));

  return { checks };
});
