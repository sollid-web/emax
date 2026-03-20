import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(supabase, adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    const { user_id, amount, operation, reason, description } = await request.json()
    if (!user_id || !amount || !operation) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    if (!['credit', 'debit'].includes(operation)) return NextResponse.json({ error: 'Operation must be credit or debit' }, { status: 400 })
    const adj = parseFloat(amount)
    if (isNaN(adj) || adj <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    const { data: user, error: userError } = await supabase.from('users').select('balance,email,full_name').eq('id', user_id).single()
    if (userError || !user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const newBalance = operation === 'credit' ? (user.balance || 0) + adj : (user.balance || 0) - adj
    if (newBalance < 0) return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    await supabase.from('users').update({ balance: newBalance, updated_at: new Date().toISOString() }).eq('id', user_id)
    await supabase.from('transactions').insert({ user_id, transaction_type: 'admin_adjustment', amount: adj, description: description || `${operation} by admin: ${reason || 'Manual adjustment'}`, status: 'completed' })
    await supabase.from('admin_logs').insert({ admin_id: adminUser.id, action: 'balance_adjustment', target_type: 'user', target_id: user_id, details: { operation, amount: adj, previous_balance: user.balance || 0, new_balance: newBalance, reason } })
    return NextResponse.json({ success: true, message: `Balance ${operation}ed successfully`, data: { user_id, operation, amount: adj, previous_balance: user.balance || 0, new_balance: newBalance } })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Balance adjustment failed' }, { status: 500 })
  }
}