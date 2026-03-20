import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () =>
    HttpResponse.json({ id: 1, name: 'Test User', email: 'test@test.com' })
  ),
  http.post('/api/auth/login', () =>
    HttpResponse.json({ token: 'mock-jwt-token' })
  ),
  http.get('/api/me', () =>
    HttpResponse.json({ id: 1, email: 'test@test.com', name: 'Test User' })
  ),
];
