export async function setup() {
  console.log('Integration GlobalSetup: connecting test database...');
  // e.g. await mongoose.connect(process.env.TEST_DB_URL!);
}

export async function teardown() {
  console.log('Integration GlobalTeardown: disconnecting test database...');
  // e.g. await mongoose.disconnect();
}
