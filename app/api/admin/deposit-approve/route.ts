import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function isAdmin(adminId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { deposit_id, status, rejection_reason, notes } = await request.json()
    if (!deposit_id || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { data: deposit, error: fetchError } = await supabaseAdmin.from('deposits').select('*').eq('id', deposit_id).single()
    if (fetchError || !deposit) return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })

    const updateData: any = { status, notes, approved_by_admin_id: adminUser.id, approved_at: new Date().toISOString() }
    if (status === 'rejected') updateData.rejection_reason = rejection_reason
    if (status === 'completed') updateData.completed_at = new Date().toISOString()

    const { data: updatedDeposit, error: updateError } = await supabaseAdmin.from('deposits').update(updateData).eq('id', deposit_id).select().single()
    if (updateError) return NextResponse.json({ error: 'Failed to update deposit' }, { status: 400 })

    if (status === 'approved' || status === 'completed') {
      const { data: user } = await supabaseAdmin.from('users').select('balance').eq('id', deposit.user_id).single()
      if (user) {
        await supabaseAdmin.from('users').update({ balance: (user.balance || 0) + parseFloat(deposit.amount) }).eq('id', deposit.user_id)
        await supabaseAdmin.from('transactions').insert({ user_id: deposit.user_id, transaction_type: 'deposit', related_id: deposit_id, amount: deposit.amount, description: 'Deposit approved', status: 'completed' })
      }
    }

    await supabaseAdmin.from('admin_logs').insert({ admin_id: adminUser.id, action: 'deposit_approval', target_type: 'deposit', target_id: deposit_id, details: { status, reason: rejection_reason } })

    return NextResponse.json({ success: true, deposit: updatedDeposit })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Deposit approval failed' }, { status: 500 })
  }
}
