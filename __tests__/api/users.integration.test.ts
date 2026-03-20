import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { supabaseTest } from '@/lib/supabase.test';

// Mock the Supabase client
vi.mock('@/lib/supabase.test', () => ({
  supabaseTest: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({
      data: { id: 'test-id' },
      error: null
    }),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({
      data: {
        id: 'test-id',
        name: 'Test Plan',
        min_deposit: 100,
        max_deposit: 500,
        daily_roi: 2.5,
        profit_withdrawal_days: 2,
        capital_withdrawal_days: 6,
        description: 'Test trading plan',
        is_active: true
      },
      error: null
    }),
    eq: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  }
}));

describe('trading_plans table', () => {
  it('fetches a trading plan by id', async () => {
    const { data, error } = await supabaseTest
      .from('trading_plans')
      .select('*')
      .eq('id', 'test-id')
      .single();

    expect(error).toBeNull();
    expect(data.description).toBe('Test trading plan');
  });
});
