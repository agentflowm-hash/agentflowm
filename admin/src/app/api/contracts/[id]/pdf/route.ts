/**
 * ═══════════════════════════════════════════════════════════════
 *                    CONTRACT PDF API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import { NextRequest } from 'next/server';
import { generateContractHTML } from '@/lib/contract-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: contract, error } = await db
    .from('contracts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !contract) {
    return Response.json({ success: false, error: 'Contract not found' }, { status: 404 });
  }

  const html = generateContractHTML(contract);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
