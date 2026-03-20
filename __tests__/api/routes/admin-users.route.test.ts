// load our test environment before any imports that might bootstrap the
// shared Supabase client. Static imports are hoisted, so we must configure
// the environment first and only then dynamically load route handlers.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// ensure the supabase-client helper will actually create a client
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'service-role-key';

import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// we'll load these once the env is configured
let GET: typeof import('@/app/api/admin/users/route').GET;
let POST: typeof import('@/app/api/admin/users/route').POST;


// we will dynamically stub supabase.from inside individual tests
// no global mock, avoiding hoisting errors

// helper to insert a temporary test user which we can update via the POST handler
async function makeTestUser() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(supabaseUrl, serviceKey);
  const email = `temp+${Date.now()}@example.com`;
  const password = 'Test123456!';
  const { data: { user } } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  // add profile row if needed (should be created by trigger)
  return { id: user!.id, email };
}

describe('Admin users API', () => {
  beforeAll(async () => {
    const mod = await import('@/app/api/admin/users/route');
    GET = mod.GET;
    POST = mod.POST;
  });

  it('GET returns a list of users (possibly empty)', async () => {
    const req = new NextRequest('http://localhost/api/admin/users');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('users');
    expect(Array.isArray(body.users)).toBe(true);
    expect(body).toHaveProperty('total');
  });

  it('GET supports query and status filters', async () => {
    const req = new NextRequest('http://localhost/api/admin/users?q=test&status=active');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.users)).toBe(true);
  });

  it('POST returns 400 when id missing', async () => {
    // stub supabase to prevent 503
    const { supabase } = await import('@/lib/supabase-client');
    if (!supabase) {
      throw new Error('supabase client was not initialized');
    }
    supabase.from = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [] }),
    });
    const req = new NextRequest('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('User ID is required');
  });


  it('POST updates an existing user', async () => {
    const fakeId = 'user-abc';
    const { supabase } = await import('@/lib/supabase-client');
    if (!supabase) {
      throw new Error('supabase client was not initialized');
    }
    supabase.from = vi.fn().mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({ data: [{ id: fakeId, account_status: 'suspended' }], error: null }),
    });
    const req = new NextRequest('http://localhost/api/admin/users', {
      method: 'POST',
      body: JSON.stringify({ id: fakeId, account_status: 'suspended' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.user).toEqual({ id: fakeId, account_status: 'suspended' });
    expect(body.message).toBe('User updated successfully');
  });
});
