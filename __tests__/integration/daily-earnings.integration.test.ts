import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('daily_earnings table', () => {
  let testUserId: string;
  let testInvestmentId: string;
  let testEarningId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `earning_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: plan } = await supabaseTest.from('trading_plans').select('id').eq('is_active', true).limit(1).single();

    const { data: inv } = await supabaseTest.from('investments').insert({
      user_id: testUserId,
      plan_id: plan.id,
      amount: 500,
      daily_roi: 1.5,
      status: 'active',
    }).select().single();
    testInvestmentId = inv.id;

    const { data: earning, error: earnError } = await supabaseTest.from('daily_earnings').insert({
      investment_id: testInvestmentId,
      user_id: testUserId,
      amount: 7.5,
      status: 'pending',
    }).select().single();
    if (earnError) throw new Error(`Earning setup failed: ${earnError.message}`);
    testEarningId = earning.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('daily_earnings').delete().eq('id', testEarningId);
    await supabaseTest.from('investments').delete().eq('id', testInvestmentId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches daily earning by id', async () => {
    const { data, error } = await supabaseTest.from('daily_earnings').select('*').eq('id', testEarningId).single();
    expect(error).toBeNull();
    expect(data.amount).toBe(7.5);
    expect(data.status).toBe('pending');
    expect(data.user_id).toBe(testUserId);
  });

  it('fetches earnings by user_id', async () => {
    const { data, error } = await supabaseTest.from('daily_earnings').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('fetches earnings by investment_id', async () => {
    const { data, error } = await supabaseTest.from('daily_earnings').select('*').eq('investment_id', testInvestmentId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('marks earning as paid', async () => {
    const { data, error } = await supabaseTest.from('daily_earnings').update({ status: 'paid' }).eq('id', testEarningId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('paid');
  });
});
