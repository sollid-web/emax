import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

const { POST } = await import('@/app/api/auth/login/route');

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

describe('POST /api/auth/login', () => {
  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ password: '123456' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Email and password are required');
  });
});
