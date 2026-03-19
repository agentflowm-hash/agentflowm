import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('employee_contracts').select('*').order('created_at', { ascending: false });
  if (error) throw new DatabaseError(error.message);
  return { contracts: data || [] };
});

export const POST = createHandler({ auth: true }, async (data: any) => {
  const { data: contract, error } = await db.from('employee_contracts').insert({
    team_member_id: data.team_member_id, contract_type: data.contract_type, title: data.title,
    start_date: data.start_date, end_date: data.end_date || null,
    monthly_salary: data.monthly_salary || null, hourly_rate: data.hourly_rate || null,
    weekly_hours: data.weekly_hours || null, tax_class: data.tax_class || null, notes: data.notes || null,
  }).select().single();
  if (error) throw new DatabaseError(error.message);
  return { contract };
});
