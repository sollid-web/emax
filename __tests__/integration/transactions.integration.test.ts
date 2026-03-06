import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('transactions table', () => {
  let testUserId: string;
  let testTransactionId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `txn_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: txn, error: txnError } = await supabaseTest.from('transactions').insert({
      user_id: testUserId,
      transaction_type: 'deposit',
      amount: 1000,
      description: 'Test deposit transaction',
      status: 'pending',
    }).select().single();
    if (txnError) throw new Error(`Transaction setup failed: ${txnError.message}`);
    testTransactionId = txn.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('transactions').delete().eq('user_id', testUserId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches transaction by id', async () => {
    const { data, error } = await supabaseTest.from('transactions').select('*').eq('id', testTransactionId).single();
    expect(error).toBeNull();
    expect(data.amount).toBe(1000);
    expect(data.transaction_type).toBe('deposit');
    expect(data.status).toBe('pending');
  });

  it('fetches transactions by user_id', async () => {
    const { data, error } = await supabaseTest.from('transactions').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('updates transaction status to completed', async () => {
    const { data, error } = await supabaseTest.from('transactions').update({ status: 'completed' }).eq('id', testTransactionId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('completed');
  });

  it('creates withdrawal transaction', async () => {
    const { data, error } = await supabaseTest.from('transactions').insert({
      user_id: testUserId,
      transaction_type: 'withdrawal',
      amount: 200,
      description: 'Test withdrawal',
      status: 'pending',
    }).select().single();
    expect(error).toBeNull();
    expect(data.transaction_type).toBe('withdrawal');
  });

  it('creates profit transaction', async () => {
    const { data, error } = await supabaseTest.from('transactions').insert({
      user_id: testUserId,
      transaction_type: 'profit',
      amount: 50,
      description: 'Daily ROI profit',
      status: 'completed',
    }).select().single();
    expect(error).toBeNull();
    expect(data.transaction_type).toBe('profit');
  });
});
