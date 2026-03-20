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

    const status = request.nextUrl.searchParams.get('status') || 'pending'

    const { data: submissions, error } = await supabaseAdmin
      .from('kyc_submissions')
      .select('id, user_id, first_name, last_name, country, date_of_birth, status, created_at, rejection_reason')
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Fetch user emails separately to avoid join issues
    const formatted = await Promise.all((submissions || []).map(async (s: any) => {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email, full_name')
        .eq('id', s.user_id)
        .single()
      return {
        id: s.id,
        userId: s.user_id,
        userEmail: user?.email || 'Unknown',
        userName: user?.full_name || `${s.first_name} ${s.last_name}`,
        firstName: s.first_name,
        lastName: s.last_name,
        country: s.country,
        status: s.status,
        rejectionReason: s.rejection_reason,
        submittedAt: s.created_at,
      }
    }))

    return NextResponse.json({ submissions: formatted, total: formatted.length, status })
  } catch (error: any) {
    console.error('[kyc-list] error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch KYC submissions' }, { status: 500 })
  }
}
