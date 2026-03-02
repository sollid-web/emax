import { NextRequest, NextResponse } from 'next/server'

interface ApprovalRequest {
  withdrawalId: string
  action: 'approve' | 'process' | 'complete' | 'reject'
  transactionHash?: string
  rejectionReason?: string
}

export async function POST(request: NextRequest) {
  try {
    const { withdrawalId, action, transactionHash, rejectionReason } = (await request.json()) as ApprovalRequest

    if (!withdrawalId || !action) {
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
        if (!transactionHash?.trim()) {
          return NextResponse.json({ error: 'Transaction hash required for completion' }, { status: 400 })
        }
        status = 'completed'
        message = 'Withdrawal completed'
        break
      case 'reject':
        if (!rejectionReason?.trim()) {
          return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
        }
        status = 'rejected'
        message = 'Withdrawal rejected'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Mock response - In production, update Supabase
    const response = {
      id: withdrawalId,
      status,
      timestamp: new Date().toISOString(),
      transactionHash: transactionHash || null,
      rejectionReason: rejectionReason || null,
    }

    return NextResponse.json(
      {
        success: true,
        withdrawal: response,
        message,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Withdrawal approval error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process approval' }, { status: 500 })
  }
}
