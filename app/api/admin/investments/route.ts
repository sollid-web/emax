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

    const { investment_id, status, rejection_reason } = await request.json()

    if (!investment_id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    // Get investment details
    const { data: investment, error: fetchError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', investment_id)
      .single()

    if (fetchError || !investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 })
    }

    // Update investment status
    const updateData: any = {
      status,
      approved_by_admin_id: adminUser.id,
      approved_at: new Date().toISOString(),
    }

    if (status === 'rejected') {
      updateData.rejection_reason = rejection_reason
    }

    if (status === 'approved') {
      updateData.status = 'active'
      updateData.activated_at = new Date().toISOString()
    }

    const { data: updatedInvestment, error: updateError } = await supabase
      .from('investments')
      .update(updateData)
      .eq('id', investment_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update investment' }, { status: 400 })
    }

    // If approved, start the investment
    if (status === 'approved') {
      // Update user's active investments count
      const { data: user } = await supabase
        .from('users')
        .select('active_investments')
        .eq('id', investment.user_id)
        .single()

      if (user) {
        await supabase
          .from('users')
          .update({ active_investments: (user.active_investments || 0) + 1 })
          .eq('id', investment.user_id)
      }

      // Log transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: investment.user_id,
          type: 'investment',
          amount: investment.amount,
          status: 'completed',
          reference_id: investment_id,
        })
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'investment_approval',
        entity_type: 'investment',
        entity_id: investment_id,
        details: { status, reason: rejection_reason },
      })

    return NextResponse.json(
      { success: true, investment: updatedInvestment },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Investment approval error:', error)
    return NextResponse.json(
      { error: error?.message || 'Investment approval failed' },
      { status: 500 }
    )
  }
}
