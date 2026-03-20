import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function isAdmin(adminId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const body = await request.json()

    // Accept both formats: {kycId, action} from kyc page OR {kyc_id, status} from other callers
    const kycId = body.kycId || body.kyc_id
    const action = body.action || (body.status === 'approved' ? 'approve' : body.status === 'rejected' ? 'reject' : null)
    const rejectionReason = body.rejectionReason || body.rejection_reason

    if (!kycId || !action) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    if (action === 'reject' && !rejectionReason) return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })

    const status = action === 'approve' ? 'approved' : 'rejected'

    const { data: kyc, error: updateError } = await supabaseAdmin
      .from('kyc_submissions')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejectionReason : null,
        verified_at: new Date().toISOString(),
        approved_by_admin_id: adminUser.id,
      })
      .eq('id', kycId)
      .select()
      .single()

    if (updateError) return NextResponse.json({ error: 'Failed to update KYC' }, { status: 400 })

    await supabaseAdmin.from('users').update({ kyc_status: status }).eq('id', kyc.user_id)

    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminUser.id,
      action: 'kyc_review',
      target_type: 'kyc_submission',
      target_id: kycId,
      details: { status, reason: rejectionReason },
    })

    return NextResponse.json({ success: true, data: { kycId, status } })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'KYC approval failed' }, { status: 500 })
  }
}
