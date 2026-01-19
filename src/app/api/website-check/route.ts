import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit, hashIP } from '@/lib/db';
import { websiteCheckSchema, validateInput } from '@/lib/validations';

// ═══════════════════════════════════════════════════════════════
//                    TYPES
// ═══════════════════════════════════════════════════════════════

interface CheckResult {
  url: string;
  timestamp: string;
  loadTime: number;
  scores: {
    security: number;
    seo: number;
    accessibility: number;
    performance: number;
    structure: number;
  };
  findings: Finding[];
  recommendations: Recommendation[];
  meta: {
    title: string | null;
    description: string | null;
    favicon: boolean;
    language: string | null;
    charset: string | null;
    viewport: boolean;
    canonical: string | null;
    ogTags: Record<string, string>;
  };
  technical: {
    https: boolean;
    responseTime: number;
    contentLength: number;
    contentType: string | null;
    server: string | null;
  };
}

interface Finding {
  type: 'success' | 'warning' | 'error' | 'info';
  category: string;
  message: string;
}

interface Recommendation {
  priority: 'P1' | 'P2' | 'P3';
  category: string;
  text: string;
}

// ═══════════════════════════════════════════════════════════════
//                    ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function analyzeSecurityHeaders(headers: Headers): { score: number; findings: Finding[]; recommendations: Recommendation[] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  let score = 100;

  // HTTPS check (already implied if we got here via https)
  const securityHeaders = {
    'strict-transport-security': { name: 'HSTS', penalty: 10 },
    'x-content-type-options': { name: 'X-Content-Type-Options', penalty: 5 },
    'x-frame-options': { name: 'X-Frame-Options', penalty: 5 },
    'x-xss-protection': { name: 'XSS Protection', penalty: 5 },
    'content-security-policy': { name: 'Content Security Policy', penalty: 15 },
    'referrer-policy': { name: 'Referrer Policy', penalty: 5 },
    'permissions-policy': { name: 'Permissions Policy', penalty: 5 },
  };

  for (const [header, config] of Object.entries(securityHeaders)) {
    if (headers.get(header)) {
      findings.push({
        type: 'success',
        category: 'Security',
        message: `${config.name} Header vorhanden`,
      });
    } else {
      score -= config.penalty;
      findings.push({
        type: 'warning',
        category: 'Security',
        message: `${config.name} Header fehlt`,
      });
      recommendations.push({
        priority: config.penalty >= 10 ? 'P1' : 'P2',
        category: 'Security',
        text: `${config.name} Header hinzufügen für bessere Sicherheit`,
      });
    }
  }

  return { score: Math.max(0, score), findings, recommendations };
}

