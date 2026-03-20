import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/logout/route';

describe('POST /api/auth/logout', () => {
  it('returns 200 and success message', async () => {
    const req = new NextRequest('http://localhost/api/auth/logout', { method: 'POST' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Logged out successfully');
  });
});
