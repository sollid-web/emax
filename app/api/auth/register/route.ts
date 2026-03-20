import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    const fullname = body.fullname || body.full_name
    const username = body.username || email.split('@')[0]

    if (!email || !password || !fullname) {
      return NextResponse.json({ error: 'Missing required fields: email, password, full_name' }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single()
    if (existingUser) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { full_name: fullname, username }
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || 'Registration failed' }, { status: 400 })
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    await supabase.from('users').upsert({
      id: authData.user.id, email, full_name: fullname, username,
      kyc_status: 'not_started', balance: 0, total_invested: 0, total_earnings: 0, role: 'user',
    })

    // ✅ Sign in immediately after registration so cookies get set
    const anonClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({ email, password })

    if (signInError || !signInData.session) {
      // Registration succeeded but auto-login failed — user can log in manually
      return NextResponse.json({ success: true, message: 'Account created. Please log in.' }, { status: 201 })
    }

    const response = NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email },
      session: { access_token: signInData.session.access_token, refresh_token: signInData.session.refresh_token },
      message: 'Account created successfully',
    }, { status: 201 })

    // Set same httpOnly cookies as login route
    response.cookies.set('sb-access-token', signInData.session.access_token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60, path: '/',
    })
    response.cookies.set('sb-refresh-token', signInData.session.refresh_token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/',
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Registration failed' }, { status: 500 })
  }
}
