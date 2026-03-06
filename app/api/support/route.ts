import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await request.json()

    if (!subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    // Create support ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
      })
      .select()
      .single()

    if (ticketError) {
      console.error('Support ticket creation error:', ticketError)
      return NextResponse.json(
        { error: 'Failed to create support ticket' },
        { status: 500 }
      )
    }

    // Log transaction (optional)
    await supabaseAdmin.from('transactions').insert({
      user_id: user.id,
      transaction_type: 'support',
      related_id: ticket.id,
      amount: 0,
      description: `Support ticket: ${subject}`,
      status: 'completed',
    })

    return NextResponse.json(
      { success: true, ticket, message: 'Support ticket submitted successfully' },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('[support] ticket creation error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create support ticket' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get('sb-auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's support tickets
    const { data: tickets, error: ticketsError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (ticketsError) {
      console.error('Support tickets fetch error:', ticketsError)
      return NextResponse.json(
        { error: 'Failed to fetch support tickets' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tickets }, { status: 200 })

  } catch (error: any) {
    console.error('[support] tickets fetch error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch support tickets' },
      { status: 500 }
    )
  }
}