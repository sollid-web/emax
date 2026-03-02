import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullname, username } = await request.json()

    if (!email || !password || !fullname || !username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Basic validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // For development: mock authentication
    // In production, replace with real Supabase authentication
    const mockUser = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: email,
      created_at: new Date().toISOString(),
    }

    // Simulate successful signup
    return NextResponse.json(
      { 
        success: true, 
        user: mockUser,
        message: 'Account created successfully. Please check your email to verify.',
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Signup API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Sign up failed' },
      { status: 500 }
    )
  }
}
