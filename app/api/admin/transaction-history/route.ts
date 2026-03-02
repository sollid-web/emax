import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Mock implementation
    const mockTransactions = [
      {
        id: 'txn_1',
        user_id: userId,
        type: 'credit',
        amount: 500,
        reason: 'Manual credit by admin',
        admin_id: 'admin_1',
        status: 'completed',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'txn_2',
        user_id: userId,
        type: 'debit',
        amount: 100,
        reason: 'Adjustment for fee',
        admin_id: 'admin_1',
        status: 'completed',
        created_at: new Date().toISOString(),
      },
    ]

    const filtered = type ? mockTransactions.filter((t) => t.type === type) : mockTransactions

    return NextResponse.json({
      transactions: filtered.slice(0, limit),
      total: filtered.length,
    })
  } catch (error: any) {
    console.error('[v0] Failed to fetch transaction history:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch history' }, { status: 500 })
  }
}
