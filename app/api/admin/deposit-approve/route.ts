import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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

    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !adminUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const isAdminUser = await isAdmin(supabase, adminUser.id)
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { deposit_id, status, rejection_reason, notes } = await request.json()

    if (!deposit_id || !['approved', 'rejected', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Get deposit details
    const { data: deposit, error: fetchError } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', deposit_id)
      .single()

    if (fetchError || !deposit) {
      return NextResponse.json({ error: 'Deposit not found' }, { status: 404 })
    }

    // Update deposit status
    const updateData: any = {
      status,
      notes,
      approved_by_admin_id: adminUser.id,
      approved_at: new Date().toISOString(),
    }

    if (status === 'rejected') {
      updateData.rejection_reason = rejection_reason
    }

    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: updatedDeposit, error: updateError } = await supabase
      .from('deposits')
      .update(updateData)
      .eq('id', deposit_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update deposit' }, { status: 400 })
    }

    // If approved, credit user's balance (correct column name)
    if (status === 'approved' || status === 'completed') {
      const { data: user } = await supabase
        .from('users')
        .select('balance')
        .eq('id', deposit.user_id)
        .single()

      if (user) {
        const newBalance = (user.balance || 0) + parseFloat(deposit.amount)
        await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', deposit.user_id)

        // Log transaction with correct fields
        await supabase
          .from('transactions')
          .insert({
            user_id: deposit.user_id,
            transaction_type: 'deposit',
            related_id: deposit_id,
            amount: deposit.amount,
            description: 'Deposit approved',
            status: 'completed',
          })
      }
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'deposit_approval',
        entity_type: 'deposit',
        entity_id: deposit_id,
        details: { status, reason: rejection_reason },
      })

    return NextResponse.json(
      { success: true, deposit: updatedDeposit },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Deposit approval error:', error)
    return NextResponse.json(
      { error: error?.message || 'Deposit approval failed' },
      { status: 500 }
    )
  }
}