function analyzeSEO($: cheerio.CheerioAPI, url: string): { score: number; findings: Finding[]; recommendations: Recommendation[]; meta: CheckResult['meta'] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  let score = 100;

  // Title
  const title = $('title').text().trim();
  if (title) {
    if (title.length < 30) {
      score -= 10;
      findings.push({ type: 'warning', category: 'SEO', message: `Title zu kurz (${title.length} Zeichen)` });
      recommendations.push({ priority: 'P2', category: 'SEO', text: 'Title auf 50-60 Zeichen erweitern' });
    } else if (title.length > 60) {
      score -= 5;
      findings.push({ type: 'warning', category: 'SEO', message: `Title zu lang (${title.length} Zeichen)` });
      recommendations.push({ priority: 'P3', category: 'SEO', text: 'Title auf 50-60 Zeichen kürzen' });
    } else {
      findings.push({ type: 'success', category: 'SEO', message: `Title vorhanden (${title.length} Zeichen)` });
    }
  } else {
    score -= 20;
    findings.push({ type: 'error', category: 'SEO', message: 'Kein Title-Tag gefunden' });
    recommendations.push({ priority: 'P1', category: 'SEO', text: 'Title-Tag hinzufügen (50-60 Zeichen)' });
  }

  // Meta Description
  const description = $('meta[name="description"]').attr('content')?.trim() || null;
  if (description) {
    if (description.length < 120) {
      score -= 10;
      findings.push({ type: 'warning', category: 'SEO', message: `Meta-Description zu kurz (${description.length} Zeichen)` });
      recommendations.push({ priority: 'P2', category: 'SEO', text: 'Meta-Description auf 150-160 Zeichen erweitern' });
    } else if (description.length > 160) {
      score -= 5;
      findings.push({ type: 'warning', category: 'SEO', message: `Meta-Description zu lang (${description.length} Zeichen)` });
      recommendations.push({ priority: 'P3', category: 'SEO', text: 'Meta-Description auf 150-160 Zeichen kürzen' });
    } else {
      findings.push({ type: 'success', category: 'SEO', message: `Meta-Description vorhanden (${description.length} Zeichen)` });
    }
  } else {
    score -= 15;
    findings.push({ type: 'error', category: 'SEO', message: 'Keine Meta-Description gefunden' });
    recommendations.push({ priority: 'P1', category: 'SEO', text: 'Meta-Description hinzufügen (150-160 Zeichen)' });
  }

  // H1
  const h1s = $('h1');
  if (h1s.length === 0) {
    score -= 15;
    findings.push({ type: 'error', category: 'SEO', message: 'Keine H1-Überschrift gefunden' });
    recommendations.push({ priority: 'P1', category: 'SEO', text: 'Eine H1-Überschrift pro Seite hinzufügen' });
  } else if (h1s.length > 1) {
    score -= 5;
    findings.push({ type: 'warning', category: 'SEO', message: `Mehrere H1-Überschriften (${h1s.length})` });
    recommendations.push({ priority: 'P2', category: 'SEO', text: 'Nur eine H1-Überschrift pro Seite verwenden' });
  } else {
    findings.push({ type: 'success', category: 'SEO', message: 'H1-Überschrift vorhanden' });
  }

  // Canonical
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  if (canonical) {
    findings.push({ type: 'success', category: 'SEO', message: 'Canonical-URL definiert' });
  } else {
    score -= 5;
    findings.push({ type: 'info', category: 'SEO', message: 'Kein Canonical-Tag gefunden' });
    recommendations.push({ priority: 'P3', category: 'SEO', text: 'Canonical-URL setzen um Duplicate Content zu vermeiden' });
  }

  // Language
  const language = $('html').attr('lang') || null;
  if (language) {
    findings.push({ type: 'success', category: 'SEO', message: `Sprache definiert: ${language}` });
  } else {
    score -= 5;
    findings.push({ type: 'warning', category: 'SEO', message: 'Kein lang-Attribut im HTML-Tag' });
    recommendations.push({ priority: 'P2', category: 'SEO', text: 'lang-Attribut zum HTML-Tag hinzufügen (z.B. lang="de")' });
  }

  // Open Graph Tags
  const ogTags: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const property = $(el).attr('property');
    const content = $(el).attr('content');
    if (property && content) {
      ogTags[property] = content;
    }
  });

  if (Object.keys(ogTags).length > 0) {
    findings.push({ type: 'success', category: 'SEO', message: `Open Graph Tags vorhanden (${Object.keys(ogTags).length})` });
  } else {
    score -= 10;
    findings.push({ type: 'warning', category: 'SEO', message: 'Keine Open Graph Tags gefunden' });
    recommendations.push({ priority: 'P2', category: 'SEO', text: 'Open Graph Tags für bessere Social Media Darstellung hinzufügen' });
  }

  // Favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').length > 0;
  if (favicon) {
    findings.push({ type: 'success', category: 'SEO', message: 'Favicon vorhanden' });
  } else {
    score -= 5;
    findings.push({ type: 'warning', category: 'SEO', message: 'Kein Favicon gefunden' });
    recommendations.push({ priority: 'P3', category: 'SEO', text: 'Favicon hinzufügen' });
  }

  // Charset
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content')?.match(/charset=([^;]+)/)?.[1] || null;

  // Viewport
  const viewport = $('meta[name="viewport"]').length > 0;
  if (viewport) {
    findings.push({ type: 'success', category: 'SEO', message: 'Viewport Meta-Tag vorhanden' });
  } else {
    score -= 10;
    findings.push({ type: 'error', category: 'SEO', message: 'Kein Viewport Meta-Tag' });
    recommendations.push({ priority: 'P1', category: 'SEO', text: 'Viewport Meta-Tag für Mobile-Optimierung hinzufügen' });
  }

  return {
    score: Math.max(0, score),
    findings,
    recommendations,
    meta: {
      title: title || null,
      description,
      favicon,
      language,
      charset,
      viewport,
      canonical,
      ogTags,
    },
  };
}

