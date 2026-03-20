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

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || null
    const kycStatus = searchParams.get('kyc_status') || null

    let q = supabaseAdmin.from('users').select('*', { count: 'exact' })
    if (query) q = q.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
    if (status) q = q.eq('account_status', status)
    if (kycStatus) q = q.eq('kyc_status', kycStatus)

    const { data: users, count, error } = await q.order('created_at', { ascending: false }).range(offset, offset + limit - 1)
    if (error) throw error

    return NextResponse.json({ users: users || [], total: count || 0 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const { id, account_status, kyc_status, role } = await request.json()
    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    const updateData: any = { updated_at: new Date().toISOString() }
    if (account_status !== undefined) updateData.account_status = account_status
    if (kyc_status !== undefined) updateData.kyc_status = kyc_status
    if (role !== undefined) updateData.role = role

    const { data: user, error } = await supabaseAdmin.from('users').update(updateData).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ user, message: 'User updated successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to update user' }, { status: 500 })
  }
}
