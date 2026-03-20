import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const formData = await request.formData()
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const country = formData.get('country') as string
    const state = formData.get('state') as string
    const city = formData.get('city') as string
    const postalCode = formData.get('postalCode') as string
    const address = formData.get('address') as string
    const idType = formData.get('idType') as string
    const idNumber = formData.get('idNumber') as string
    if (!firstName || !lastName || !dateOfBirth || !country || !city || !idType || !idNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const uploadFile = async (file: File | null, path: string) => {
      if (!file) return null
      try {
        const { data, error } = await supabaseAdmin.storage.from('kyc-documents').upload(`${user.id}/${path}`, file, { upsert: true })
        if (error) return null
        return supabaseAdmin.storage.from('kyc-documents').getPublicUrl(data.path).data.publicUrl
      } catch { return null }
    }
    const [idFrontUrl, idBackUrl, selfieUrl, proofUrl] = await Promise.all([
      uploadFile(formData.get('idFront') as File | null, 'id_front'),
      uploadFile(formData.get('idBack') as File | null, 'id_back'),
      uploadFile(formData.get('selfie') as File | null, 'selfie'),
      uploadFile(formData.get('proofOfAddress') as File | null, 'proof_of_address'),
    ])
    const { data: kyc, error: kycError } = await supabaseAdmin.from('kyc_submissions').upsert({
      user_id: user.id, first_name: firstName, last_name: lastName, date_of_birth: dateOfBirth,
      country, state_province: state, city, postal_code: postalCode, address_line_1: address,
      id_type: idType, id_number: idNumber, id_front_url: idFrontUrl, id_back_url: idBackUrl,
      selfie_url: selfieUrl, proof_of_address_url: proofUrl, status: 'pending',
    }, { onConflict: 'user_id' }).select().single()
    if (kycError) throw kycError
    await supabaseAdmin.from('users').update({ kyc_status: 'pending' }).eq('id', user.id)
    return NextResponse.json({ success: true, kyc, message: 'KYC submitted for review' })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to submit KYC' }, { status: 500 })
  }
}
