import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, currency, withdrawalType, walletAddress } = await request.json()

    if (!amount || !currency || !withdrawalType || !walletAddress) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (parseFloat(amount) <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 })
    }

    if (!walletAddress.trim() || walletAddress.length < 20) {
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    }

    // Check user has sufficient balance
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const withdrawalAmount = parseFloat(amount)

    if (withdrawalType === 'capital') {
      // For capital withdrawals, check if user has completed investments with sufficient capital available
      const { data: completedInvestments } = await supabaseAdmin
        .from('investments')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'completed')

      if (!completedInvestments || completedInvestments.length === 0) {
        return NextResponse.json(
          { error: 'No completed investments available for capital withdrawal' },
          { status: 400 }
        )
      }

      const totalAvailableCapital = completedInvestments.reduce((sum, inv) => sum + inv.amount, 0)

      if (totalAvailableCapital < withdrawalAmount) {
        return NextResponse.json(
          { error: `Insufficient completed investment capital. Available: $${totalAvailableCapital.toFixed(2)}` },
          { status: 400 }
        )
      }

      // Check if user has sufficient balance (which includes ROI earnings)
      if (profile.balance < withdrawalAmount) {
        return NextResponse.json(
          { error: 'Insufficient balance for withdrawal' },
          { status: 400 }
        )
      }
    } else if (withdrawalType === 'profit') {
      // For profit withdrawals, check balance (which should contain ROI earnings)
      if (profile.balance < withdrawalAmount) {
        return NextResponse.json(
          { error: 'Insufficient balance. You can only withdraw earned returns.' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json({ error: 'Invalid withdrawal type' }, { status: 400 })
    }

    // Find or create user crypto wallet record
    const { data: existingWallet } = await supabaseAdmin
      .from('user_crypto_wallets')
      .select('id')
      .eq('user_id', user.id)
      .eq('currency', currency.toUpperCase())
      .single()

    let walletId = existingWallet?.id

    if (!walletId) {
      const { data: newWallet, error: walletError } = await supabaseAdmin
        .from('user_crypto_wallets')
        .insert({
          user_id:        user.id,
          currency:       currency.toUpperCase(),
          wallet_address: walletAddress.trim(),
          is_default:     true,
        })
        .select('id')
        .single()

      if (walletError) throw walletError
      walletId = newWallet.id
    } else {
      // Update wallet address in case it changed
      await supabaseAdmin
        .from('user_crypto_wallets')
        .update({ wallet_address: walletAddress.trim() })
        .eq('id', walletId)
    }

    // Hold the balance immediately to prevent double-spend
    await supabaseAdmin
      .from('users')
      .update({ balance: profile.balance - parseFloat(amount) })
      .eq('id', user.id)

    // Save withdrawal request
    const { data: withdrawal, error: withdrawalError } = await supabaseAdmin
      .from('withdrawals')
      .insert({
        user_id:         user.id,
        amount:          parseFloat(amount),
        withdrawal_type: withdrawalType,
        currency:        currency.toUpperCase(),
        user_wallet_id:  walletId,
        status:          'pending',
      })
      .select()
      .single()

    if (withdrawalError) {
      // Refund the held balance if insert fails
      await supabaseAdmin
        .from('users')
        .update({ balance: profile.balance })
        .eq('id', user.id)
      throw withdrawalError
    }

    // Log transaction record
    await supabaseAdmin.from('transactions').insert({
      user_id:          user.id,
      transaction_type: 'withdrawal',
      related_id:       withdrawal.id,
      amount:           parseFloat(amount),
      description:      `Withdrawal request - ${currency} - pending admin approval`,
      status:           'pending',
    })

    return NextResponse.json(
      { success: true, withdrawal, message: 'Withdrawal request submitted — pending admin approval' },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('[withdrawal] request error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to process withdrawal request' },
      { status: 500 }
    )
  }
}
