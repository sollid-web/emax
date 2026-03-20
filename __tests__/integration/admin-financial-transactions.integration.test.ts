import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('admin_financial_transactions table', () => {
  let testUserId: string;
  let testTxnId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `aft_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: txn, error: txnError } = await supabaseTest.from('admin_financial_transactions').insert({
      user_id: testUserId,
      operation_type: 'credit',
      amount: 500,
      currency: 'USD',
      reason: 'Test credit by admin',
      before_balance: 1000,
      after_balance: 1500,
      status: 'completed',
    }).select().single();
    if (txnError) throw new Error(`Txn setup failed: ${txnError.message}`);
    testTxnId = txn.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('admin_financial_transactions').delete().eq('id', testTxnId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches transaction by id', async () => {
    const { data, error } = await supabaseTest.from('admin_financial_transactions').select('*').eq('id', testTxnId).single();
    expect(error).toBeNull();
    expect(data.operation_type).toBe('credit');
    expect(data.amount).toBe(500);
    expect(data.before_balance).toBe(1000);
    expect(data.after_balance).toBe(1500);
    expect(data.status).toBe('completed');
  });

  it('fetches transactions by user_id', async () => {
    const { data, error } = await supabaseTest.from('admin_financial_transactions').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('creates debit transaction', async () => {
    const { data, error } = await supabaseTest.from('admin_financial_transactions').insert({
      user_id: testUserId,
      operation_type: 'debit',
      amount: 200,
      currency: 'USD',
      reason: 'Test debit by admin',
      before_balance: 1500,
      after_balance: 1300,
      status: 'completed',
    }).select().single();
    expect(error).toBeNull();
    expect(data.operation_type).toBe('debit');
    expect(data.after_balance).toBe(1300);
    await supabaseTest.from('admin_financial_transactions').delete().eq('id', data.id);
  });
});
