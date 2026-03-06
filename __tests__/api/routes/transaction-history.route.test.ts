import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/admin/transaction-history/route';

describe('GET /api/admin/transaction-history', () => {
  it('returns 400 when userId is missing', async () => {
    const req = new NextRequest('http://localhost/api/admin/transaction-history');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('userId is required');
  });

  it('returns transactions for a user', async () => {
    const req = new NextRequest('http://localhost/api/admin/transaction-history?userId=user-123');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.transactions)).toBe(true);
    expect(body.transactions.length).toBeGreaterThan(0);
  });

  it('filters by type', async () => {
    const req = new NextRequest('http://localhost/api/admin/transaction-history?userId=user-123&type=credit');
    const res = await GET(req);
    const body = await res.json();
    expect(body.transactions.every((t: any) => t.type === 'credit')).toBe(true);
  });

  it('respects limit param', async () => {
    const req = new NextRequest('http://localhost/api/admin/transaction-history?userId=user-123&limit=1');
    const res = await GET(req);
    const body = await res.json();
    expect(body.transactions.length).toBeLessThanOrEqual(1);
  });
});
