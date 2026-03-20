import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const { data: transactions, error } = await supabaseAdmin
      .from('transactions').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ transactions: transactions || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch transactions' }, { status: 500 })
  }
}
