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

describe('POST /api/withdrawals/request', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when no auth header', async () => {
    const req = new NextRequest('http://localhost/api/withdrawals/request', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(401);
  });

  it('returns 400 when required fields are missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({ amount: 100 }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('returns 400 when amount is zero or negative', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({
      amount: -50,
      currency: 'BTC',
      withdrawalType: 'profit',
      walletAddress: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid withdrawal amount');
  });

  it('returns 400 when wallet address is too short', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    const res = await POST(makeRequest({
      amount: 100,
      currency: 'BTC',
      withdrawalType: 'profit',
      walletAddress: 'short',
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Invalid wallet address');
  });

  it('returns 400 when insufficient balance', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { balance: 50 } }),
    });
    const res = await POST(makeRequest({
      amount: 500,
      currency: 'BTC',
      withdrawalType: 'profit',
      walletAddress: '1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P',
    }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Insufficient balance');
  });
});
