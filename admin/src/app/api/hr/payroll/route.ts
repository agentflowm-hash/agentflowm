import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const month = request.nextUrl.searchParams.get('month');
  const year = request.nextUrl.searchParams.get('year');
  let query = db.from('payroll').select('*').order('created_at', { ascending: false });
  if (month) query = query.eq('month', month);
  if (year) query = query.eq('year', parseInt(year));
  const { data, error } = await query;
  if (error) throw new DatabaseError(error.message);
  return { payroll: data || [] };
});

export const POST = createHandler({ auth: true }, async (data: any) => {
  const { data: entry, error } = await db.from('payroll').insert({
    team_member_id: data.team_member_id, contract_id: data.contract_id || null,
    month: data.month, year: data.year, gross_amount: data.gross_amount,
    net_amount: data.net_amount || null, tax_amount: data.tax_amount || null,
    social_security: data.social_security || null, bonus: data.bonus || 0,
    deductions: data.deductions || 0, notes: data.notes || null,
  }).select().single();
  if (error) throw new DatabaseError(error.message);
  return { payroll: entry };
});
