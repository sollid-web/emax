import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from '@/app/api/_lib/get-token'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { subject, message } = await request.json()
    if (!subject?.trim() || !message?.trim()) return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
    const { data: ticket, error: ticketError } = await supabaseAdmin.from('support_tickets').insert({ user_id: user.id, subject: subject.trim(), message: message.trim(), status: 'open' }).select().single()
    if (ticketError) return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 })
    return NextResponse.json({ success: true, ticket, message: 'Support ticket submitted successfully' }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to create support ticket' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken(request)
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: tickets, error } = await supabaseAdmin.from('support_tickets').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: 'Failed to fetch support tickets' }, { status: 500 })
    return NextResponse.json({ tickets: tickets || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch support tickets' }, { status: 500 })
  }
}
