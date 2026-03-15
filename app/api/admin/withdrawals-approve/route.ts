import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', adminId)
    .single()

  return data?.is_admin || false
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
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

    // support both the newer `action` field and the older `status` alias so
    // our shell scripts (which historically sent `status`) keep working.
    let { withdrawal_id, action, transaction_hash, rejection_reason, status } = await request.json()

    // map status to action when action is not provided
    if (!action && status) {
      switch (status) {
        case 'approved':
          action = 'approve'
          break
        case 'processing':
          action = 'process'
          break
        case 'completed':
          action = 'complete'
          break
        case 'rejected':
          action = 'reject'
          break
      }
    }

    if (!withdrawal_id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let status = ''
    let message = ''

    switch (action) {
      case 'approve':
        status = 'approved'
        message = 'Withdrawal approved successfully'
        break
      case 'process':
        status = 'processing'
        message = 'Withdrawal marked as processing'
        break
      case 'complete':
        if (!transaction_hash?.trim()) {
          return NextResponse.json({ error: 'Transaction hash required for completion' }, { status: 400 })
        }
        status = 'completed'
        message = 'Withdrawal completed'
        break
      case 'reject':
        if (!rejection_reason?.trim()) {
          return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
        }
        status = 'rejected'
        message = 'Withdrawal rejected'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get withdrawal details
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawal_id)
      .single()

    if (fetchError || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    // Update withdrawal status
    const updateData: any = {
      status,
      approved_by_admin_id: adminUser.id,
      approved_at: new Date().toISOString(),
    }

    if (status === 'completed' && transaction_hash) {
      updateData.transaction_hash = transaction_hash
      updateData.completed_at = new Date().toISOString()
    }

    if (status === 'rejected') {
      updateData.rejection_reason = rejection_reason
    }

    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update(updateData)
      .eq('id', withdrawal_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update withdrawal' }, { status: 400 })
    }

    // If completed, this is final - no balance changes needed as it was held during request
    // If rejected, refund the held balance
    if (status === 'rejected') {
      const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', withdrawal.user_id)
        .single()

      if (user) {
        await supabase
          .from('users')
          .update({ balance: user.balance + parseFloat(withdrawal.amount) })
          .eq('id', withdrawal.user_id)
      }
    }

    // Log transaction for completed withdrawals
    if (status === 'completed') {
      await supabase
        .from('transactions')
        .insert({
          user_id: withdrawal.user_id,
          type: 'withdrawal',
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          status: 'completed',
          reference_id: withdrawal_id,
        })
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'withdrawal_approval',
        entity_type: 'withdrawal',
        entity_id: withdrawal_id,
        details: { action, reason: rejection_reason, transaction_hash },
      })

    return NextResponse.json(
      { success: true, withdrawal: updatedWithdrawal, message },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Withdrawal approval error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process approval' }, { status: 500 })
  }
}
