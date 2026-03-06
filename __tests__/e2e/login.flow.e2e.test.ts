import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/login/route';

const loginRequest = (body: object) =>
  new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('E2E: Login Flow', () => {
  it('fails with missing credentials', async () => {
    const res = await POST(loginRequest({}));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Email and password are required');
  });

  it('fails with only email', async () => {
    const res = await POST(loginRequest({ email: 'user@test.com' }));
    expect(res.status).toBe(400);
  });

  it('succeeds with valid credentials and returns user + profile', async () => {
    const res = await POST(loginRequest({ email: 'user@test.com', password: 'password123' }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.user).toHaveProperty('id');
    expect(body.user.email).toBe('user@test.com');
    expect(body.profile).toHaveProperty('balance');
    expect(body.profile).toHaveProperty('total_invested');
  });

  it('returns unique user id on each login', async () => {
    const res1 = await POST(loginRequest({ email: 'user@test.com', password: 'pass' }));
    const res2 = await POST(loginRequest({ email: 'user@test.com', password: 'pass' }));
    const body1 = await res1.json();
    const body2 = await res2.json();
    expect(body1.user.id).not.toBe(body2.user.id); // mock generates random id
  });
});
