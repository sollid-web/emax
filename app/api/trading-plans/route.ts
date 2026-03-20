import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { data: plans, error } = await supabaseAdmin.from('trading_plans')
      .select('*').eq('is_active', true).order('min_deposit', { ascending: true })
    if (error) throw error
    return NextResponse.json({ success: true, plans: plans || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch trading plans' }, { status: 500 })
  }
}
