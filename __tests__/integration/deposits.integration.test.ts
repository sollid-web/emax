import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('deposits table', () => {
  let testUserId: string;
  let testDepositId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `deposit_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: deposit, error: depError } = await supabaseTest.from('deposits').insert({
      user_id: testUserId,
      amount: 1000,
      currency: 'BTC',
      wallet_address_used: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
      status: 'pending',
    }).select().single();
    if (depError) throw new Error(`Deposit setup failed: ${depError.message}`);
    testDepositId = deposit.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('deposits').delete().eq('id', testDepositId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches deposit by id', async () => {
    const { data, error } = await supabaseTest.from('deposits').select('*').eq('id', testDepositId).single();
    expect(error).toBeNull();
    expect(data.amount).toBe(1000);
    expect(data.currency).toBe('BTC');
    expect(data.status).toBe('pending');
  });

  it('fetches deposits by user_id', async () => {
    const { data, error } = await supabaseTest.from('deposits').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('approves deposit', async () => {
    const { data, error } = await supabaseTest.from('deposits').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', testDepositId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('approved');
    expect(data.approved_at).not.toBeNull();
  });

  it('completes deposit', async () => {
    const { data, error } = await supabaseTest.from('deposits').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', testDepositId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('completed');
  });

  it('rejects deposit with reason', async () => {
    const { data, error } = await supabaseTest.from('deposits').update({ status: 'rejected', rejection_reason: 'Invalid transaction hash' }).eq('id', testDepositId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(data.rejection_reason).toBe('Invalid transaction hash');
  });
});
