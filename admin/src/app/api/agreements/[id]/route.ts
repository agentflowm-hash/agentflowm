import { createHandler } from '@/lib/api/handler';
import { db } from '@/lib/db';
import { z } from 'zod';
import { DatabaseError, NotFoundError } from '@/lib/api/errors';
import { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────────────────────
// GET /api/agreements/[id] - Get single agreement
// ─────────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const { data: agreement, error } = await db
    .from('agreements')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !agreement) {
    return Response.json({ success: false, error: { code: 'NOT_FOUND', message: 'Agreement not found' } }, { status: 404 });
  }

  return Response.json({ success: true, data: { agreement } });
}

// ─────────────────────────────────────────────────────────────────
// PATCH /api/agreements/[id] - Update agreement
// ─────────────────────────────────────────────────────────────────

const UpdateAgreementSchema = z.object({
  client_name: z.string().min(1).optional(),
  client_company: z.string().optional(),
  client_address: z.string().optional(),
  client_email: z.string().email().optional(),
  project_title: z.string().min(1).optional(),
  project_description: z.string().optional(),
  services: z.array(z.string()).optional(),
  amount: z.number().min(0).optional(),
  tax_rate: z.number().optional(),
  payment_terms: z.string().optional(),
  project_duration: z.string().optional(),
  start_date: z.string().optional(),
  portal_code: z.string().optional(),
  status: z.enum(['draft', 'sent', 'signed', 'cancelled']).optional(),
  notes: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const data = UpdateAgreementSchema.parse(body);
    
    // Recalculate tax if amount or tax_rate changed
    const updates: Record<string, unknown> = { ...data, updated_at: new Date().toISOString() };
    
    if (data.amount !== undefined || data.tax_rate !== undefined) {
      // Get current values
      const { data: current } = await db.from('agreements').select('amount, tax_rate').eq('id', id).single();
      const amount = data.amount ?? current?.amount ?? 0;
      const taxRate = data.tax_rate ?? current?.tax_rate ?? 19;
      
      updates.tax_amount = Math.round(amount * taxRate) / 100;
      updates.total_amount = amount + (updates.tax_amount as number);
    }
    
    // Set sent_at/signed_at timestamps
    if (data.status === 'sent' && !updates.sent_at) {
      updates.sent_at = new Date().toISOString();
    }
    if (data.status === 'signed' && !updates.signed_at) {
      updates.signed_at = new Date().toISOString();
    }
    
    const { data: agreement, error } = await db
      .from('agreements')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return Response.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, { status: 500 });
    }

    return Response.json({ success: true, data: { agreement } });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return Response.json({ success: false, error: { code: 'VALIDATION_ERROR', message: e.issues[0].message } }, { status: 400 });
    }
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────────
// DELETE /api/agreements/[id] - Delete agreement
// ─────────────────────────────────────────────────────────────────

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const { error } = await db
    .from('agreements')
    .delete()
    .eq('id', id);

  if (error) {
    return Response.json({ success: false, error: { code: 'DATABASE_ERROR', message: error.message } }, { status: 500 });
  }

  return Response.json({ success: true, data: { deleted: true } });
}
