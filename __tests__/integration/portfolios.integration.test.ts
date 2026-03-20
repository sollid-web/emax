import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

describe('portfolios table', () => {
  let testUserId: string;
  let testPortfolioId: string;

  beforeAll(async () => {
    const { data, error } = await supabaseTest.auth.admin.createUser({
      email: `portfolio_${Date.now()}@test.com`,
      password: 'testpass123',
      email_confirm: true,
    });
    if (error) throw new Error(`User setup failed: ${error.message}`);
    testUserId = data.user.id;

    const { data: portfolio, error: portError } = await supabaseTest.from('portfolios').insert({
      user_id: testUserId,
      total_invested: 1000,
      current_balance: 1050,
      total_profit: 50,
      profit_percentage: 5,
    }).select().single();
    if (portError) throw new Error(`Portfolio setup failed: ${portError.message}`);
    testPortfolioId = portfolio.id;
  }, 30000);

  afterAll(async () => {
    await supabaseTest.from('portfolios').delete().eq('id', testPortfolioId);
    await supabaseTest.auth.admin.deleteUser(testUserId);
  }, 30000);

  it('fetches portfolio by id', async () => {
    const { data, error } = await supabaseTest.from('portfolios').select('*').eq('id', testPortfolioId).single();
    expect(error).toBeNull();
    expect(data.total_invested).toBe(1000);
    expect(data.current_balance).toBe(1050);
    expect(data.total_profit).toBe(50);
    expect(data.profit_percentage).toBe(5);
  });

  it('fetches portfolio by user_id', async () => {
    const { data, error } = await supabaseTest.from('portfolios').select('*').eq('user_id', testUserId).single();
    expect(error).toBeNull();
    expect(data.user_id).toBe(testUserId);
  });

  it('updates portfolio after investment profit', async () => {
    const { data, error } = await supabaseTest.from('portfolios').update({ current_balance: 1150, total_profit: 150, profit_percentage: 15 }).eq('id', testPortfolioId).select().single();
    expect(error).toBeNull();
    expect(data.current_balance).toBe(1150);
    expect(data.total_profit).toBe(150);
    expect(data.profit_percentage).toBe(15);
  });
});
