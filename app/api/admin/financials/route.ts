import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function isAdmin(adminId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const period = new URL(request.url).searchParams.get('period') || 'month'
    const dateFilter = new Date()
    if (period === 'day') dateFilter.setDate(dateFilter.getDate() - 1)
    else if (period === 'week') dateFilter.setDate(dateFilter.getDate() - 7)
    else if (period === 'month') dateFilter.setMonth(dateFilter.getMonth() - 1)
    else if (period === 'year') dateFilter.setFullYear(dateFilter.getFullYear() - 1)

    const [depositsRes, withdrawalsRes, investmentsRes, usersRes, kycRes, pendingDepositsRes, pendingWithdrawalsRes] = await Promise.all([
      supabaseAdmin.from('deposits').select('amount').eq('status', 'completed').gte('created_at', dateFilter.toISOString()),
      supabaseAdmin.from('withdrawals').select('amount').eq('status', 'completed').gte('created_at', dateFilter.toISOString()),
      supabaseAdmin.from('investments').select('amount').eq('status', 'active'),
      supabaseAdmin.from('users').select('id', { count: 'exact' }).eq('account_status', 'active'),
      supabaseAdmin.from('kyc_submissions').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabaseAdmin.from('deposits').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabaseAdmin.from('withdrawals').select('id', { count: 'exact' }).eq('status', 'pending'),
    ])

    const totalDeposits = depositsRes.data?.reduce((s: number, d: any) => s + parseFloat(d.amount || 0), 0) || 0
    const totalWithdrawals = withdrawalsRes.data?.reduce((s: number, w: any) => s + parseFloat(w.amount || 0), 0) || 0
    const totalInvested = investmentsRes.data?.reduce((s: number, i: any) => s + parseFloat(i.amount || 0), 0) || 0
    const days = Math.max(1, Math.ceil((Date.now() - dateFilter.getTime()) / 86400000))

    return NextResponse.json({
      totalDeposits: +totalDeposits.toFixed(2),
      totalWithdrawals: +totalWithdrawals.toFixed(2),
      totalInvested: +totalInvested.toFixed(2),
      netFlow: +(totalDeposits - totalWithdrawals).toFixed(2),
      activeUsers: usersRes.count || 0,
      pendingKyc: kycRes.count || 0,
      pendingDeposits: pendingDepositsRes.count || 0,
      pendingWithdrawals: pendingWithdrawalsRes.count || 0,
      dailyAvgDeposit: +(totalDeposits / days).toFixed(2),
      period,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch financials' }, { status: 500 })
  }
}
