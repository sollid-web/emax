import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('users table', () => {
  let testUserId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `user_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`Setup failed: ${error.message}`);
    testUserId = data.user.id;

    await supabaseTest.from('users').upsert({
      id: testUserId,
      email: `user_${Date.now()}@test.com`,
      full_name: 'Integration Test User',
      username: `testuser_${Date.now()}`,
      balance: 5000,
      total_invested: 0,
      total_earnings: 0,
      kyc_status: 'not_started',
      is_admin: false,
      account_status: 'active',
    });
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('users').delete().eq('id', testUserId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches user by id', async () => {
    const { data, error } = await supabaseTest.from('users').select('*').eq('id', testUserId).single();
    expect(error).toBeNull();
    expect(data.full_name).toBe('Integration Test User');
    expect(data.balance).toBe(5000);
    expect(data.kyc_status).toBe('not_started');
    expect(data.is_admin).toBe(false);
  });

  it('updates user balance', async () => {
    const { data, error } = await supabaseTest.from('users').update({ balance: 7500 }).eq('id', testUserId).select().single();
    expect(error).toBeNull();
    expect(data.balance).toBe(7500);
  });

  it('updates kyc_status', async () => {
    const { data, error } = await supabaseTest.from('users').update({ kyc_status: 'pending' }).eq('id', testUserId).select().single();
    expect(error).toBeNull();
    expect(data.kyc_status).toBe('pending');
  });

  it('updates account_status to suspended', async () => {
    const { data, error } = await supabaseTest.from('users').update({ account_status: 'suspended' }).eq('id', testUserId).select().single();
    expect(error).toBeNull();
    expect(data.account_status).toBe('suspended');
  });

  it('updates total_invested and total_earnings', async () => {
    const { data, error } = await supabaseTest.from('users').update({ total_invested: 2000, total_earnings: 500 }).eq('id', testUserId).select().single();
    expect(error).toBeNull();
    expect(data.total_invested).toBe(2000);
    expect(data.total_earnings).toBe(500);
  });
});
