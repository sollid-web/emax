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

const { POST } = await import('@/app/api/withdrawals/request/route');

const makeRequest = (body: object, token = 'valid-token') =>
  new NextRequest('http://localhost/api/withdrawals/request', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  });

const validBody = {
  amount: 100,
  currency: 'BTC',
  withdrawalType: 'profit',
  walletAddress: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
};

describe('E2E: Withdrawal Request Flow', () => {
  beforeEach(() => vi.clearAllMocks());

  it('STEP 1 — rejects unauthenticated request', async () => {
    const req = new NextRequest('http://localhost/api/withdrawals/request', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('STEP 2 — rejects missing fields', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({ amount: 100 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('STEP 3 — rejects negative amount', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({ ...validBody, amount: -100 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid withdrawal amount');
  });

  it('STEP 4 — rejects invalid wallet address', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({ ...validBody, walletAddress: 'short' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid wallet address');
  });

  it('STEP 5 — rejects insufficient balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { balance: 10 } }),
    });
    const res = await POST(makeRequest({ ...validBody, amount: 500 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Insufficient balance');
  });

  it('STEP 6 — successfully submits withdrawal and holds balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const mockWithdrawal = { id: 'wd-123', amount: 100, status: 'pending' };

    mockFrom.mockImplementation((table: string) => {
      if (table === 'users') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { balance: 1000 } }),
          update: vi.fn().mockReturnThis(),
        };
      }
      if (table === 'user_crypto_wallets') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'wallet-123' } }),
          update: vi.fn().mockReturnThis(),
        };
      }
      if (table === 'withdrawals') {
        return {
          insert: vi.fn().mockReturnThis(),
          select: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: mockWithdrawal, error: null }),
        };
      }
      if (table === 'transactions') {
        return { insert: vi.fn().mockResolvedValue({ error: null }) };
      }
    });

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.withdrawal.status).toBe('pending');
    expect(body.message).toContain('pending admin approval');
  });
});
