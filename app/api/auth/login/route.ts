import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData?.user) {
      return NextResponse.json(
        { error: authError?.message || 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Get user details from users table
    let userProfile = null
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
    } else {
      userProfile = profileData
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at,
        },
        profile: userProfile,
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[login] error:', error)
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    )
  }
}
