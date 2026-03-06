import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/signup/route';

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('E2E: Registration Flow', () => {
  it('STEP 1 — rejects empty submission', async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Missing required fields');
  });

  it('STEP 2 — rejects weak password', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com', password: '123', fullname: 'Test', username: 'test' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Password must be at least 6 characters');
  });

  it('STEP 3 — rejects missing username', async () => {
    const res = await POST(makeRequest({ email: 'test@test.com', password: 'pass123', fullname: 'Test' }));
    expect(res.status).toBe(400);
  });

  it('STEP 4 — successfully registers with valid data', async () => {
    const res = await POST(makeRequest({ email: 'new@test.com', password: 'pass123', fullname: 'New User', username: 'newuser' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user).toHaveProperty('id');
    expect(body.user.email).toBe('new@test.com');
  });

  it('STEP 5 — returns email verification message', async () => {
    const res = await POST(makeRequest({ email: 'new@test.com', password: 'pass123', fullname: 'New User', username: 'newuser' }));
    const body = await res.json();
    expect(body.message).toContain('email');
  });
});
