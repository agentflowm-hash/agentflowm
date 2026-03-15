import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

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
    const end = new Date(parseInt(year), parseInt(m), 0).toISOString().split('T')[0];
    query = query.gte('date', start).lte('date', end);
  }

  const { data, error } = await query;
  if (error) return { transactions: [], error: error.message };

  const transactions = data || [];
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0);

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
  const taxAmount = Math.round((amount * tax_rate) / (100 + tax_rate) * 100) / 100;
  const netAmount = Math.round((amount - taxAmount) * 100) / 100;

  const { data: transaction, error } = await db
    .from('accounting_transactions')
    .insert({
      date: date || new Date().toISOString().split('T')[0],
      description, category, type,
      amount, tax_rate: tax_rate || 19,
      tax_amount: taxAmount, net_amount: netAmount,
      account: account || 'Geschäftskonto',
      reference, notes, invoice_id, client_id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { transaction };
});
