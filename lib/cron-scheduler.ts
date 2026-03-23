import cron from 'node-cron'
import { processDailyEarnings, completeExpiredInvestments } from './cron-jobs'

let cronJobsInitialized = false

/**
 * Initialize daily cron jobs
 * Call this once when the server starts
 */
export function initializeCronJobs() {
  if (cronJobsInitialized) {
    console.log('[cron-init] Cron jobs already initialized')
    return
  }

  try {
    // Daily Earnings Distribution
    // Runs at 2 AM UTC every day
    // Cron format: minute hour day month day-of-week
    cron.schedule('0 2 * * *', async () => {
      console.log('[cron-scheduler] 📅 Running daily earnings distribution...')
      try {
        const result = await processDailyEarnings()
        if (result.success) {
          console.log(
            `[cron-scheduler] ✅ Daily earnings processed: ${result.processed} investments, $${result.totalEarnings.toFixed(
              2
            )}`
          )
        } else {
          console.error(`[cron-scheduler] ❌ Daily earnings failed: ${result.error}`)
        }
      } catch (error) {
        console.error('[cron-scheduler] ❌ Error in daily earnings job:', error)
      }
    })

    // Investment Completion
    // Runs at 2:30 AM UTC every day (30 minutes after earnings processing)
    cron.schedule('30 2 * * *', async () => {
      console.log('[cron-scheduler] ✅ Running investment completion...')
      try {
        const result = await completeExpiredInvestments()
        if (result.success) {
          console.log(
            `[cron-scheduler] ✅ Investments completed: ${result.completed} investments, $${result.totalCapitalReturned.toFixed(
              2
            )} returned`
          )
        } else {
          console.error(`[cron-scheduler] ❌ Investment completion failed: ${result.error}`)
        }
      } catch (error) {
        console.error('[cron-scheduler] ❌ Error in completion job:', error)
      }
    })

    cronJobsInitialized = true
    console.log('[cron-scheduler] ✅ Cron jobs initialized successfully')
    console.log('[cron-scheduler] 📅 Schedule:')
    console.log('[cron-scheduler]   - Daily earnings: 2:00 AM UTC')
    console.log('[cron-scheduler]   - Investment completion: 2:30 AM UTC')
  } catch (error) {
    console.error('[cron-scheduler] ❌ Failed to initialize cron jobs:', error)
  }
}

/**
 * Stop all cron jobs (useful for graceful shutdown)
 */
export function stopCronJobs() {
  cron.getTasks().forEach((task) => {
    task.stop()
  })
  cronJobsInitialized = false
  console.log('[cron-scheduler] Cron jobs stopped')
}
