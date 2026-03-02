import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status') || 'pending'

    // TODO: Fetch from database with status filter
    const mockSubmissions = [
      {
        id: 'kyc_001',
        userId: 'user_001',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        country: 'United States',
        status: 'pending',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'kyc_002',
        userId: 'user_002',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        country: 'United Kingdom',
        status: 'pending',
        submittedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    const filtered = mockSubmissions.filter(s => s.status === status)

    return NextResponse.json(
      {
        submissions: filtered,
        total: filtered.length,
        status,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('[v0] KYC list error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch KYC submissions' },
      { status: 500 }
    )
  }
}
