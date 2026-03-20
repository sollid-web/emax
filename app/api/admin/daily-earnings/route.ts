import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', adminId)
    .single()

  return ['super_admin','finance_admin','support'].includes(data?.role) || false
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin auth token from cookies
    const cookieStore = await cookies()
    const authHeader = request.headers.get('authorization');
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('sb-access-token')?.value || null;
    }
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !adminUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const isAdminUser = await isAdmin(supabase, adminUser.id)
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
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
      console.error('Error fetching active investments:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    }

    if (!activeInvestments || activeInvestments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active investments to process',
        processed: 0
      })
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
          console.log(`Earnings already recorded for investment ${investment.id} on ${todayStr}`)
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
            status: 'credited'
          })

        if (earningError) {
          console.error(`Error recording earnings for investment ${investment.id}:`, earningError)
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
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id)

        if (updateError) {
          console.error(`Error updating investment totals for ${investment.id}:`, updateError)
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
              total_earnings: (user.total_earnings || 0) + dailyEarnings
            })
            .eq('id', investment.user_id)

          if (balanceError) {
            console.error(`Error updating user balance for ${investment.user_id}:`, balanceError)
            continue
          }
        }

        // Log transaction
        await supabase
          .from('transactions')
          .insert({
            user_id: investment.user_id,
            transaction_type: 'earnings',
            related_id: investment.id,
            amount: dailyEarnings,
            description: `Daily ROI earnings from investment`,
            status: 'completed'
          })

        processedCount++
        totalEarnings += dailyEarnings

      } catch (error) {
        console.error(`Error processing investment ${investment.id}:`, error)
        continue
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} investments`,
      processed: processedCount,
      totalEarnings: totalEarnings.toFixed(8)
    })

  } catch (error: any) {
    console.error('[daily-earnings] calculation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to calculate daily earnings' },
      { status: 500 }
    )
  }
}