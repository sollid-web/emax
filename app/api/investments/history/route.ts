import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const { data: investments, error: investmentsError } = await supabaseAdmin.from('investments')
      .select('id,amount,daily_roi,status,start_date,end_date,total_profit,total_roi_earned,created_at,approved_at,trading_plans(name,capital_withdrawal_days,profit_withdrawal_days)')
      .eq('user_id', user.id).order('created_at', { ascending: false })
    if (investmentsError) return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    const activeInvestments = investments?.filter(inv => inv.status === 'active') || []
    const completedInvestments = investments?.filter(inv => inv.status === 'completed') || []
    let todaysEarnings = 0
    if (activeInvestments.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const { data: earningsData } = await supabaseAdmin.from('daily_earnings').select('amount').in('investment_id', activeInvestments.map(i => i.id)).eq('earned_date', today).eq('status', 'paid')
      todaysEarnings = earningsData?.reduce((sum, e) => sum + e.amount, 0) || 0
    }
    return NextResponse.json({
      success: true, investments: investments || [],
      summary: {
        totalInvested: investments?.reduce((s, i) => s + (i.amount || 0), 0) || 0,
        totalEarnings: investments?.reduce((s, i) => s + (i.total_roi_earned || 0), 0) || 0,
        activeInvestments: activeInvestments.length, completedInvestments: completedInvestments.length,
        availableCapitalForWithdrawal: completedInvestments.reduce((s, i) => s + (i.amount || 0), 0), todaysEarnings,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch investment history' }, { status: 500 })
  }
}
