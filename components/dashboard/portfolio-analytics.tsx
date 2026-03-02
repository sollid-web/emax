'use client'

import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioAnalyticsProps {
  portfolio: any
  investments: any[]
}

export function PortfolioAnalytics({ portfolio, investments }: PortfolioAnalyticsProps) {
  if (!portfolio) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground h-4 bg-muted rounded"></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalInvested = investments.reduce((sum: number, inv: any) => sum + inv.amount, 0)
  const totalEarnings = portfolio.total_daily_earnings * 30 // Estimate monthly earnings
  const totalValue = portfolio.current_balance
  const roi = ((totalEarnings / totalInvested) * 100).toFixed(2)

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Current account balance</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalInvested.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Capital deployed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolio.total_daily_earnings.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Average daily returns</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ROI</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{roi}%</div>
          <p className="text-xs text-muted-foreground">Return on investment</p>
        </CardContent>
      </Card>
    </div>
  )
}
