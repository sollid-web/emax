import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', adminId)
    .single()

  return data?.is_admin || false
}

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get admin auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !adminUser) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const isAdminUser = await isAdmin(supabase, adminUser.id)
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const status = request.nextUrl.searchParams.get('status') || 'pending'

    // Fetch real KYC submissions from database
    const { data: submissions, error } = await supabase
      .from('kyc_submissions')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        country,
        date_of_birth,
        status,
        created_at,
        users:user_id(
          email,
          raw_user_meta_data
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error

    const formatted = submissions.map((s: any) => ({
      id: s.id,
      userId: s.user_id,
      userName: s.users?.raw_user_meta_data?.full_name || `${s.first_name} ${s.last_name}`,
      userEmail: s.users?.email || 'Unknown',
      firstName: s.first_name,
      lastName: s.last_name,
      country: s.country,
      status: s.status,
      submittedAt: s.created_at,
    }))

    return NextResponse.json(
      {
        submissions: formatted,
        total: formatted.length,
        status,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[kyc-list] error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch KYC submissions' },
      { status: 500 }
    )
  }
}
