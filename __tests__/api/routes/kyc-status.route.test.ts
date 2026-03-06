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

const { GET } = await import('@/app/api/kyc/status/route');

const makeRequest = (token = 'valid-token') =>
  new NextRequest('http://localhost/api/kyc/status', {
    headers: { Authorization: `Bearer ${token}` },
  });

describe('GET /api/kyc/status', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 with no auth header', async () => {
    const res = await GET(new NextRequest('http://localhost/api/kyc/status'));
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid' } });
    const res = await GET(makeRequest('bad-token'));
    expect(res.status).toBe(401);
  });

  it('returns not_started when no KYC submission found', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    });
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status.status).toBe('not_started');
  });

  it('returns KYC status when submission exists', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { status: 'pending', rejection_reason: null, created_at: new Date().toISOString(), verified_at: null },
      }),
    });
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status.status).toBe('pending');
  });
});
