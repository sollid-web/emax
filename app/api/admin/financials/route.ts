import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({
        totalRevenue: 0,
        totalVolume: 0,
        platformProfit: 0,
        activeUsers: 0,
        dailyRevenue: 0,
        monthlyRevenue: 0,
      })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // day, week, month, year

    let dateFilter = new Date()
    if (period === 'day') {
      dateFilter.setDate(dateFilter.getDate() - 1)
    } else if (period === 'week') {
      dateFilter.setDate(dateFilter.getDate() - 7)
    } else if (period === 'month') {
      dateFilter.setMonth(dateFilter.getMonth() - 1)
    } else if (period === 'year') {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1)
    }

    const [transactions, deposits, investments, activeUsers] = await Promise.all([
      supabase
        .from('transactions')
        .select('amount')
        .in('type', ['deposit', 'trade'])
        .gte('created_at', dateFilter.toISOString()),
      supabase
        .from('transactions')
        .select('count', { count: 'exact' })
        .eq('type', 'deposit')
        .gte('created_at', dateFilter.toISOString()),
      supabase
        .from('investments')
        .select('profit')
        .eq('status', 'active')
        .gte('created_at', dateFilter.toISOString()),
      supabase
        .from('portfolios')
        .select('user_id', { count: 'exact' })
        .gte('updated_at', dateFilter.toISOString()),
    ])

    const totalVolume = transactions.data?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0
    const totalProfit = investments.data?.reduce((sum: number, i: any) => sum + (i.profit || 0), 0) || 0
    const platformProfit = totalVolume * 0.05 // 5% fee

    return NextResponse.json({
      totalRevenue: parseFloat(totalVolume.toFixed(2)),
      totalVolume: parseFloat(totalVolume.toFixed(2)),
      platformProfit: parseFloat(platformProfit.toFixed(2)),
      activeUsers: activeUsers.count || 0,
      dailyRevenue: parseFloat((totalVolume / Math.max(1, Math.ceil((Date.now() - dateFilter.getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)),
      monthlyRevenue: parseFloat((totalVolume * 30 / Math.max(1, Math.ceil((Date.now() - dateFilter.getTime()) / (1000 * 60 * 60 * 24)))).toFixed(2)),
      totalDeposits: deposits.count || 0,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
    })
  } catch (error: any) {
    console.error('[v0] Financials fetch error:', error)
    return NextResponse.json({
      totalRevenue: 0,
      totalVolume: 0,
      platformProfit: 0,
      activeUsers: 0,
      dailyRevenue: 0,
      monthlyRevenue: 0,
    })
  }
}
