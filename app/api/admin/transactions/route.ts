import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function isAdmin(adminId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let q = supabaseAdmin
      .from('transactions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) q = q.eq('user_id', userId)
    if (type) q = q.eq('transaction_type', type)

    const { data: transactions, count, error } = await q
    if (error) throw error

    const enriched = await Promise.all((transactions || []).map(async (tx: any) => {
      const { data: user } = await supabaseAdmin
        .from('users').select('email, full_name').eq('id', tx.user_id).single()
      return { ...tx, users: { email: user?.email || 'Unknown', full_name: user?.full_name || '' } }
    }))

    return NextResponse.json({ transactions: enriched, total: count || 0 })
  } catch (error: any) {
    console.error('[admin/transactions] error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch transactions' }, { status: 500 })
  }
}
