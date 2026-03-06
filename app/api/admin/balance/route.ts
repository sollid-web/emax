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

    const { user_id, amount, operation, reason, description } = await request.json()

    if (!user_id || !amount || !operation) {
      return NextResponse.json({ error: 'Missing required fields: user_id, amount, operation' }, { status: 400 })
    }

    if (!['credit', 'debit'].includes(operation)) {
      return NextResponse.json({ error: 'Operation must be either "credit" or "debit"' }, { status: 400 })
    }

    const adjustmentAmount = parseFloat(amount)
    if (isNaN(adjustmentAmount) || adjustmentAmount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Get current user balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('balance, email, full_name')
      .eq('id', user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate new balance
    let newBalance: number
    if (operation === 'credit') {
      newBalance = (user.balance || 0) + adjustmentAmount
    } else { // debit
      newBalance = (user.balance || 0) - adjustmentAmount
      if (newBalance < 0) {
        return NextResponse.json({ error: 'Insufficient balance for debit operation' }, { status: 400 })
      }
    }

    // Update user balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('id', user_id)

    if (updateError) {
      console.error('Balance update error:', updateError)
      return NextResponse.json({ error: 'Failed to update balance' }, { status: 500 })
    }

    // Log transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user_id,
        transaction_type: operation === 'credit' ? 'admin_credit' : 'admin_debit',
        amount: adjustmentAmount,
        description: description || `${operation.charAt(0).toUpperCase() + operation.slice(1)} by admin: ${reason || 'Manual adjustment'}`,
        status: 'completed'
      })

    if (transactionError) {
      console.error('Transaction logging error:', transactionError)
      // Don't fail the operation if logging fails, but log it
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'balance_adjustment',
        entity_type: 'user',
        entity_id: user_id,
        details: {
          operation,
          amount: adjustmentAmount,
          previous_balance: user.balance || 0,
          new_balance: newBalance,
          reason: reason || 'Manual adjustment'
        }
      })

    return NextResponse.json({
      success: true,
      message: `Balance ${operation}ed successfully`,
      data: {
        user_id,
        operation,
        amount: adjustmentAmount,
        previous_balance: user.balance || 0,
        new_balance: newBalance,
        user_email: user.email,
        user_name: user.full_name
      }
    })

  } catch (error: any) {
    console.error('[admin-balance] error:', error)
    return NextResponse.json(
      { error: error?.message || 'Balance adjustment failed' },
      { status: 500 }
    )
  }
}