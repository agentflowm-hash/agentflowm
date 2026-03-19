import { db } from '@/lib/db';
import { createHandler, DatabaseError } from '@/lib/api';

// GET /api/accounting
export const GET = createHandler({ auth: true }, async (_data, _ctx, request) => {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const month = searchParams.get('month');

  let query = db.from('accounting_transactions').select('*').order('date', { ascending: false });
  if (type) query = query.eq('type', type);
  if (month) {
    const [year, m] = month.split('-');
    const start = `${year}-${m}-01`;
    const lastDay = new Date(parseInt(year), parseInt(m), 0).getDate();
    const end = `${year}-${m}-${String(lastDay).padStart(2, '0')}`;
    query = query.gte('date', start).lte('date', end);
  }

  const { data, error } = await query;
  if (error) throw new DatabaseError(error.message);

  const transactions = data || [];
  const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0);

  return {
    transactions,
    stats: {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      count: transactions.length,
    },
  };
});

// POST /api/accounting
export const POST = createHandler({ auth: true }, async (data) => {
  const { date, description, category, type, amount, tax_rate, account, reference, notes, invoice_id, client_id } = data as any;

  if (!description || !type || !amount || typeof amount !== 'number') {
    throw new DatabaseError('Pflichtfelder: description, type, amount');
  }

  const rate = tax_rate ?? 19;
  const taxAmount = Math.round((amount * rate) / (100 + rate) * 100) / 100;
  const netAmount = Math.round((amount - taxAmount) * 100) / 100;

  const { data: transaction, error } = await db
    .from('accounting_transactions')
    .insert({
      date: date || new Date().toISOString().split('T')[0],
      description, category, type,
      amount, tax_rate: rate,
      tax_amount: taxAmount, net_amount: netAmount,
      account: account || 'Geschäftskonto',
      reference, notes, invoice_id, client_id,
    })
    .select()
    .single();

  if (error) throw new DatabaseError(error.message);
  return { transaction };
});
