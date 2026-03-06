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

const { GET } = await import('@/app/api/deposits/history/route');

const makeRequest = (token = 'valid-token') =>
  new NextRequest('http://localhost/api/deposits/history', {
    headers: { Authorization: `Bearer ${token}` },
  });

describe('GET /api/deposits/history', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 with no auth header', async () => {
    const res = await GET(new NextRequest('http://localhost/api/deposits/history'));
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const res = await GET(makeRequest('bad'));
    expect(res.status).toBe(401);
  });

  it('returns deposits for authenticated user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: 'dep-1', amount: 500, status: 'pending' }],
        error: null,
      }),
    });
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.deposits)).toBe(true);
  });
});
