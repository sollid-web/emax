import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const { plan_id, amount } = await request.json()
    if (!plan_id || !amount || amount <= 0) return NextResponse.json({ error: 'Invalid plan or amount' }, { status: 400 })
    const { data: plan } = await supabaseAdmin.from('trading_plans').select('*').eq('id', plan_id).eq('is_active', true).single()
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    if (amount < plan.min_deposit) return NextResponse.json({ error: `Minimum investment is $${plan.min_deposit}` }, { status: 400 })
    if (plan.max_deposit && amount > plan.max_deposit) return NextResponse.json({ error: `Maximum investment is $${plan.max_deposit}` }, { status: 400 })
    const { data: userProfile } = await supabaseAdmin.from('users').select('*').eq('id', user.id).single()
    if (!userProfile) return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    if (userProfile.kyc_status !== 'approved') return NextResponse.json({ error: 'KYC verification required before investing' }, { status: 400 })
    if (userProfile.balance < amount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + plan.capital_withdrawal_days)
    const { data: investment, error: investError } = await supabaseAdmin.from('investments').insert({
      user_id: user.id, plan_id, amount, daily_roi: plan.daily_roi,
      status: 'pending', start_date: startDate.toISOString(), end_date: endDate.toISOString(),
    }).select().single()
    if (investError) return NextResponse.json({ error: 'Failed to create investment: ' + investError.message }, { status: 400 })
    await supabaseAdmin.from('users').update({ balance: userProfile.balance - amount, total_invested: (userProfile.total_invested || 0) + amount }).eq('id', user.id)
    await supabaseAdmin.from('transactions').insert({ user_id: user.id, transaction_type: 'investment', related_id: investment.id, amount, description: `Investment in ${plan.name} — pending approval`, status: 'pending' })
    return NextResponse.json({ success: true, investment, message: 'Investment submitted — pending admin approval' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Investment purchase failed' }, { status: 500 })
  }
}
