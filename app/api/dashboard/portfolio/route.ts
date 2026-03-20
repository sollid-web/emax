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

    const { data: portfolio, error } = await supabaseAdmin.from('portfolios').select('*').eq('user_id', user.id).single()
    if (error) return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })

    return NextResponse.json({ success: true, portfolio: portfolio || null })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to load portfolio' }, { status: 500 })
  }
}
