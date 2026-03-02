import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function verifyAdmin(request: NextRequest): Promise<{ id: string } | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null

  const { data: profile } = await supabaseAdmin
    .from('users')
    .select('id, is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) return null
  return { id: profile.id }
}

// GET — public, anyone can read wallet addresses (needed for deposit page)
export async function GET(request: NextRequest) {
  try {
    const { data: wallets, error } = await supabaseAdmin
      .from('platform_crypto_wallets')
      .select('id, currency, wallet_address, network, is_active')
      .eq('is_active', true)
      .order('currency', { ascending: true })

    if (error) throw error

    return NextResponse.json({ wallets: wallets || [] }, { status: 200 })

  } catch (error: any) {
    console.error('[wallets] fetch error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch wallets' },
      { status: 500 }
    )
  }
}

// POST — admin only, update wallet addresses
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { currency, wallet_address, network, is_active } = body

    if (!currency || !wallet_address) {
      return NextResponse.json(
        { error: 'Currency and wallet address are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('platform_crypto_wallets')
      .upsert(
        {
          currency:       currency.toUpperCase(),
          wallet_address: wallet_address.trim(),
          network:        network || 'mainnet',
          is_active:      is_active !== false,
        },
        { onConflict: 'currency' }
      )
      .select()
      .single()

    if (error) throw error

    await supabaseAdmin.from('admin_logs').insert({
      admin_id:    admin.id,
      action:      'update_crypto_wallet',
      target_type: 'financial',
      details:     { currency, wallet_address: wallet_address.trim(), network },
    })

    return NextResponse.json(
      { wallet: data, message: 'Wallet updated successfully' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('[wallets] update error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update wallet' },
      { status: 500 }
    )
  }
}
