import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verifyAdmin(request: NextRequest): Promise<{ id: string } | null> {
  const token = await getToken(request)
  if (!token) return null
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profile } = await supabaseAdmin.from('users').select('id, role').eq('id', user.id).single()
  if (!['super_admin', 'finance_admin', 'support'].includes(profile?.role)) return null
  return { id: profile.id }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: wallets, error } = await supabaseAdmin.from('platform_crypto_wallets')
      .select('id, currency, wallet_address, network, is_active')
      .order('currency', { ascending: true })
    if (error) throw error
    return NextResponse.json({ wallets: wallets || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch wallets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { currency, wallet_address, network, is_active } = await request.json()
    if (!currency || !wallet_address) return NextResponse.json({ error: 'Currency and wallet address are required' }, { status: 400 })
    const { data, error } = await supabaseAdmin.from('platform_crypto_wallets')
      .upsert({ currency: currency.toUpperCase(), wallet_address: wallet_address.trim(), network: network || 'mainnet', is_active: is_active !== false }, { onConflict: 'currency' })
      .select().single()
    if (error) throw error
    await supabaseAdmin.from('admin_logs').insert({ admin_id: admin.id, action: 'update_crypto_wallet', target_type: 'financial', details: { currency, wallet_address: wallet_address.trim(), network } })
    return NextResponse.json({ wallet: data, message: 'Wallet updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update wallet' }, { status: 500 })
  }
}
