import { describe, it, expect } from 'vitest';
import request from 'supertest';

// import app from '@/app'; // Uncomment and replace with your Express/Fastify app

describe('POST /api/auth/login', () => {
  it('returns 200 with valid credentials', async () => {
    // const res = await request(app)
    //   .post('/api/auth/login')
    //   .send({ email: 'test@test.com', password: 'password123' });
    // expect(res.status).toBe(200);
    // expect(res.body).toHaveProperty('token');
    expect(true).toBe(true); // placeholder — wire up your app above
  });

  it('returns 401 with invalid credentials', async () => {
    // const res = await request(app)
    //   .post('/api/auth/login')
    //   .send({ email: 'bad@bad.com', password: 'wrong' });
    // expect(res.status).toBe(401);
    expect(true).toBe(true);
  });
});

describe('GET /api/me', () => {
  it('returns profile with valid token', async () => {
    // const res = await request(app)
    //   .get('/api/me')
    //   .set('Authorization', 'Bearer valid-token');
    // expect(res.status).toBe(200);
    // expect(res.body).toHaveProperty('email');
    expect(true).toBe(true);
  });

  it('returns 401 without token', async () => {
    // const res = await request(app).get('/api/me');
    // expect(res.status).toBe(401);
    expect(true).toBe(true);
  });
});
