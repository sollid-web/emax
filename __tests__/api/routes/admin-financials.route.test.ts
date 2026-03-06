import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// ensure supabase-client will be created if a route imports it
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-key';

import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

let GET: typeof import('@/app/api/admin/financials/route').GET;

describe('GET /api/admin/financials', () => {
  beforeAll(async () => {
    const mod = await import('@/app/api/admin/financials/route');
    GET = mod.GET;
  });

  it('returns financial metrics with default period', async () => {
    const req = new NextRequest('http://localhost/api/admin/financials');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('totalRevenue');
    expect(typeof body.totalRevenue).toBe('number');
    expect(body).toHaveProperty('platformProfit');
    expect(typeof body.platformProfit).toBe('number');
  });

  it('supports period query parameter', async () => {
    const req = new NextRequest('http://localhost/api/admin/financials?period=day');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    // dailyRevenue should be present when period=day
    expect(body).toHaveProperty('dailyRevenue');
    expect(typeof body.dailyRevenue).toBe('number');
  });
});
