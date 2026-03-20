import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { amount, currency, withdrawalType, walletAddress } = await request.json()
    if (!amount || !currency || !withdrawalType || !walletAddress) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    if (parseFloat(amount) <= 0) return NextResponse.json({ error: 'Invalid withdrawal amount' }, { status: 400 })
    if (!walletAddress.trim() || walletAddress.length < 20) return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
    const { data: profile } = await supabaseAdmin.from('users').select('balance').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    const withdrawalAmount = parseFloat(amount)
    if (withdrawalType === 'capital') {
      const { data: completedInvestments } = await supabaseAdmin.from('investments').select('amount').eq('user_id', user.id).eq('status', 'completed')
      if (!completedInvestments?.length) return NextResponse.json({ error: 'No completed investments available' }, { status: 400 })
      const totalAvailableCapital = completedInvestments.reduce((sum, inv) => sum + inv.amount, 0)
      if (totalAvailableCapital < withdrawalAmount) return NextResponse.json({ error: `Insufficient capital. Available: $${totalAvailableCapital.toFixed(2)}` }, { status: 400 })
      if (profile.balance < withdrawalAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    } else if (withdrawalType === 'profit') {
      if (profile.balance < withdrawalAmount) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    } else {
      return NextResponse.json({ error: 'Invalid withdrawal type' }, { status: 400 })
    }
    const { data: existingWallet } = await supabaseAdmin.from('user_crypto_wallets').select('id').eq('user_id', user.id).eq('currency', currency.toUpperCase()).single()
    let walletId = existingWallet?.id
    if (!walletId) {
      const { data: newWallet, error: walletError } = await supabaseAdmin.from('user_crypto_wallets').insert({ user_id: user.id, currency: currency.toUpperCase(), wallet_address: walletAddress.trim(), is_default: true }).select('id').single()
      if (walletError) throw walletError
      walletId = newWallet.id
    } else {
      await supabaseAdmin.from('user_crypto_wallets').update({ wallet_address: walletAddress.trim() }).eq('id', walletId)
    }
    await supabaseAdmin.from('users').update({ balance: profile.balance - withdrawalAmount }).eq('id', user.id)
    const { data: withdrawal, error: withdrawalError } = await supabaseAdmin.from('withdrawals').insert({
      user_id: user.id, amount: withdrawalAmount, withdrawal_type: withdrawalType,
      currency: currency.toUpperCase(), user_wallet_id: walletId, status: 'pending',
    }).select().single()
    if (withdrawalError) {
      await supabaseAdmin.from('users').update({ balance: profile.balance }).eq('id', user.id)
      throw withdrawalError
    }
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id, transaction_type: 'withdrawal', related_id: withdrawal.id,
      amount: withdrawalAmount, description: `Withdrawal request - ${currency} - pending admin approval`, status: 'pending',
    })
    return NextResponse.json({ success: true, withdrawal, message: 'Withdrawal request submitted' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to process withdrawal request' }, { status: 500 })
  }
}
