import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_request: NextRequest) {
  try {
    const { data: wallets, error } = await supabaseAdmin
      .from('platform_crypto_wallets')
      .select('id, currency, wallet_address, network')
      .eq('is_active', true)
      .order('currency', { ascending: true })

    if (error) throw error

    return NextResponse.json({ wallets: wallets || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch crypto wallets' },
      { status: 500 }
    )
  }
}
