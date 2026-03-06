import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get user's investments with plan details
    const { data: investments, error: investmentsError } = await supabaseAdmin
      .from('investments')
      .select(`
        id,
        amount,
        daily_roi,
        status,
        start_date,
        end_date,
        total_profit,
        total_roi_earned,
        created_at,
        approved_at,
        activated_at,
        trading_plans (
          name,
          capital_withdrawal_days,
          profit_withdrawal_days
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (investmentsError) {
      console.error('Error fetching investments:', investmentsError)
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    }

    // Calculate available capital for withdrawal (from completed investments)
    const completedInvestments = investments?.filter(inv => inv.status === 'completed') || []
    const availableCapitalForWithdrawal = completedInvestments.reduce((sum, inv) => sum + inv.amount, 0)

    // Get daily earnings for active investments
    const activeInvestments = investments?.filter(inv => inv.status === 'active') || []
    let todaysEarnings = 0

    if (activeInvestments.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const investmentIds = activeInvestments.map(inv => inv.id)

      const { data: todaysEarningsData } = await supabaseAdmin
        .from('daily_earnings')
        .select('amount')
        .in('investment_id', investmentIds)
        .eq('earned_date', today)
        .eq('status', 'credited')

      todaysEarnings = todaysEarningsData?.reduce((sum, earning) => sum + earning.amount, 0) || 0
    }

    return NextResponse.json({
      success: true,
      investments: investments || [],
      summary: {
        totalInvested: investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
        totalEarnings: investments?.reduce((sum, inv) => (inv.total_roi_earned || 0), 0) || 0,
        activeInvestments: activeInvestments.length,
        completedInvestments: completedInvestments.length,
        availableCapitalForWithdrawal,
        todaysEarnings
      }
    })

  } catch (error: any) {
    console.error('[investments] history error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch investment history' },
      { status: 500 }
    )
  }
}