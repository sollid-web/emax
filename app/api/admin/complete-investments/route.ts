import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', adminId)
    .single()

  return ['super_admin','finance_admin','support'].includes(data?.role) || false
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
    const authHeader = request.headers.get('authorization');
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('sb-access-token')?.value || null;
    }
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

    const today = new Date()
    const todayStr = today.toISOString().split('T')[0] // YYYY-MM-DD format

    // Get all active investments that have reached their end date
    const { data: expiredInvestments, error: fetchError } = await supabase
      .from('investments')
      .select(`
        id,
        user_id,
        amount,
        total_profit,
        total_roi_earned,
        status,
        end_date
      `)
      .eq('status', 'active')
      .lt('end_date', todayStr) // End date is before today

    if (fetchError) {
      console.error('Error fetching expired investments:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch investments' }, { status: 500 })
    }

    if (!expiredInvestments || expiredInvestments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No expired investments to complete',
        completed: 0
      })
    }

    let completedCount = 0
    let totalCapitalReturned = 0

    // Process each expired investment
    for (const investment of expiredInvestments) {
      try {
        // Mark investment as completed
        const { error: updateError } = await supabase
          .from('investments')
          .update({
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id)

        if (updateError) {
          console.error(`Error completing investment ${investment.id}:`, updateError)
          continue
        }

        // Return the original capital to user balance
        const { data: user } = await supabase
          .from('users')
          .select('balance, active_investments')
          .eq('id', investment.user_id)
          .single()

        if (user) {
          const { error: balanceError } = await supabase
            .from('users')
            .update({
              balance: (user.balance || 0) + investment.amount,
              active_investments: Math.max(0, (user.active_investments || 0) - 1)
            })
            .eq('id', investment.user_id)

          if (balanceError) {
            console.error(`Error updating user balance for ${investment.user_id}:`, balanceError)
            continue
          }
        }

        // Log transaction for capital return
        await supabase
          .from('transactions')
          .insert({
            user_id: investment.user_id,
            transaction_type: 'investment_return',
            related_id: investment.id,
            amount: investment.amount,
            description: `Investment capital returned - plan completed`,
            status: 'completed'
          })

        // Log admin action
        await supabase
          .from('admin_logs')
          .insert({
            admin_id: adminUser.id,
            action: 'investment_completed',
            entity_type: 'investment',
            entity_id: investment.id,
            details: {
              capital_returned: investment.amount,
              total_profit_earned: investment.total_profit || 0
            }
          })

        completedCount++
        totalCapitalReturned += investment.amount

      } catch (error) {
        console.error(`Error processing investment ${investment.id}:`, error)
        continue
      }
    }

    return NextResponse.json({
      success: true,
      message: `Completed ${completedCount} investments`,
      completed: completedCount,
      totalCapitalReturned: totalCapitalReturned.toFixed(8)
    })

  } catch (error: any) {
    console.error('[complete-investments] error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to complete investments' },
      { status: 500 }
    )
  }
}