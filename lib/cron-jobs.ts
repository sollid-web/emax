import { createClient } from '@supabase/supabase-js'

/**
 * Daily Earnings Distribution Cron Job
 * Runs automatically at 2 AM UTC daily
 * Calculates and credits daily ROI for all active investments
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', adminId)
    .single()

  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function processDailyEarnings(): Promise<{
  success: boolean
  processed: number
  totalEarnings: number
  error?: string
}> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        success: false,
        processed: 0,
        totalEarnings: 0,
        error: 'Server configuration error',
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin user (finance_admin or super_admin)
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id')
      .in('role', ['super_admin', 'finance_admin'])
      .limit(1)
      .single()

    if (adminError || !adminUser) {
      console.error('[daily-earnings-cron] No admin user found:', adminError)
      return {
        success: false,
        processed: 0,
        totalEarnings: 0,
        error: 'No admin user found',
      }
    }

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD format

    // Get all active investments that haven't ended yet
    const { data: activeInvestments, error: fetchError } = await supabase
      .from('investments')
      .select(`
        id,
        user_id,
        amount,
        daily_roi,
        start_date,
        end_date,
        total_profit,
        total_roi_earned,
        status
      `)
      .eq('status', 'active')
      .lte('start_date', todayStr)
      .gte('end_date', todayStr)

    if (fetchError) {
      console.error('[daily-earnings-cron] Error fetching investments:', fetchError)
      return {
        success: false,
        processed: 0,
        totalEarnings: 0,
        error: `Failed to fetch investments: ${fetchError.message}`,
      }
    }

    if (!activeInvestments || activeInvestments.length === 0) {
      console.log('[daily-earnings-cron] No active investments to process')
      return {
        success: true,
        processed: 0,
        totalEarnings: 0,
      }
    }

    let processedCount = 0
    let totalEarnings = 0

    // Process each investment
    for (const investment of activeInvestments) {
      try {
        // Calculate daily earnings
        const dailyEarnings = (investment.amount * investment.daily_roi) / 100

        // Check if earnings already recorded for today
        const { data: existingEarning } = await supabase
          .from('daily_earnings')
          .select('id')
          .eq('investment_id', investment.id)
          .eq('earned_date', todayStr)
          .single()

        if (existingEarning) {
          console.log(
            `[daily-earnings-cron] Earnings already recorded for investment ${investment.id} on ${todayStr}`
          )
          continue
        }

        // Record daily earnings
        const { error: earningError } = await supabase
          .from('daily_earnings')
          .insert({
            investment_id: investment.id,
            user_id: investment.user_id,
            amount: dailyEarnings,
            earned_date: todayStr,
            status: 'credited',
          })

        if (earningError) {
          console.error(
            `[daily-earnings-cron] Error recording earnings for investment ${investment.id}:`,
            earningError
          )
          continue
        }

        // Update investment totals
        const newTotalProfit = (investment.total_profit || 0) + dailyEarnings
        const newTotalRoiEarned = (investment.total_roi_earned || 0) + dailyEarnings

        const { error: updateError } = await supabase
          .from('investments')
          .update({
            total_profit: newTotalProfit,
            total_roi_earned: newTotalRoiEarned,
            updated_at: new Date().toISOString(),
          })
          .eq('id', investment.id)

        if (updateError) {
          console.error(
            `[daily-earnings-cron] Error updating investment totals for ${investment.id}:`,
            updateError
          )
          continue
        }

        // Credit earnings to user balance
        const { data: user } = await supabase
          .from('users')
          .select('balance, total_earnings')
          .eq('id', investment.user_id)
          .single()

        if (user) {
          const { error: balanceError } = await supabase
            .from('users')
            .update({
              balance: (user.balance || 0) + dailyEarnings,
              total_earnings: (user.total_earnings || 0) + dailyEarnings,
            })
            .eq('id', investment.user_id)

          if (balanceError) {
            console.error(
              `[daily-earnings-cron] Error updating user balance for ${investment.user_id}:`,
              balanceError
            )
            continue
          }
        }

        // Log transaction
        await supabase.from('transactions').insert({
          user_id: investment.user_id,
          transaction_type: 'earnings',
          related_id: investment.id,
          amount: dailyEarnings,
          description: `Daily ROI earnings from investment`,
          status: 'completed',
        })

        processedCount++
        totalEarnings += dailyEarnings

        console.log(
          `[daily-earnings-cron] ✅ Processed investment ${investment.id}: $${dailyEarnings.toFixed(
            2
          )}`
        )
      } catch (error) {
        console.error(
          `[daily-earnings-cron] Error processing investment ${investment.id}:`,
          error
        )
      }
    }

    console.log(
      `[daily-earnings-cron] ✅ Complete: Processed ${processedCount} investments, total earnings: $${totalEarnings.toFixed(
        2
      )}`
    )

    return {
      success: true,
      processed: processedCount,
      totalEarnings,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[daily-earnings-cron] Fatal error:', error)
    return {
      success: false,
      processed: 0,
      totalEarnings: 0,
      error: errorMessage,
    }
  }
}

export async function completeExpiredInvestments(): Promise<{
  success: boolean
  completed: number
  totalCapitalReturned: number
  error?: string
}> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        success: false,
        completed: 0,
        totalCapitalReturned: 0,
        error: 'Server configuration error',
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const today = new Date().toISOString().split('T')[0]

    // Get all active investments that have reached their end date
    const { data: expiredInvestments, error: fetchError } = await supabase
      .from('investments')
      .select('id, user_id, amount, status')
      .eq('status', 'active')
      .lt('end_date', today)

    if (fetchError) {
      console.error('[investment-completion-cron] Error fetching investments:', fetchError)
      return {
        success: false,
        completed: 0,
        totalCapitalReturned: 0,
        error: `Failed to fetch investments: ${fetchError.message}`,
      }
    }

    if (!expiredInvestments || expiredInvestments.length === 0) {
      console.log('[investment-completion-cron] No expired investments to complete')
      return {
        success: true,
        completed: 0,
        totalCapitalReturned: 0,
      }
    }

    let completedCount = 0
    let totalCapitalReturned = 0

    for (const investment of expiredInvestments) {
      try {
        // Mark investment as completed
        const { error: updateError } = await supabase
          .from('investments')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', investment.id)

        if (updateError) {
          console.error(
            `[investment-completion-cron] Error completing investment ${investment.id}:`,
            updateError
          )
          continue
        }

        // Return capital to user balance
        const { data: user } = await supabase
          .from('users')
          .select('balance')
          .eq('id', investment.user_id)
          .single()

        if (user) {
          const { error: balanceError } = await supabase
            .from('users')
            .update({
              balance: (user.balance || 0) + investment.amount,
            })
            .eq('id', investment.user_id)

          if (balanceError) {
            console.error(
              `[investment-completion-cron] Error returning capital for ${investment.user_id}:`,
              balanceError
            )
            continue
          }
        }

        // Log transaction
        await supabase.from('transactions').insert({
          user_id: investment.user_id,
          transaction_type: 'capital_return',
          related_id: investment.id,
          amount: investment.amount,
          description: `Capital returned from completed investment`,
          status: 'completed',
        })

        completedCount++
        totalCapitalReturned += investment.amount

        console.log(
          `[investment-completion-cron] ✅ Completed investment ${investment.id}: returned $${investment.amount.toFixed(
            2
          )}`
        )
      } catch (error) {
        console.error(
          `[investment-completion-cron] Error completing investment ${investment.id}:`,
          error
        )
      }
    }

    console.log(
      `[investment-completion-cron] ✅ Complete: Completed ${completedCount} investments, total capital returned: $${totalCapitalReturned.toFixed(
        2
      )}`
    )

    return {
      success: true,
      completed: completedCount,
      totalCapitalReturned,
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('[investment-completion-cron] Fatal error:', error)
    return {
      success: false,
      completed: 0,
      totalCapitalReturned: 0,
      error: errorMessage,
    }
  }
}
