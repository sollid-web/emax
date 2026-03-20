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

    let { withdrawal_id, action, transaction_hash, rejection_reason, status } = await request.json()
    if (!action && status) {
      const map: any = { approved: 'approve', processing: 'process', completed: 'complete', rejected: 'reject' }
      action = map[status]
    }
    if (!withdrawal_id || !action) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const statusMap: any = { approve: 'approved', process: 'processing', complete: 'completed', reject: 'rejected' }
    const newStatus = statusMap[action]
    if (!newStatus) return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    if (action === 'complete' && !transaction_hash?.trim()) return NextResponse.json({ error: 'Transaction hash required' }, { status: 400 })
    if (action === 'reject' && !rejection_reason?.trim()) return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })

    const { data: withdrawal, error: fetchError } = await supabaseAdmin.from('withdrawals').select('*').eq('id', withdrawal_id).single()
    if (fetchError || !withdrawal) return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })

    const updateData: any = { status: newStatus, approved_by_admin_id: adminUser.id, approved_at: new Date().toISOString() }
    if (newStatus === 'completed') { updateData.transaction_hash = transaction_hash; updateData.completed_at = new Date().toISOString() }
    if (newStatus === 'rejected') updateData.rejection_reason = rejection_reason

    const { data: updatedWithdrawal, error: updateError } = await supabaseAdmin.from('withdrawals').update(updateData).eq('id', withdrawal_id).select().single()
    if (updateError) return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 400 })

    if (newStatus === 'rejected') {
      const { data: user } = await supabaseAdmin.from('users').select('balance').eq('id', withdrawal.user_id).single()
      if (user) await supabaseAdmin.from('users').update({ balance: user.balance + parseFloat(withdrawal.amount) }).eq('id', withdrawal.user_id)
    }

    if (newStatus === 'completed') {
      await supabaseAdmin.from('transactions').insert({ user_id: withdrawal.user_id, transaction_type: 'withdrawal', amount: withdrawal.amount, status: 'completed', related_id: withdrawal_id })
    }

    await supabaseAdmin.from('admin_logs').insert({ admin_id: adminUser.id, action: 'withdrawal_approval', target_type: 'withdrawal', target_id: withdrawal_id, details: { action, reason: rejection_reason, transaction_hash } })

    return NextResponse.json({ success: true, withdrawal: updatedWithdrawal })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to process approval' }, { status: 500 })
  }
}
