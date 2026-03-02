import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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

    const mockProfile = {
      id: mockUser.id,
      email: email,
      full_name: email.split('@')[0],
      username: email.split('@')[0],
      balance: 10000,
      total_invested: 5000,
      total_earnings: 1500,
      created_at: new Date().toISOString(),
    }

    // Simulate successful login
    return NextResponse.json(
      { 
        success: true, 
        user: mockUser, 
        profile: mockProfile,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Login API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Login failed' },
      { status: 500 }
    )
  }
}
