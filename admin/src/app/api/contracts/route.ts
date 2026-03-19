/**
 * ═══════════════════════════════════════════════════════════════
 *                    CONTRACTS API
 * ═══════════════════════════════════════════════════════════════
 */

import { db } from '@/lib/db';
import {
  createHandler,
  DatabaseError,
} from '@/lib/api';
import { logActivity } from '@/lib/activity';

// ─────────────────────────────────────────────────────────────────
// GET /api/contracts - List contracts with optional filters
// ─────────────────────────────────────────────────────────────────

export const GET = createHandler({
  auth: true,
}, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const contractType = searchParams.get('contract_type');

  let query = db
    .from('contracts')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }
  if (contractType) {
    query = query.eq('contract_type', contractType);
  }

  const { data: contracts, error } = await query;

  if (error) throw new DatabaseError(error.message);

  return { contracts: contracts || [] };
});

// ─────────────────────────────────────────────────────────────────
// POST /api/contracts - Create new contract
// ─────────────────────────────────────────────────────────────────

export const POST = createHandler({
  auth: true,
}, async (data: any) => {
  const { data: contract, error } = await db
    .from('contracts')
    .insert({
      title: data.title,
      contract_type: data.contract_type,
      party_name: data.party_name,
      party_email: data.party_email || null,
      party_company: data.party_company || null,
      content: data.content || '',
      status: data.status || 'draft',
      valid_from: data.valid_from || null,
      valid_until: data.valid_until || null,
      monthly_amount: data.monthly_amount || null,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);

  await logActivity('contract_created', 'contract', contract.id, data.title, {
    contract_type: data.contract_type,
    party_name: data.party_name,
  });

  return { contract };
});
