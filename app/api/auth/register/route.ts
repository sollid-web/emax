import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // support both fullname and full_name for compatibility
    const { email, password, is_admin } = body
    const fullname = body.fullname || body.full_name
    const username = body.username || email.split('@')[0] // Default to email prefix

    if (!email || !password || !fullname) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, full_name' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      )
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullname, username }
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: authError?.message || 'Registration failed' },
        { status: 400 }
      )
    }

    // Wait briefly for trigger to fire first, then upsert
    // to avoid race condition between trigger and manual insert
    await new Promise(resolve => setTimeout(resolve, 500))

    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        id: authData.user.id,
        email,
        full_name: fullname,       // ✅ correct field name
        username,
        kyc_status: 'not_started', // ✅ correct default value
        balance: 0,                // ✅ was wrongly 'account_balance'
        total_invested: 0,
        total_earnings: 0,
        is_admin: is_admin === true, // Allow setting admin flag on registration
      })
      .select()
      .single()

    if (userError) {
      console.error('Profile error:', userError)
      return NextResponse.json(
        { error: 'Failed to create user profile: ' + userError.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user,
        message: 'Account created successfully',
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { error: error?.message || 'Registration failed' },
      { status: 500 }
    )
  }
}