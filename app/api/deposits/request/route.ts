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
    const { amount, currency, wallet_address_used, transaction_hash } = await request.json()
    if (!amount || !currency || !wallet_address_used) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    if (parseFloat(amount) <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    const { data: deposit, error: depositError } = await supabaseAdmin.from('deposits').insert({
      user_id: user.id, amount: parseFloat(amount), currency: currency.toUpperCase(),
      wallet_address_used: wallet_address_used.trim(), transaction_hash: transaction_hash?.trim() || null, status: 'pending',
    }).select().single()
    if (depositError) throw depositError
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id, transaction_type: 'deposit', related_id: deposit.id,
      amount: parseFloat(amount), description: `Deposit request - ${currency} - pending admin approval`, status: 'pending',
    })
    return NextResponse.json({ success: true, deposit, message: 'Deposit request submitted' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create deposit request' }, { status: 500 })
  }
}
