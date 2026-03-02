import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verify auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
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

    // Check user has sufficient balance — only ROI withdrawable, not principal
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('balance')
      .eq('id', user.id)
      .single()

    if (!profile || profile.balance < parseFloat(amount)) {
      return NextResponse.json(
        { error: 'Insufficient balance. You can only withdraw earned returns.' },
        { status: 400 }
      )
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
