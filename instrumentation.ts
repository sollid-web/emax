/**
 * Next.js Instrumentation Hook
 * Runs when the Next.js server starts
 * Used to initialize background jobs and cron tasks
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('[instrumentation] 🚀 Initializing server-side features...')

    // Import and initialize cron jobs
    const { initializeCronJobs } = await import('./lib/cron-scheduler')
    initializeCronJobs()

    console.log('[instrumentation] ✅ Server initialization complete')
  }
}
