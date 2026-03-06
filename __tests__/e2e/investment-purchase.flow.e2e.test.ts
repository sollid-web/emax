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

const mockPlan = {
  id: 'plan-123',
  name: 'Consensus',
  min_deposit: 250,
  max_deposit: 999,
  daily_roi: 1.5,
  capital_withdrawal_days: 3,
  is_active: true,
};

const mockUser = { id: 'user-123' };

const mockUserProfile = {
  id: 'user-123',
  balance: 5000,
  total_invested: 0,
  kyc_status: 'approved',
};

describe('E2E: Investment Purchase Flow', () => {
  beforeEach(() => vi.clearAllMocks());

  it('STEP 1 — rejects unauthenticated request', async () => {
    const req = new NextRequest('http://localhost/api/investments/purchase', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('STEP 2 — rejects invalid token', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it('STEP 3 — rejects missing plan or amount', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    const res = await POST(makeRequest({ plan_id: 'plan-123' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid plan or amount');
  });

  it('STEP 4 — rejects non-existent plan', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    });
    const res = await POST(makeRequest({ plan_id: 'bad-plan', amount: 500 }));
    expect(res.status).toBe(404);
  });

  it('STEP 5 — rejects amount below plan minimum', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    let callCount = 0;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({ data: callCount === 1 ? mockPlan : mockUserProfile });
      }),
    });
    const res = await POST(makeRequest({ plan_id: 'plan-123', amount: 100 })); // below min 250
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Minimum investment');
  });

  it('STEP 6 — rejects amount above plan maximum', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    let callCount = 0;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({ data: callCount === 1 ? mockPlan : mockUserProfile });
      }),
    });
    const res = await POST(makeRequest({ plan_id: 'plan-123', amount: 5000 })); // above max 999
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Maximum investment');
  });

  it('STEP 7 — rejects unverified KYC', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    let callCount = 0;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          data: callCount === 1 ? mockPlan : { ...mockUserProfile, kyc_status: 'pending' },
        });
      }),
    });
    const res = await POST(makeRequest({ plan_id: 'plan-123', amount: 500 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('KYC');
  });

  it('STEP 8 — rejects insufficient balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    let callCount = 0;
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          data: callCount === 1 ? mockPlan : { ...mockUserProfile, balance: 10 },
        });
      }),
    });
    const res = await POST(makeRequest({ plan_id: 'plan-123', amount: 500 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Insufficient balance');
  });

  it('STEP 9 — successfully creates investment and deducts balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    const mockInvestment = { id: 'inv-123', amount: 500, status: 'pending' };
    let callCount = 0;

    mockFrom.mockImplementation((table: string) => {
      if (table === 'trading_plans') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockPlan }),
        };
      }
      if (table === 'users') {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockUserProfile }),
          };
        }
        return { update: vi.fn().mockReturnThis(), eq: vi.fn().mockResolvedValue({ error: null }) };
      }
      if (table === 'investments') {
        return {
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockInvestment, error: null }),
        };
      }
      if (table === 'transactions') {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
    });

    const res = await POST(makeRequest({ plan_id: 'plan-123', amount: 500 }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.investment.status).toBe('pending');
    expect(body.message).toContain('pending admin approval');
  });
});
