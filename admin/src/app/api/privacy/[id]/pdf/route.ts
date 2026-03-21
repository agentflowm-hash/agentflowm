/**
 * PRIVACY DOCUMENT PDF API — Echtes PDF
 */

import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { generatePrivacyDocHTML } from '@/lib/privacy-template';
import { htmlToPdf, pdfResponse } from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const format = request.nextUrl.searchParams.get('format');

  const { data: doc, error } = await db
    .from('privacy_documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !doc) {
    return Response.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  const html = generatePrivacyDocHTML(doc);

  if (format === 'html') {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const pdf = await htmlToPdf(html);
    return pdfResponse(pdf, `Datenschutz-${doc.title || id}.pdf`);
  } catch {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
