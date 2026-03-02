import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Verify auth token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()

    const firstName     = formData.get('firstName') as string
    const lastName      = formData.get('lastName') as string
    const dateOfBirth   = formData.get('dateOfBirth') as string
    const country       = formData.get('country') as string
    const state         = formData.get('state') as string
    const city          = formData.get('city') as string
    const postalCode    = formData.get('postalCode') as string
    const address       = formData.get('address') as string
    const idType        = formData.get('idType') as string
    const idNumber      = formData.get('idNumber') as string

    if (!firstName || !lastName || !dateOfBirth || !country || !city || !idType || !idNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Handle file uploads to Supabase Storage
    const uploadFile = async (file: File | null, path: string) => {
      if (!file) return null
      const { data, error } = await supabaseAdmin.storage
        .from('kyc-documents')
        .upload(`${user.id}/${path}`, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabaseAdmin.storage
        .from('kyc-documents')
        .getPublicUrl(data.path)
      return urlData.publicUrl
    }

    const idFrontFile  = formData.get('idFront') as File | null
    const idBackFile   = formData.get('idBack') as File | null
    const selfieFile   = formData.get('selfie') as File | null
    const proofFile    = formData.get('proofOfAddress') as File | null

    const [idFrontUrl, idBackUrl, selfieUrl, proofUrl] = await Promise.all([
      uploadFile(idFrontFile, 'id_front'),
      uploadFile(idBackFile, 'id_back'),
      uploadFile(selfieFile, 'selfie'),
      uploadFile(proofFile, 'proof_of_address'),
    ])

    // Save to kyc_submissions table
    const { data: kyc, error: kycError } = await supabaseAdmin
      .from('kyc_submissions')
      .upsert({
        user_id:          user.id,
        first_name:       firstName,
        last_name:        lastName,
        date_of_birth:    dateOfBirth,
        country,
        state_province:   state,
        city,
        postal_code:      postalCode,
        address_line_1:   address,
        id_type:          idType,
        id_number:        idNumber,
        id_front_url:     idFrontUrl,
        id_back_url:      idBackUrl,
        selfie_url:       selfieUrl,
        proof_of_address_url: proofUrl,
        status:           'pending',
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (kycError) throw kycError

    // Update kyc_status on users table
    await supabaseAdmin
      .from('users')
      .update({ kyc_status: 'pending' })
      .eq('id', user.id)

    return NextResponse.json(
      { success: true, kyc, message: 'KYC submitted for review' },
      { status: 200 }
    )

  } catch (error: any) {
    console.error('[kyc] submit error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to submit KYC' },
      { status: 500 }
    )
  }
}
