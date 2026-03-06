import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as depositRequest } from '@/app/api/deposits/request/route';
import { GET as depositHistory } from '@/app/api/deposits/history/route';
import { createClient } from '@supabase/supabase-js';

async function makeTestUser() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(supabaseUrl, serviceKey);
  const email = `user+${Date.now()}@example.com`;
  const password = 'Test123456!';

  // create auth user
  await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  // log in to obtain access token
  const { data: { session } } = await admin.auth.signInWithPassword({ email, password });
  return { email, password, token: session?.access_token!, userId: session?.user?.id! };
}

describe('deposits API', () => {
  it('rejects unauthorized history request', async () => {
    const req = new NextRequest('http://localhost/api/deposits/history', {
      method: 'GET',
      headers: { },
    });
    const res = await depositHistory(req);
    expect(res.status).toBe(401);
  });

  it('creates a deposit and then returns it in history', { timeout: 15000 }, async () => { // eslint-disable-line vitest/expect-expect
    // longer timeout due to network calls
    const { token } = await makeTestUser();

    // first attempt missing body
    let req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    let res = await depositRequest(req);
    expect(res.status).toBe(400);

    // proper deposit
    const depositData = { amount: '100', currency: 'usd', wallet_address_used: '0xabc' };
    req = new NextRequest('http://localhost/api/deposits/request', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(depositData),
    });
    res = await depositRequest(req);
    expect(res.status).toBe(201);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.deposit).toHaveProperty('id');

    // now fetch history
    const historyReq = new NextRequest('http://localhost/api/deposits/history', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const histRes = await depositHistory(historyReq);
    expect(histRes.status).toBe(200);
    const histBody = await histRes.json();
    expect(histBody.success).toBe(true);
    expect(Array.isArray(histBody.deposits)).toBe(true);
    expect(histBody.deposits.length).toBeGreaterThanOrEqual(1);
  }, { timeout: 15000 });
});
