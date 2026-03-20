import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const { data: profile, error: profileError } = await supabaseAdmin.from('users').select('*').eq('id', user.id).single()
    if (profileError || !profile) return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to retrieve profile' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    const body = await request.json()
    const allowed = ['full_name', 'phone', 'bio', 'profile_picture_url']
    const updates: any = { updated_at: new Date().toISOString() }
    allowed.forEach(k => { if (body[k] !== undefined) updates[k] = body[k] })
    const { data: profile, error } = await supabaseAdmin.from('users').update(updates).eq('id', user.id).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, profile })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update profile' }, { status: 500 })
  }
}
