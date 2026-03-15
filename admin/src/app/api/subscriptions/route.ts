import { db } from '@/lib/db';
import { createHandler } from '@/lib/api';

// GET /api/subscriptions
export const GET = createHandler({ auth: true }, async () => {
  const { data, error } = await db.from('subscriptions').select('*').order('next_billing', { ascending: true });
  if (error) return { subscriptions: [], error: error.message };
  const subs = data || [];
  return {
    subscriptions: subs,
    stats: {
      total: subs.length,
      active: subs.filter(s => s.status === 'active').length,
      mrr: subs.filter(s => s.status === 'active').reduce((sum, s) => {
        const amt = Number(s.amount);
        if (s.interval === 'monthly') return sum + amt;
        if (s.interval === 'quarterly') return sum + amt / 3;
        if (s.interval === 'yearly') return sum + amt / 12;
        return sum;
      }, 0),
      dueSoon: subs.filter(s => s.status === 'active' && new Date(s.next_billing) <= new Date(Date.now() + 7 * 86400000)).length,
    },
  };
});

// POST /api/subscriptions
export const POST = createHandler({ auth: true }, async (data) => {
  const { client_id, client_name, client_email, plan, description, amount, tax_rate, interval, next_billing, notes } = data as any;
  const { data: sub, error } = await db
    .from('subscriptions')
    .insert({ client_id, client_name, client_email, plan, description, amount, tax_rate: tax_rate || 19, interval: interval || 'monthly', next_billing, notes })
    .select().single();
  if (error) return { error: error.message };
  return { subscription: sub };
});
