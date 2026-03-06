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
});
