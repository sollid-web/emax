import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

async function isAdmin(supabase: any, adminId: string): Promise<boolean> {
  const { data } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', adminId)
    .single()

  return data?.is_admin || false
}

export async function POST(request: NextRequest) {
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

    // Get admin session from header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7)
    const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !adminUser) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const isAdminUser = await isAdmin(supabase, adminUser.id)
    if (!isAdminUser) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { kyc_id, status, rejection_reason } = await request.json()

    if (!kyc_id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // Update KYC status
    const { data: kyc, error: updateError } = await supabase
      .from('kyc_submissions')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        reviewed_at: new Date().toISOString(),
        reviewed_by_admin_id: adminUser.id,
      })
      .eq('id', kyc_id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update KYC' },
        { status: 400 }
      )
    }

    // Update user KYC status
    if (status === 'approved') {
      await supabase
        .from('users')
        .update({ kyc_status: 'approved' })
        .eq('id', kyc.user_id)
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'kyc_review',
        entity_type: 'kyc_submission',
        entity_id: kyc_id,
        details: { status, reason: rejection_reason },
      })

    return NextResponse.json(
      { success: true, kyc },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] KYC approval error:', error)
    return NextResponse.json(
      { error: error?.message || 'KYC approval failed' },
      { status: 500 }
    )
  }
}
