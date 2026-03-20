import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({ email, password })
    if (authError || !authData?.user) {
      return NextResponse.json({ error: authError?.message || 'Invalid email or password' }, { status: 401 })
    }

    const { data: userProfile } = await supabaseAdmin.from('users').select('*').eq('id', authData.user.id).single()

    const response = NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email, created_at: authData.user.created_at },
      profile: userProfile,
      session: { access_token: authData.session?.access_token, refresh_token: authData.session?.refresh_token },
    }, { status: 200 })

    response.cookies.set('sb-access-token', authData.session?.access_token ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    })

    response.cookies.set('sb-refresh-token', authData.session?.refresh_token ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Login failed' }, { status: 500 })
  }
}
