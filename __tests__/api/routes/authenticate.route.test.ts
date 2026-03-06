/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { expectStatus } from '../../helpers/expectStatus';
// require-style imports to satisfy @types definitions
const supertest = require('supertest');
const express = require('express');
import { createClient } from '@supabase/supabase-js';
import authenticateHandler from '../../../api/auth/authenticate';

const app = express();
app.use(express.json());
app.post('/api/auth/authenticate', authenticateHandler);

describe('authenticateHandler', () => {
  it('returns 200 with valid credentials and sets cookies', { timeout: 15000 }, async () => {
    // ensure a fresh test user
    const email = `test+${Date.now()}@example.com`;
    const password = 'Test123456!';

    const adminClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const creation = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    // debug creation result
    // eslint-disable-next-line no-console
    console.log('createUser result', creation);

    // verify we can sign in using admin client directly
    const check = await adminClient.auth.signInWithPassword({ email, password });
    // eslint-disable-next-line no-console
    console.log('admin signIn result', check);

    const res = await supertest(app)
      .post('/api/auth/authenticate')
      .send({ email, password });
    await expectStatus(res, 200);
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.body.success).toBe(true);
    expect(res.body.profile).toBeDefined();
  });
});
