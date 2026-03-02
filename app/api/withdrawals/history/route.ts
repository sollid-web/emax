import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
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

    // Fetch real withdrawals from database
    const { data: withdrawals, error } = await supabaseAdmin
      .from('withdrawals')
      .select(`
        *,
        user_crypto_wallets (
          currency,
          wallet_address
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(
      { success: true, withdrawals: withdrawals || [] },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('[withdrawal] history error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch withdrawals' },
      { status: 500 }
    )
  }
}
