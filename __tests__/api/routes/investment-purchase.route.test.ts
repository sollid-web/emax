import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const { POST } = await import('@/app/api/investments/purchase/route');

const makeRequest = (body: object, token = 'valid-token') =>
  new NextRequest('http://localhost/api/investments/purchase', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });

describe('POST /api/investments/purchase', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth header', async () => {
    const req = new NextRequest('http://localhost/api/investments/purchase', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when plan_id or amount missing or invalid', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const res1 = await POST(makeRequest({ amount: 100 }));
    expect(res1.status).toBe(400);
    const res2 = await POST(makeRequest({ plan_id: 'plan-1' }));
    expect(res2.status).toBe(400);
    // invalid amount (non-positive)
    const res3 = await POST(makeRequest({ plan_id: 'plan-1', amount: 0 }));
    expect(res3.status).toBe(400);
  });

  it('returns 404 when trading plan not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === 'trading_plans') {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }) }),
        };
      }
      return {} as any;
    });

    const res = await POST(makeRequest({ plan_id: 'unknown', amount: 100 }));
    expect(res.status).toBe(404);
  });

  it('returns 404 when user profile not found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const planObj = { id: 'plan-1', is_active: true, min_deposit: 50, max_deposit: 1000, daily_roi: 2, capital_withdrawal_days: 30, name: 'Test' };
    mockFrom.mockImplementation((table: string) => {
      if (table === 'trading_plans') {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ single: async () => ({ data: planObj }) }) }) }),
        };
      }
      if (table === 'users') {
        return { select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) }) };
      }
      // other tables not needed for this test
      return {} as any;
    });

    const res = await POST(makeRequest({ plan_id: 'plan-1', amount: 100 }));
    expect(res.status).toBe(404);
  });

  it('returns 400 if KYC not approved', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const planObj = { id: 'plan-1', is_active: true, min_deposit: 50, max_deposit: 1000, daily_roi: 2, capital_withdrawal_days: 30, name: 'Test' };
    const profile = { id: 'user-1', kyc_status: 'pending', balance: 500 };
    mockFrom.mockImplementation((table: string) => {
      if (table === 'trading_plans') {
        return { select: () => ({ eq: () => ({ eq: () => ({ single: async () => ({ data: planObj }) }) }) }) };
      }
      if (table === 'users') {
        return { select: () => ({ eq: () => ({ single: async () => ({ data: profile }) }) }) };
      }
      return {} as any;
    });

    const res = await POST(makeRequest({ plan_id: 'plan-1', amount: 100 }));
    expect(res.status).toBe(400);
  });

  it('returns 400 if insufficient balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const planObj = { id: 'plan-1', is_active: true, min_deposit: 50, max_deposit: 1000, daily_roi: 2, capital_withdrawal_days: 30, name: 'Test' };
    const profile = { id: 'user-1', kyc_status: 'approved', balance: 50 }; // less than amount
    mockFrom.mockImplementation((table: string) => {
      if (table === 'trading_plans') {
        return { select: () => ({ eq: () => ({ eq: () => ({ single: async () => ({ data: planObj }) }) }) }) };
      }
      if (table === 'users') {
        return { select: () => ({ eq: () => ({ single: async () => ({ data: profile }) }) }) };
      }
      return {} as any;
    });

    const res = await POST(makeRequest({ plan_id: 'plan-1', amount: 100 }));
    expect(res.status).toBe(400);
  });

  it('creates an investment when all checks pass', { timeout: 15000 }, async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    const planObj = { id: 'plan-1', is_active: true, min_deposit: 50, max_deposit: 1000, daily_roi: 2, capital_withdrawal_days: 30, name: 'Test' };
    const profile = { id: 'user-1', kyc_status: 'approved', balance: 500, total_invested: 0 };
    const fakeInvestment = { id: 'inv-1', daily_roi: 2, amount: 100 };

    // sequentially satisfy each call to supabase.from
    mockFrom
      .mockReturnValueOnce({
        select: () => ({ eq: () => ({ eq: () => ({ single: async () => ({ data: planObj }) }) }) }),
      } as any)
      .mockReturnValueOnce({
        select: () => ({ eq: () => ({ single: async () => ({ data: profile }) }) }),
      } as any)
      .mockReturnValueOnce({
        insert: () => ({ select: () => ({ single: async () => ({ data: fakeInvestment }) }) }),
      } as any)
      .mockReturnValueOnce({
        update: () => ({ eq: () => Promise.resolve({ error: null }) }),
      } as any)
      .mockReturnValueOnce({
        insert: () => Promise.resolve({}),
      } as any);

    const res = await POST(makeRequest({ plan_id: 'plan-1', amount: 100 }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.investment).toEqual(fakeInvestment);
    // the ROI should be included in returned investment
    expect(body.investment.daily_roi).toBe(2);
  });

});
