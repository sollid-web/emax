import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        transactions: [],
        total: 0,
      })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let queryBuilder = supabase.from('transactions').select('*', { count: 'exact' })

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId)
    }

    const { data: transactions, count, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('[v0] Transactions fetch error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { user_id, type, amount, description, status } = body

    if (!user_id || !type || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!['deposit', 'withdrawal', 'trade', 'profit'].includes(type)) {
      return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 })
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create transaction in database
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id,
        type,
        amount,
        description: description || null,
        status: status || 'pending',
        created_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    return NextResponse.json(
      { transaction: transaction?.[0], message: `Transaction created successfully` },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[v0] Transaction creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
