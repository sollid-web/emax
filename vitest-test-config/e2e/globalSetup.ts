export async function setup() {
  console.log('E2E GlobalSetup: starting test server...');
  // const { startServer } = await import('../src/server');
  // (globalThis as any).server = await startServer(0);
}

export async function teardown() {
  console.log('E2E GlobalTeardown: stopping test server...');
  // if ((globalThis as any).server) {
  //   const { stopServer } = await import('../src/server');
  //   await stopServer((globalThis as any).server);
  // }
}