function analyzeAccessibility($: cheerio.CheerioAPI): { score: number; findings: Finding[]; recommendations: Recommendation[] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  let score = 100;

  // Images without alt
  const images = $('img');
  const imagesWithoutAlt = images.filter((_, el) => !$(el).attr('alt'));

  if (images.length > 0) {
    if (imagesWithoutAlt.length === 0) {
      findings.push({ type: 'success', category: 'Accessibility', message: `Alle ${images.length} Bilder haben Alt-Texte` });
    } else {
      const percentage = Math.round((imagesWithoutAlt.length / images.length) * 100);
      score -= Math.min(30, percentage / 2);
      findings.push({ type: 'warning', category: 'Accessibility', message: `${imagesWithoutAlt.length} von ${images.length} Bildern ohne Alt-Text` });
      recommendations.push({ priority: 'P1', category: 'Accessibility', text: 'Alt-Texte für alle Bilder hinzufügen' });
    }
  }

  // Form labels
  const inputs = $('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select');
  const inputsWithoutLabel = inputs.filter((_, el) => {
    const id = $(el).attr('id');
    const ariaLabel = $(el).attr('aria-label');
    const ariaLabelledby = $(el).attr('aria-labelledby');
    const hasLabel = id ? $(`label[for="${id}"]`).length > 0 : false;
    return !hasLabel && !ariaLabel && !ariaLabelledby;
  });

  if (inputs.length > 0) {
    if (inputsWithoutLabel.length === 0) {
      findings.push({ type: 'success', category: 'Accessibility', message: 'Alle Formularfelder haben Labels' });
    } else {
      score -= 15;
      findings.push({ type: 'warning', category: 'Accessibility', message: `${inputsWithoutLabel.length} Formularfelder ohne Label` });
      recommendations.push({ priority: 'P1', category: 'Accessibility', text: 'Labels für alle Formularfelder hinzufügen' });
    }
  }

  // Links without text
  const links = $('a');
  const emptyLinks = links.filter((_, el) => {
    const text = $(el).text().trim();
    const ariaLabel = $(el).attr('aria-label');
    const title = $(el).attr('title');
    const hasImage = $(el).find('img[alt]').length > 0;
    return !text && !ariaLabel && !title && !hasImage;
  });

  if (emptyLinks.length > 0) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Accessibility', message: `${emptyLinks.length} Links ohne erkennbaren Text` });
    recommendations.push({ priority: 'P2', category: 'Accessibility', text: 'Linktext oder aria-label für alle Links hinzufügen' });
  } else if (links.length > 0) {
    findings.push({ type: 'success', category: 'Accessibility', message: 'Alle Links haben erkennbaren Text' });
  }

  // Skip link
  const skipLink = $('a[href="#main"], a[href="#content"], a.skip-link, a.skip-to-content').length > 0;
  if (skipLink) {
    findings.push({ type: 'success', category: 'Accessibility', message: 'Skip-Link vorhanden' });
  } else {
    score -= 5;
    findings.push({ type: 'info', category: 'Accessibility', message: 'Kein Skip-Link gefunden' });
    recommendations.push({ priority: 'P3', category: 'Accessibility', text: 'Skip-Link für Tastaturnavigation hinzufügen' });
  }

  // Heading hierarchy
  const headings = $('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  let hierarchyOk = true;

  headings.each((_, el) => {
    const level = parseInt(el.tagName.replace('h', ''));
    if (level > lastLevel + 1 && lastLevel !== 0) {
      hierarchyOk = false;
    }
    lastLevel = level;
  });

  if (headings.length > 0) {
    if (hierarchyOk) {
      findings.push({ type: 'success', category: 'Accessibility', message: 'Überschriften-Hierarchie korrekt' });
    } else {
      score -= 10;
      findings.push({ type: 'warning', category: 'Accessibility', message: 'Überschriften-Hierarchie nicht optimal' });
      recommendations.push({ priority: 'P2', category: 'Accessibility', text: 'Überschriften-Ebenen ohne Sprünge verwenden (H1 → H2 → H3)' });
    }
  }

  return { score: Math.max(0, score), findings, recommendations };
}

