/**
 * ═══════════════════════════════════════════════════════════════
 *                    PRIVACY DOCUMENT PDF API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { generatePrivacyDocHTML } from '@/lib/privacy-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: doc, error } = await db
    .from('privacy_documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !doc) {
    return Response.json({ success: false, error: 'Document not found' }, { status: 404 });
  }

  const html = generatePrivacyDocHTML(doc);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
