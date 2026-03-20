import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: kyc } = await supabaseAdmin.from('kyc_submissions').select('status, rejection_reason, created_at, verified_at').eq('user_id', user.id).single()
    if (!kyc) return NextResponse.json({ status: { status: 'not_started', reason: null, submitted_at: null, approved_at: null } })
    return NextResponse.json({ status: { status: kyc.status, reason: kyc.rejection_reason, submitted_at: kyc.created_at, approved_at: kyc.verified_at } })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch KYC status' }, { status: 500 })
  }
}
