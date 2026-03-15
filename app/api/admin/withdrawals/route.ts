import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', adminId)
    .single()

  return data?.is_admin || false
}

// GET: Fetch pending withdrawals for admin
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin auth token from Authorization header or cookies
    const authHeader = request.headers.get('authorization')
    let token = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      const cookieStore = await cookies()
      token = cookieStore.get('sb-auth-token')?.value
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !adminUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const isAdminUser = await isAdmin(supabase, adminUser.id)
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // Get query params for filtering
    const url = new URL(request.url)
    const status = url.searchParams.get('status') || 'pending'

    // First: Fetch all withdrawals
    const { data: withdrawalsRaw, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select(`
        id,
        user_id,
        amount,
        currency,
        withdrawal_type,
        wallet_address,
        status,
        created_at,
        approved_at,
        notes
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (withdrawalError) {
      console.error('[withdrawals GET error]:', withdrawalError)
      throw withdrawalError
    }

    // Then: Get user info separately for better reliability
    const withdrawals = await Promise.all(
      withdrawalsRaw.map(async (w: any) => {
        const { data: user } = await supabase
          .from('users')
          .select('email, full_name, raw_user_meta_data')
          .eq('id', w.user_id)
          .single()

        return {
          id: w.id,
          user_id: w.user_id,
          user_email: user?.email || 'Unknown',
          user_name: user?.full_name || user?.raw_user_meta_data?.full_name || 'User',
          amount: w.amount.toString(),
          currency: w.currency,
          withdrawal_type: w.withdrawal_type,
          wallet_address: w.wallet_address,
          status: w.status,
          created_at: w.created_at,
          approved_at: w.approved_at,
          notes: w.notes,
        }
      })
    )

    return NextResponse.json({ success: true, withdrawals: withdrawals })
  } catch (error: any) {
    console.error('[admin withdrawals] GET error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch withdrawals' }, { status: 500 })
  }
}

// POST: Alias to withdrawals-approve endpoint
export { POST } from '../withdrawals-approve/route'