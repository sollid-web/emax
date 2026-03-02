import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Clear authentication (client will handle session cleanup)
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] Logout API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Logout failed' },
      { status: 500 }
    )
  }
}
