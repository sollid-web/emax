import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/admin/kyc-list/route';

describe('GET /api/admin/kyc-list', () => {
  it('returns pending submissions by default', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-list');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('pending');
    expect(Array.isArray(body.submissions)).toBe(true);
    expect(body.submissions.length).toBeGreaterThan(0);
  });

  it('filters by status', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-list?status=approved');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('approved');
    expect(body.submissions.length).toBe(0); // mock has no approved ones
  });

  it('returns total count', async () => {
    const req = new NextRequest('http://localhost/api/admin/kyc-list');
    const res = await GET(req);
    const body = await res.json();
    expect(body).toHaveProperty('total');
  });
});