function analyzeStructure($: cheerio.CheerioAPI): { score: number; findings: Finding[]; recommendations: Recommendation[] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  let score = 100;

  // Semantic HTML
  const semanticElements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
  const foundSemantic = semanticElements.filter(el => $(el).length > 0);

  if (foundSemantic.length >= 3) {
    findings.push({ type: 'success', category: 'Structure', message: `Semantische HTML-Elemente: ${foundSemantic.join(', ')}` });
  } else if (foundSemantic.length > 0) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Structure', message: `Nur ${foundSemantic.length} semantische Elemente gefunden` });
    recommendations.push({ priority: 'P2', category: 'Structure', text: 'Mehr semantische HTML5-Elemente verwenden (header, nav, main, footer)' });
  } else {
    score -= 20;
    findings.push({ type: 'error', category: 'Structure', message: 'Keine semantischen HTML-Elemente gefunden' });
    recommendations.push({ priority: 'P1', category: 'Structure', text: 'Semantische HTML5-Elemente verwenden für bessere Zugänglichkeit' });
  }

  // Inline styles
  const inlineStyles = $('[style]').length;
  if (inlineStyles > 20) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Structure', message: `${inlineStyles} Inline-Styles gefunden` });
    recommendations.push({ priority: 'P3', category: 'Structure', text: 'Inline-Styles in externe CSS-Dateien auslagern' });
  } else if (inlineStyles > 0) {
    findings.push({ type: 'info', category: 'Structure', message: `${inlineStyles} Inline-Styles gefunden` });
  }

  // External scripts
  const scripts = $('script[src]');
  if (scripts.length > 15) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Structure', message: `${scripts.length} externe Skripte` });
    recommendations.push({ priority: 'P2', category: 'Structure', text: 'Anzahl externer Skripte reduzieren oder bundlen' });
  } else {
    findings.push({ type: 'info', category: 'Structure', message: `${scripts.length} externe Skripte` });
  }

  // Doctype
  // Note: Cheerio doesn't preserve doctype, so we check if HTML5 structure exists

  return { score: Math.max(0, score), findings, recommendations };
}

function analyzePerformance($: cheerio.CheerioAPI, loadTime: number, contentLength: number): { score: number; findings: Finding[]; recommendations: Recommendation[] } {
  const findings: Finding[] = [];
  const recommendations: Recommendation[] = [];
  let score = 100;

  // Load time
  if (loadTime < 1000) {
    findings.push({ type: 'success', category: 'Performance', message: `Schnelle Ladezeit: ${loadTime}ms` });
  } else if (loadTime < 3000) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Performance', message: `Ladezeit: ${loadTime}ms` });
    recommendations.push({ priority: 'P2', category: 'Performance', text: 'Ladezeit unter 1 Sekunde anstreben' });
  } else {
    score -= 25;
    findings.push({ type: 'error', category: 'Performance', message: `Langsame Ladezeit: ${loadTime}ms` });
    recommendations.push({ priority: 'P1', category: 'Performance', text: 'Ladezeit dringend optimieren (unter 3 Sekunden)' });
  }

  // Content size
  const sizeKB = Math.round(contentLength / 1024);
  if (sizeKB < 100) {
    findings.push({ type: 'success', category: 'Performance', message: `HTML-Größe: ${sizeKB} KB` });
  } else if (sizeKB < 500) {
    score -= 5;
    findings.push({ type: 'info', category: 'Performance', message: `HTML-Größe: ${sizeKB} KB` });
  } else {
    score -= 15;
    findings.push({ type: 'warning', category: 'Performance', message: `Große HTML-Datei: ${sizeKB} KB` });
    recommendations.push({ priority: 'P2', category: 'Performance', text: 'HTML-Größe reduzieren durch Minifizierung' });
  }

  // Image optimization hints
  const images = $('img');
  const imagesWithoutLazy = images.filter((_, el) => !$(el).attr('loading'));
  const imagesWithoutDimensions = images.filter((_, el) => !$(el).attr('width') || !$(el).attr('height'));

  if (images.length > 0) {
    if (imagesWithoutLazy.length > 0) {
      score -= 10;
      findings.push({ type: 'warning', category: 'Performance', message: `${imagesWithoutLazy.length} Bilder ohne Lazy Loading` });
      recommendations.push({ priority: 'P2', category: 'Performance', text: 'loading="lazy" für Bilder unterhalb des Folds hinzufügen' });
    }

    if (imagesWithoutDimensions.length > 0) {
      score -= 5;
      findings.push({ type: 'info', category: 'Performance', message: `${imagesWithoutDimensions.length} Bilder ohne Größenangaben` });
      recommendations.push({ priority: 'P3', category: 'Performance', text: 'width/height Attribute für Bilder setzen (verhindert Layout Shifts)' });
    }
  }

  // Render-blocking resources
  const blockingCSS = $('link[rel="stylesheet"]:not([media="print"])').length;
  const blockingJS = $('script:not([async]):not([defer]):not([type="module"])[src]').length;

  if (blockingJS > 3) {
    score -= 10;
    findings.push({ type: 'warning', category: 'Performance', message: `${blockingJS} render-blocking Skripte` });
    recommendations.push({ priority: 'P2', category: 'Performance', text: 'async oder defer für externe Skripte verwenden' });
  }

  return { score: Math.max(0, score), findings, recommendations };
}

