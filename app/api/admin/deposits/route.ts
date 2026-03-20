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

    const status = new URL(request.url).searchParams.get('status') || 'pending'
    const { data: depositsRaw, error } = await supabaseAdmin.from('deposits')
      .select('id,user_id,amount,currency,wallet_address_used,transaction_hash,status,created_at,approved_at,notes')
      .eq('status', status).order('created_at', { ascending: false })

    if (error) throw error

    const deposits = await Promise.all(depositsRaw.map(async (d: any) => {
      const { data: user } = await supabaseAdmin.from('users').select('email,full_name').eq('id', d.user_id).single()
      return { ...d, amount: d.amount.toString(), user_email: user?.email || 'Unknown', user_name: user?.full_name || 'User' }
    }))

    return NextResponse.json({ success: true, deposits })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch deposits' }, { status: 500 })
  }
}

export { POST } from '../deposit-approve/route'
