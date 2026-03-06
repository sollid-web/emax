import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

    const {
      email,
      password,
      full_name,
      username,
      phone,
      initial_balance = 0,
      is_admin = false,
      account_status = 'active',
      kyc_status = 'not_started'
    } = await request.json()

    // Validate required fields
    if (!email || !password || !full_name || !username) {
      return NextResponse.json({
        error: 'Missing required fields: email, password, full_name, username'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers()
    const emailExists = existingUser.users.some((user: any) => user.email === email)

    if (emailExists) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    }

    // Create user in Supabase Auth
    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin-created users
      user_metadata: {
        full_name,
        username
      }
    })

    if (authError || !authUser.user) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    // Create user profile in database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        username,
        phone: phone || null,
        balance: parseFloat(initial_balance) || 0,
        is_admin,
        account_status,
        kyc_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Try to delete the auth user if profile creation failed
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    // Log transaction if initial balance was set
    if (parseFloat(initial_balance) > 0) {
      await supabase
        .from('transactions')
        .insert({
          user_id: authUser.user.id,
          transaction_type: 'admin_credit',
          amount: parseFloat(initial_balance),
          description: 'Initial balance set by admin during account creation',
          status: 'completed'
        })
    }

    // Log admin action
    await supabase
      .from('admin_logs')
      .insert({
        admin_id: adminUser.id,
        action: 'user_creation',
        entity_type: 'user',
        entity_id: authUser.user.id,
        details: {
          email,
          full_name,
          username,
          initial_balance: parseFloat(initial_balance) || 0,
          is_admin,
          account_status,
          kyc_status
        }
      })

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: authUser.user.id,
        email,
        full_name,
        username,
        phone,
        balance: parseFloat(initial_balance) || 0,
        is_admin,
        account_status,
        kyc_status,
        created_at: profile.created_at
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('[admin-user-create] error:', error)
    return NextResponse.json(
      { error: error?.message || 'User creation failed' },
      { status: 500 }
    )
  }
}