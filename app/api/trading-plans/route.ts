import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Public route to retrieve available trading plans
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: plans, error } = await supabase
      .from('trading_plans')
      .select('*')
      .eq('is_active', true)
      .order('min_deposit', { ascending: true })

    if (error) {
      console.error('[trading-plans] fetch error', error)
      return NextResponse.json({ error: 'Failed to fetch trading plans' }, { status: 500 })
    }

    return NextResponse.json({ success: true, plans }, { status: 200 })
  } catch (err: any) {
    console.error('[trading-plans] unexpected error', err)
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 })
  }
}
