/**
 * ═══════════════════════════════════════════════════════════════
 *                    PDF GENERATOR
 * ═══════════════════════════════════════════════════════════════
 * Wandelt HTML-Templates in echte PDF-Dateien um.
 * Nutzt puppeteer-core + @sparticuz/chromium-min (Vercel-kompatibel).
 *
 * Usage:
 * ```ts
 * import { htmlToPdf } from '@/lib/pdf';
 * const pdfBuffer = await htmlToPdf(htmlString, { format: 'A4' });
 * ```
 */

import puppeteer from 'puppeteer-core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
let chromium: any;
try { chromium = require('@sparticuz/chromium-min'); } catch { chromium = null; }

// Chromium binary URL fuer serverless (Vercel)
const CHROMIUM_URL = 'https://github.com/nichochar/chromium-binaries/releases/download/v131.0.3/chromium-v131.0.3-pack.tar';

let cachedBrowser: any = null;

async function getBrowser() {
  if (cachedBrowser) return cachedBrowser;

  const isLocal = process.env.NODE_ENV === 'development' || !process.env.VERCEL;

  if (isLocal) {
    // Lokal: Versuche System-Chrome zu finden
    const possiblePaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
    ];

    let executablePath = '';
    for (const p of possiblePaths) {
      try {
        const fs = await import('fs');
        if (fs.existsSync(p)) { executablePath = p; break; }
      } catch { /* skip */ }
    }

    if (!executablePath) {
      throw new Error('Chrome/Chromium nicht gefunden. Bitte Google Chrome installieren.');
    }

    cachedBrowser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  } else {
    // Vercel/Serverless: Chromium-min verwenden
    const executablePath = await chromium.executablePath(CHROMIUM_URL);
    cachedBrowser = await puppeteer.launch({
      executablePath,
      headless: chromium.headless as any,
      args: chromium.args,
    });
  }

  return cachedBrowser;
}

export interface PdfOptions {
  format?: 'A4' | 'A5' | 'Letter';
  landscape?: boolean;
  margin?: { top?: string; right?: string; bottom?: string; left?: string };
  printBackground?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  displayHeaderFooter?: boolean;
}

/**
 * Wandelt einen HTML-String in einen PDF-Buffer um.
 */
export async function htmlToPdf(
  html: string,
  options: PdfOptions = {}
): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 15000 });

    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      landscape: options.landscape || false,
      printBackground: options.printBackground !== false,
      margin: options.margin || {
        top: '15mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || '',
      footerTemplate: options.footerTemplate || '',
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}

/**
 * Erstellt eine NextResponse mit PDF-Content-Type und korrektem Filename.
 */
export function pdfResponse(pdfBuffer: Buffer, filename: string): Response {
  return new Response(new Uint8Array(pdfBuffer) as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
