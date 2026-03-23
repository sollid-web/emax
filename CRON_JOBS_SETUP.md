# Daily Earnings Cron Jobs Setup ✅

Your Emax Protocol application now has **automated daily earnings distribution** built-in! 🎉

## What's New

### Files Created:
1. **`lib/cron-jobs.ts`** — Core logic for earnings and investment completion
2. **`lib/cron-scheduler.ts`** — Cron job scheduler using `node-cron`
3. **`instrumentation.ts`** — Next.js hook to initialize cron jobs on server start
4. **Updated `next.config.mjs`** — Enabled instrumentation hook
5. **Updated `package.json`** — Added `node-cron` dependency

---

## Installation

### Step 1: Install Dependencies
```bash
npm install
```

This installs the new `node-cron` package automatically.

### Step 2: Restart Your Server
```bash
npm run dev
```

When the server starts, you'll see:
```
[instrumentation] 🚀 Initializing server-side features...
[cron-scheduler] ✅ Cron jobs initialized successfully
[cron-scheduler] 📅 Schedule:
[cron-scheduler]   - Daily earnings: 2:00 AM UTC
[cron-scheduler]   - Investment completion: 2:30 AM UTC
```

---

## How It Works

### Automated Schedule
- **Daily Earnings Distribution** → **2:00 AM UTC** every day
  - Calculates `(investment_amount × daily_roi) / 100` for each active investment
  - Credits earnings to user balance
  - Records transaction logs

- **Investment Completion** → **2:30 AM UTC** every day
  - Completes investments that reached their end_date
  - Returns capital to user balance
  - Records capital return transactions

### Error Handling
- All jobs log detailed information to console
- Failed operations continue to next investment (no blocking)
- Duplicate daily earnings checks prevent double-crediting
- Comprehensive error reporting

---

## Testing the Cron Jobs

### Option 1: Manual Trigger (Development)
If you want to test without waiting 24 hours:

```typescript
// Add this to app/api/test/trigger-earnings/route.ts
import { processDailyEarnings } from '@/lib/cron-jobs'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await processDailyEarnings()
  return NextResponse.json(result)
}
```

Then visit: `http://localhost:3000/api/test/trigger-earnings`

### Option 2: Change Cron Schedule (Development)
Edit `lib/cron-scheduler.ts` to run more frequently:

```typescript
// Run every minute for testing
cron.schedule('* * * * *', async () => {
  // ...
})

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  // ...
})
```

**Standard cron format:** `minute hour day month day-of-week`
- `0 2 * * *` = 2:00 AM every day
- `*/5 * * * *` = Every 5 minutes
- `0 12 * * *` = 12:00 PM every day

---

## Production Deployment

### Vercel
The cron jobs will work automatically when deployed to Vercel:

1. Push your code to GitHub
2. Deploy to Vercel (automatic)
3. Jobs run on your Vercel deployment's schedule

**Note:** If your app uses Vercel's serverless functions, cron jobs work best on Vercel's Node.js runtime.

### Self-Hosted / VPS
The cron jobs run automatically when your Next.js server starts:

```bash
# Start your server
npm run start

# Or with PM2 for process management
pm2 start "npm run start" --name "emax-protocol"
```

Jobs will run according to UTC time (2:00 AM, 2:30 AM UTC).

### AWS / Google Cloud / Azure
Deploy your Next.js app normally. Cron jobs initialize when the server starts.

---

## Customizing the Schedule

**Edit `lib/cron-scheduler.ts`:**

```typescript
// Example: Run at 3:00 AM and 3:30 AM UTC instead
cron.schedule('0 3 * * *', async () => {
  // Daily earnings at 3:00 AM
})

cron.schedule('30 3 * * *', async () => {
  // Investment completion at 3:30 AM
})
```

**Cron Format Reference:**
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

Common schedules:
- `0 2 * * *` — 2:00 AM every day
- `0 0 * * *` — 12:00 AM (midnight) every day
- `30 1 * * *` — 1:30 AM every day
- `0 */6 * * *` — Every 6 hours
- `*/30 * * * *` — Every 30 minutes

---

## Monitoring & Logs

### Console Logs
The cron jobs log everything to console:

```
[cron-scheduler] 📅 Running daily earnings distribution...
[daily-earnings-cron] ✅ Processed investment abc123: $12.50
[cron-scheduler] ✅ Daily earnings processed: 45 investments, $562.50
```

### Database Logs
All operations are recorded:
- `daily_earnings` table — tracks daily profit credits
- `transactions` table — financial audit trail
- `investments` table — updated totals (total_profit, total_roi_earned)
- `users` table — updated balances

### To View Logs in Production:

**Vercel:** 
- Dashboard → Project → Deployments → Logs

**VPS/Self-hosted:**
```bash
# If using PM2
pm2 logs emax-protocol
```

---

## Disabling Cron Jobs

If you need to temporarily disable the jobs:

**Option 1:** Comment out in `lib/cron-scheduler.ts`
```typescript
// cron.schedule('0 2 * * *', async () => {
//   console.log('[cron-scheduler] 📅 Running daily earnings distribution...')
//   // ...
// })
```

**Option 2:** Use environment variable:
```typescript
if (process.env.ENABLE_CRON_JOBS === 'true') {
  cron.schedule('0 2 * * *', async () => {
    // ...
  })
}
```

Then set `ENABLE_CRON_JOBS=false` in your `.env.local`

---

## Troubleshooting

### Cron jobs not running?

1. **Check server logs** — Look for `[cron-scheduler]` messages
2. **Verify instrumentation is enabled** — Check `next.config.mjs` has `experimental.instrumentationHook: true`
3. **Ensure dependencies installed** — Run `npm install`
4. **Check environment variables** — Make sure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
5. **Verify server is running** — Jobs only run when the Next.js server is active

### Earnings not being credited?

1. Check investment `status` is `active`
2. Verify `start_date ≤ today ≤ end_date`
3. Review console logs for errors
4. Check Supabase database permissions
5. Ensure admin user exists with proper role

### Jobs running multiple times?

If using load balancing / multiple server instances, each will run cron jobs. To prevent duplication:

**Option 1:** Run cron on one dedicated machine
**Option 2:** Use managed cron service (Vercel edge functions, AWS Lambda, etc.)
**Option 3:** Implement database locking in `cron-jobs.ts`

---

## API Endpoints (Still Available)

Legacy endpoints still work if you want to trigger manually:
- `POST /api/admin/daily-earnings` — Requires admin auth
- `POST /api/admin/complete-investments` — Requires admin auth

But with automatic cron jobs, you typically won't need these!

---

## Summary

✅ **Daily earnings distribution is now automated**  
✅ **Runs at 2:00 AM UTC every day by default**  
✅ **Investment completion at 2:30 AM UTC every day**  
✅ **No external service needed** — runs on your server  
✅ **Fully logged and monitored**  
✅ **Easy to customize schedule**

**Your platform is now generating passive income 24/7!** 🚀
