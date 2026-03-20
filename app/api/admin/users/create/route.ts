import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function isAdmin(adminId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('users').select('role').eq('id', adminId).single()
  return ['super_admin', 'finance_admin', 'support'].includes(data?.role) || false
}

const ALLOWED_ROLES = ['user', 'support', 'finance_admin', 'super_admin']

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !adminUser) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    if (!await isAdmin(adminUser.id)) return NextResponse.json({ error: 'Admin access required' }, { status: 403 })

    const {
      email,
      password,
      full_name,
      username,
      phone,
      initial_balance = 0,
      role = 'user',
      account_status = 'active',
      kyc_status = 'not_started',
    } = await request.json()

    if (!email || !password || !full_name || !username) {
      return NextResponse.json({ error: 'Missing required fields: email, password, full_name, username' }, { status: 400 })
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }

    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const { data: existingUsername } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
    }

    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name, username },
    })

    if (createError || !authUser?.user) {
      console.error('[admin-users-create] auth error:', createError)
      return NextResponse.json({ error: 'Failed to create user account' }, { status: 500 })
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authUser.user.id,
        email,
        full_name,
        username,
        phone: phone || null,
        balance: parseFloat(initial_balance as any) || 0,
        role,
        account_status,
        kyc_status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (profileError || !profile) {
      console.error('[admin-users-create] profile error:', profileError)
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id).catch(() => {})
      return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
    }

    if (parseFloat(initial_balance as any) > 0) {
      await supabaseAdmin.from('transactions').insert({
        user_id: authUser.user.id,
        transaction_type: 'admin_adjustment',
        amount: parseFloat(initial_balance as any),
        description: 'Initial balance set by admin during account creation',
        status: 'completed',
        related_id: null,
      })
    }

    await supabaseAdmin.from('admin_logs').insert({
      admin_id: adminUser.id,
      action: 'user_creation',
      target_type: 'user',
      target_id: authUser.user.id,
      details: {
        email,
        full_name,
        username,
        initial_balance: parseFloat(initial_balance as any) || 0,
        role,
        account_status,
        kyc_status,
      },
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
        balance: parseFloat(initial_balance as any) || 0,
        role,
        account_status,
        kyc_status,
        created_at: profile.created_at,
      },
    }, { status: 201 })
  } catch (error: any) {
    console.error('[admin-users-create] error:', error)
    return NextResponse.json({ error: error?.message || 'User creation failed' }, { status: 500 })
  }
}
