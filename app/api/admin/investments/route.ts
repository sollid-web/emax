import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { adminId, userId, planId, amount } = await request.json()

    if (!adminId || !userId || !planId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid investment amount' }, { status: 400 })
    }

    // Mock implementation - replace with actual Supabase operations
    const investment = {
      id: `inv_${Date.now()}`,
      user_id: userId,
      plan_id: planId,
      amount,
      daily_roi: 2.0,
      total_roi: 60,
      status: 'active',
      started_by_admin: adminId,
      start_date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    return NextResponse.json(
      { success: true, investment, message: `Investment of $${amount} initiated successfully` },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Investment error:', error)
    return NextResponse.json({ error: error?.message || 'Investment initiation failed' }, { status: 500 })
  }
}
