import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        users: [],
        total: 0,
      })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || null
    const kycStatus = searchParams.get('kyc_status') || null

    let queryBuilder = supabase.from('users').select('*', { count: 'exact' })

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
    }
    if (status) {
      queryBuilder = queryBuilder.eq('account_status', status)
    }
    if (kycStatus) {
      queryBuilder = queryBuilder.eq('kyc_status', kycStatus)
    }

    // Apply pagination
    const { data: users, count, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      users: users || [],
      total: count || 0,
    })
  } catch (error: any) {
    console.error('[v0] Failed to fetch users:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch users' }, { status: 500 })
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
    const { id, account_status, kyc_status, is_admin } = body

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (account_status !== undefined) updateData.account_status = account_status
    if (kyc_status !== undefined) updateData.kyc_status = kyc_status
    if (is_admin !== undefined) updateData.is_admin = is_admin
    updateData.updated_at = new Date().toISOString()

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(
      { user: user?.[0], message: 'User updated successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Failed to update user:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}
