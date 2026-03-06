import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('investments table', () => {
  let testUserId: string;
  let testPlanId: string;
  let testInvestmentId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `invest_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: plan } = await supabaseTest.from('trading_plans').select('id').eq('is_active', true).limit(1).single();
    testPlanId = plan.id;

    const { data: inv, error: invError } = await supabaseTest.from('investments').insert({
      user_id: testUserId,
      plan_id: testPlanId,
      amount: 500,
      daily_roi: 1.5,
      status: 'pending',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).select().single();
    if (invError) throw new Error(`Investment setup failed: ${invError.message}`);
    testInvestmentId = inv.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('investments').delete().eq('id', testInvestmentId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches investment by id', async () => {
    const { data, error } = await supabaseTest.from('investments').select('*').eq('id', testInvestmentId).single();
    expect(error).toBeNull();
    expect(data.amount).toBe(500);
    expect(data.daily_roi).toBe(1.5);
    expect(data.status).toBe('pending');
  });

  it('fetches investments by user_id', async () => {
    const { data, error } = await supabaseTest.from('investments').select('*').eq('user_id', testUserId);
    expect(error).toBeNull();
    expect(data!.length).toBeGreaterThan(0);
  });

  it('approves investment', async () => {
    const { data, error } = await supabaseTest.from('investments').update({ status: 'active', approved_at: new Date().toISOString() }).eq('id', testInvestmentId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('active');
    expect(data.approved_at).not.toBeNull();
  });

  it('updates total_profit and total_roi_earned', async () => {
    const { data, error } = await supabaseTest.from('investments').update({ total_profit: 75, total_roi_earned: 7.5 }).eq('id', testInvestmentId).select().single();
    expect(error).toBeNull();
    expect(data.total_profit).toBe(75);
    expect(data.total_roi_earned).toBe(7.5);
  });

  it('completes investment', async () => {
    const { data, error } = await supabaseTest.from('investments').update({ status: 'completed' }).eq('id', testInvestmentId).select().single();
    expect(error).toBeNull();
    expect(data.status).toBe('completed');
  });
});
