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

const { GET, POST } = await import('@/app/api/admin/crypto-wallets/route');

describe('GET /api/admin/crypto-wallets', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns active wallets publicly', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: 'w-1', currency: 'BTC', wallet_address: 'addr123', is_active: true }],
        error: null,
      }),
    });
    const req = new NextRequest('http://localhost/api/admin/crypto-wallets');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.wallets)).toBe(true);
  });
});

describe('POST /api/admin/crypto-wallets', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const req = new NextRequest('http://localhost/api/admin/crypto-wallets', {
      method: 'POST',
      body: JSON.stringify({ currency: 'BTC', wallet_address: 'addr123' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer bad-token' },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 400 when currency or wallet_address missing', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'admin-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'admin-123', is_admin: true } }),
    });
    const req = new NextRequest('http://localhost/api/admin/crypto-wallets', {
      method: 'POST',
      body: JSON.stringify({ currency: 'BTC' }),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer valid-token' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Currency and wallet address are required');
  });
});
