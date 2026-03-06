# Full Stack Vitest Configuration

## Project Structure
```
vitest-test-config/
├── vitest.config.ts               # Root config (all suites via workspace)
├── vitest.unit.config.ts          # Unit test config  (jsdom)
├── vitest.integration.config.ts   # Integration config (node + DB)
├── vitest.e2e.config.ts           # E2E config (node + server)
├── vitest.setup.unit.ts           # Unit setup (MSW + jest-dom)
├── vitest.setup.integration.ts    # Integration setup (DB connect)
├── vitest.setup.e2e.ts            # E2E setup (server start)
├── tsconfig.json
├── .env.test
├── __mocks__/
│   ├── server.ts                  # MSW node server
│   └── handlers.ts                # MSW route handlers
├── src/
│   └── __tests__/
│       ├── unit/
│       │   └── Button.unit.test.tsx
│       └── integration/
│           ├── auth.integration.test.ts
│           └── globalSetup.ts     # DB connect/disconnect
└── e2e/
    ├── auth.e2e.test.ts
    └── globalSetup.ts             # Server start/stop
```

## Installation
```bash
npm install
```

## Commands
| Command                  | Description                        |
|--------------------------|------------------------------------|
| `npm run test`           | Watch mode (all suites)            |
| `npm run test:unit`      | Unit tests only — fast, isolated   |
| `npm run test:integration` | Integration tests — API + DB     |
| `npm run test:e2e`       | E2E tests — full request flows     |
| `npm run test:all`       | All suites sequentially            |
| `npm run test:coverage`  | All tests + V8 coverage report     |
| `npm run test:ui`        | Interactive Vitest UI in browser   |

## Key Differences from Jest
| Feature        | Jest              | Vitest              |
|----------------|-------------------|---------------------|
| Config         | `jest.config.js`  | `vitest.config.ts`  |
| Mocking        | `jest.fn()`       | `vi.fn()`           |
| Timers         | `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| Spying         | `jest.spyOn()`    | `vi.spyOn()`        |
| Module mocks   | `jest.mock()`     | `vi.mock()`         |
| Environment    | jsdom (default)   | node (default)      |
| Speed          | Slower            | ~2–5x faster (Vite HMR) |

## Environment Variables
Copy `.env.test` and update with your values:
```
TEST_DB_URL=mongodb://localhost:27017/myapp_test
JWT_SECRET=your-test-secret
```

## Vitest UI
Run `npm run test:ui` to open the interactive browser dashboard
for test results, coverage, and re-running individual tests.
