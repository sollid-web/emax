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

    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !authUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(authUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const userId = searchParams.get('user_id')

    let q = supabaseAdmin
      .from('investments')
      .select('id, user_id, plan_id, amount, daily_roi, status, created_at, approved_at, start_date, end_date')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (userId) q = q.eq('user_id', userId)

    const { data: investments, error } = await q
    if (error) throw error

    // Fetch user and plan info separately
    const enriched = await Promise.all((investments || []).map(async (inv: any) => {
      const [userRes, planRes] = await Promise.all([
        supabaseAdmin.from('users').select('email, full_name').eq('id', inv.user_id).single(),
        supabaseAdmin.from('trading_plans').select('name').eq('id', inv.plan_id).single(),
      ])
      return {
        ...inv,
        user_email: userRes.data?.email || 'Unknown',
        user_name: userRes.data?.full_name || 'User',
        plan_name: planRes.data?.name || 'Unknown Plan',
      }
    }))

    return NextResponse.json({ investments: enriched })
  } catch (error: any) {
    console.error('[admin/investments] GET error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch investments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !authUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(authUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { investment_id, status, rejection_reason } = await request.json()
    if (!investment_id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { data: investment, error: fetchError } = await supabaseAdmin
      .from('investments').select('*').eq('id', investment_id).single()
    if (fetchError || !investment) return NextResponse.json({ error: 'Investment not found' }, { status: 404 })

    const updateData: any = {
      status: status === 'approved' ? 'active' : 'rejected',
      approved_by_admin_id: authUser.id,
      approved_at: new Date().toISOString(),
    }
    if (status === 'rejected') updateData.rejection_reason = rejection_reason

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('investments').update(updateData).eq('id', investment_id).select().single()
    if (updateError) return NextResponse.json({ error: 'Failed to update investment' }, { status: 400 })

    if (status === 'approved') {
      const { data: user } = await supabaseAdmin.from('users').select('total_invested').eq('id', investment.user_id).single()
      if (user) {
        await supabaseAdmin.from('users')
          .update({ total_invested: (user.total_invested || 0) + parseFloat(investment.amount) })
          .eq('id', investment.user_id)
      }
      await supabaseAdmin.from('transactions').insert({
        user_id: investment.user_id, transaction_type: 'investment',
        amount: investment.amount, status: 'completed', related_id: investment_id,
      })
    }

    await supabaseAdmin.from('admin_logs').insert({
      admin_id: authUser.id, action: 'investment_approval',
      target_type: 'investment', target_id: investment_id,
      details: { status, reason: rejection_reason },
    })

    return NextResponse.json({ success: true, investment: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Investment approval failed' }, { status: 500 })
  }
}
