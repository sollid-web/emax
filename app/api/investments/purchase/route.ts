import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ service role not anon
)

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { plan_id, amount } = await request.json()

    if (!plan_id || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid plan or amount' }, { status: 400 })
    }

    // Get trading plan
    const { data: plan } = await supabaseAdmin
      .from('trading_plans')
      .select('*')
      .eq('id', plan_id)
      .eq('is_active', true)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Validate amount within plan limits
    if (amount < plan.min_deposit) {
      return NextResponse.json(
        { error: `Minimum investment is $${plan.min_deposit}` },
        { status: 400 }
      )
    }
    if (plan.max_deposit && amount > plan.max_deposit) {
      return NextResponse.json(
        { error: `Maximum investment is $${plan.max_deposit}` },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: userProfile } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check KYC
    if (userProfile.kyc_status !== 'approved') {
      return NextResponse.json(
        { error: 'KYC verification must be approved before investing' },
        { status: 400 }
      )
    }

    // Check balance — use correct field name 'balance' not 'account_balance'
    if (userProfile.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance. Please make a deposit first.' },
        { status: 400 }
      )
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + plan.capital_withdrawal_days)

    // Create investment — use correct field names from schema
    const { data: investment, error: investError } = await supabaseAdmin
      .from('investments')
      .insert({
        user_id:    user.id,
        plan_id:    plan_id,
        amount:     amount,
        daily_roi:  plan.daily_roi, // ✅ correct field name
        status:     'pending',       // pending admin approval
        start_date: startDate.toISOString(),
        end_date:   endDate.toISOString(),
      })
      .select()
      .single()

    if (investError) {
      console.error('Investment insert error:', investError)
      return NextResponse.json(
        { error: 'Failed to create investment: ' + investError.message },
        { status: 400 }
      )
    }

    // Deduct from balance and increase total_invested
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        balance:        userProfile.balance - amount,        // ✅ correct field
        total_invested: (userProfile.total_invested || 0) + amount,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Balance update error:', updateError)
    }

    // Log transaction — use correct field names
    await supabaseAdmin.from('transactions').insert({
      user_id:          user.id,
      transaction_type: 'deposit', // ✅ correct enum value
      related_id:       investment.id,
      amount:           amount,
      description:      `Investment in ${plan.name} plan — pending approval`,
      status:           'pending',
    })

    return NextResponse.json(
      { success: true, investment, message: 'Investment submitted — pending admin approval' },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('[investment] purchase error:', error)
    return NextResponse.json(
      { error: error?.message || 'Investment purchase failed' },
      { status: 500 }
    )
  }
}
