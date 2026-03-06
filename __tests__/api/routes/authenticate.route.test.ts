import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

const mockSignIn = vi.fn();
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: { signInWithPassword: mockSignIn, getUser: mockGetUser },
    from: mockFrom,
  })),
}));

const { POST } = await import('@/app/api/auth/authenticate/route');

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/auth/authenticate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/auth/authenticate', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: '123456' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Email and password required');
  });

  it('returns 400 when password is missing', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com' }));
    expect(res.status).toBe(400);
  });

  it('returns 401 with invalid credentials', async () => {
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid credentials' } });
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'wrong' }));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Invalid credentials');
  });

  it('returns 404 when user profile not found', async () => {
    mockSignIn.mockResolvedValue({
      data: {
        session: { access_token: 'token', refresh_token: 'refresh', expires_in: 3600 },
        user: { id: 'user-123' },
      },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
    });
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'pass' }));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe('User profile not found');
  });

  it('returns 200 with valid credentials and sets cookies', async () => {
    mockSignIn.mockResolvedValue({
      data: {
        session: { access_token: 'access-token', refresh_token: 'refresh-token', expires_in: 3600 },
        user: { id: 'user-123' },
      },
      error: null,
    });
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'user-123', email: 'test@test.com' }, error: null }),
    });
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'pass123' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.session.access_token).toBe('access-token');
    expect(body.user.email).toBe('test@test.com');
  });
});