// ═══════════════════════════════════════════════════════════════
//                    MAIN API HANDLER
// ═══════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting (20 Checks pro Stunde pro IP)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';
    const ipHash = hashIP(ip);

    const rateLimit = await checkRateLimit(ipHash, '/api/website-check', 20, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.',
          retryAfter: rateLimit.resetAt.toISOString(),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetAt.getTime() - Date.now()) / 1000)),
          },
        }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 });
    }

    // Validierung mit Zod
    const validation = validateInput(websiteCheckSchema, body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validierungsfehler', details: validation.errors },
        { status: 400 }
      );
    }

    const { url, email } = validation.data;

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json({ error: 'Ungültige URL' }, { status: 400 });
    }

    // Fetch the website
    const startTime = Date.now();
    let response: Response;

    try {
      response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent': 'AgentFlow-WebsiteCheck/1.0 (https://agentflow.de)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de,en;q=0.5',
        },
        redirect: 'follow',
      });
    } catch (fetchError) {
      return NextResponse.json({
        error: 'Website konnte nicht erreicht werden. Bitte URL prüfen.'
      }, { status: 400 });
    }

    const loadTime = Date.now() - startTime;
    const html = await response.text();
    const contentLength = new TextEncoder().encode(html).length;

    // Parse HTML
    const $ = cheerio.load(html);

    // Run all analyses
    const securityAnalysis = analyzeSecurityHeaders(response.headers);
    const seoAnalysis = analyzeSEO($, parsedUrl.toString());
    const accessibilityAnalysis = analyzeAccessibility($);
    const structureAnalysis = analyzeStructure($);
    const performanceAnalysis = analyzePerformance($, loadTime, contentLength);

    // HTTPS check
    const isHttps = parsedUrl.protocol === 'https:';
    if (isHttps) {
      securityAnalysis.findings.unshift({ type: 'success', category: 'Security', message: 'HTTPS aktiv' });
    } else {
      securityAnalysis.score -= 30;
      securityAnalysis.findings.unshift({ type: 'error', category: 'Security', message: 'Kein HTTPS!' });
      securityAnalysis.recommendations.unshift({ priority: 'P1', category: 'Security', text: 'Auf HTTPS umstellen - kritisch für Sicherheit und SEO' });
    }

    // Combine all findings and recommendations
    const allFindings = [
      ...securityAnalysis.findings,
      ...seoAnalysis.findings,
      ...accessibilityAnalysis.findings,
      ...structureAnalysis.findings,
      ...performanceAnalysis.findings,
    ];

    const allRecommendations = [
      ...securityAnalysis.recommendations,
      ...seoAnalysis.recommendations,
      ...accessibilityAnalysis.recommendations,
      ...structureAnalysis.recommendations,
      ...performanceAnalysis.recommendations,
    ].sort((a, b) => {
      const priorityOrder = { P1: 0, P2: 1, P3: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const overallScore = Math.round(
      (securityAnalysis.score + seoAnalysis.score + accessibilityAnalysis.score +
       performanceAnalysis.score + structureAnalysis.score) / 5
    );

    const result: CheckResult = {
      url: parsedUrl.toString(),
      timestamp: new Date().toISOString(),
      loadTime,
      scores: {
        security: securityAnalysis.score,
        seo: seoAnalysis.score,
        accessibility: accessibilityAnalysis.score,
        performance: performanceAnalysis.score,
        structure: structureAnalysis.score,
      },
      findings: allFindings,
      recommendations: allRecommendations,
      meta: seoAnalysis.meta,
      technical: {
        https: isHttps,
        responseTime: loadTime,
        contentLength,
        contentType: response.headers.get('content-type'),
        server: response.headers.get('server'),
      },
    };

    // In Supabase speichern
    const { error } = await supabaseAdmin
      .from('website_checks')
      .insert({
        url: parsedUrl.toString(),
        email: email || null,
        score_overall: overallScore,
        score_security: securityAnalysis.score,
        score_seo: seoAnalysis.score,
        score_accessibility: accessibilityAnalysis.score,
        score_performance: performanceAnalysis.score,
        score_structure: structureAnalysis.score,
        load_time: loadTime,
        https_enabled: isHttps,
        result_json: JSON.stringify(result),
        ip_hash: ipHash,
        user_agent: request.headers.get('user-agent') || null,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase insert error:', error);
      // Don't throw - still return results to user
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Website check error:', error);
    return NextResponse.json({
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
    }, { status: 500 });
  }
}
