import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(supabase, adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    let q = supabase.from('transactions').select('*').eq('user_id', userId)
    if (type) q = q.eq('transaction_type', type)
    const { data: transactions, error } = await q.order('created_at', { ascending: false }).limit(limit)
    if (error) throw error
    return NextResponse.json({ transactions: transactions || [], total: transactions?.length || 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch history' }, { status: 500 })
  }
} 