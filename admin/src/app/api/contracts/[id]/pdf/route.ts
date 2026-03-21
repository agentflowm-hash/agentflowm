/**
 * CONTRACT PDF API — Echtes PDF
 */

import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { generateContractHTML } from '@/lib/contract-template';
import { htmlToPdf, pdfResponse } from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const format = request.nextUrl.searchParams.get('format');

  const { data: contract, error } = await db
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contract) {
    return Response.json({ success: false, error: 'Contract not found' }, { status: 404 });
  }

  const html = generateContractHTML(contract);

  if (format === 'html') {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  try {
    const pdf = await htmlToPdf(html);
    return pdfResponse(pdf, `Vertrag-${contract.title || id}.pdf`);
  } catch {
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }
}
