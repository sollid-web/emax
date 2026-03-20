import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/signup/route';

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/auth/signup', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('returns 400 when password is too short', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com', password: '123', fullname: 'Test', username: 'test' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Password must be at least 6 characters');
  });

  it('returns 200 with valid data', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'pass123', fullname: 'Test User', username: 'testuser' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user.email).toBe('test@test.com');
  });

  it('returns message to verify email', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'pass123', fullname: 'Test', username: 'test' }));
    const body = await res.json();
    expect(body.message).toContain('email');
  });
});
