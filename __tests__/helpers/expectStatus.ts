import { expect } from "chai";

// __tests__/helpers/expectStatus.ts
export async function expectStatus(res: any, expected: number) {
  if (res.status !== expected) {
    // print full response body for debugging
    // supertest responses use res.text (property), not a function
    // fallback to res.body if available
    const text = res.text || JSON.stringify(res.body);
    // eslint-disable-next-line no-console
    console.error('DEBUG unexpected response status', res.status, 'expected', expected);
    // eslint-disable-next-line no-console
    console.error('DEBUG response body:', text);
  }
  expect(res.status).toBe(expected);
}
