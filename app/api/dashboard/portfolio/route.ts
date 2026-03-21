import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const [userRes, investmentsRes, depositsRes, withdrawalsRes, earningsRes] = await Promise.all([
      supabaseAdmin.from('users').select('balance, total_invested, total_earnings').eq('id', user.id).single(),
      supabaseAdmin.from('investments').select('id, amount, daily_roi, status, total_roi_earned, created_at, trading_plans(name)').eq('user_id', user.id),
      supabaseAdmin.from('deposits').select('amount, status, created_at').eq('user_id', user.id).eq('status', 'completed'),
      supabaseAdmin.from('withdrawals').select('amount, status, created_at').eq('user_id', user.id).eq('status', 'completed'),
      supabaseAdmin.from('daily_earnings').select('amount, earned_date').eq('user_id', user.id).eq('status', 'paid').order('earned_date', { ascending: false }).limit(30),
    ])

    const userData = userRes.data
    const investments = investmentsRes.data || []
    const deposits = depositsRes.data || []
    const withdrawals = withdrawalsRes.data || []
    const earnings = earningsRes.data || []

    const activeInvestments = investments.filter(i => i.status === 'active')
    const totalDeposited = deposits.reduce((s, d) => s + parseFloat(d.amount), 0)
    const totalWithdrawn = withdrawals.reduce((s, w) => s + parseFloat(w.amount), 0)

    return NextResponse.json({
      success: true,
      portfolio: {
        balance: userData?.balance || 0,
        total_invested: userData?.total_invested || 0,
        total_earnings: userData?.total_earnings || 0,
        total_deposited: totalDeposited,
        total_withdrawn: totalWithdrawn,
        active_investments: activeInvestments.length,
        investments,
        recent_earnings: earnings,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to load portfolio' }, { status: 500 })
  }
}
