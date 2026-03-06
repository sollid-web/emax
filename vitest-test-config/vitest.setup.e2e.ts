import { beforeAll, afterAll } from 'vitest';

// Replace with your actual server helpers
// import { startServer, stopServer } from '@/server';

beforeAll(async () => {
  // (globalThis as any).server = await startServer(0);
  console.log('E2E setup: server started');
});

afterAll(async () => {
  // if ((globalThis as any).server) await stopServer((globalThis as any).server);
  console.log('E2E teardown: server stopped');
});
