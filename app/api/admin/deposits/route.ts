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

// GET: Fetch pending deposits for admin
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
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

    // First: Fetch all deposits with user details
    const { data: depositsRaw, error: depositError } = await supabase
      .from('deposits')
      .select(`
        id,
        user_id,
        amount,
        currency,
        wallet_address_used,
        transaction_hash,
        status,
        created_at,
        approved_at,
        notes
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (depositError) {
      console.error('[deposits GET error]:', depositError)
      throw depositError
    }

    // Then: Get user info separately for better reliability
    const deposits = await Promise.all(
      depositsRaw.map(async (d: any) => {
        const { data: user } = await supabase
          .from('users')
          .select('email, full_name, raw_user_meta_data')
          .eq('id', d.user_id)
          .single()

        return {
          id: d.id,
          user_id: d.user_id,
          user_email: user?.email || 'Unknown',
          user_name: user?.full_name || user?.raw_user_meta_data?.full_name || 'User',
          amount: d.amount.toString(),
          currency: d.currency,
          wallet_address_used: d.wallet_address_used,
          transaction_hash: d.transaction_hash,
          status: d.status,
          created_at: d.created_at,
          approved_at: d.approved_at,
          notes: d.notes,
        }
      })
    )

    return NextResponse.json({ success: true, deposits: deposits })
  } catch (error: any) {
    console.error('[admin deposits] GET error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch deposits' }, { status: 500 })
  }
}

// POST: Alias to deposit-approve endpoint for backwards compatibility
export { POST } from '../deposit-approve/route'