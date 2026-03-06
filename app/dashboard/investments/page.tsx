'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// API returns snake_case fields from Supabase
interface InvestmentWithPlan {
  id: string
  user_id: string
  plan_id: string
  amount: number
  daily_roi: number
  total_roi: number
  status: string
  start_date?: string
  end_date?: string
  total_roi_earned?: number
  created_at: string
  approved_at?: string
  activated_at?: string
  trading_plans?: {
    name: string
    capital_withdrawal_days: number
    profit_withdrawal_days: number
  }
}

interface InvestmentSummary {
  totalInvested: number
  totalEarnings: number
  activeInvestments: number
  completedInvestments: number
  availableCapitalForWithdrawal: number
  todaysEarnings: number
}

export default function InvestmentsPage() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState<InvestmentWithPlan[]>([])
  const [summary, setSummary] = useState<InvestmentSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/investments/history')
        const data = await response.json()

        if (data.success) {
          setInvestments(data.investments)
          setSummary(data.summary)
        }
      } catch (err) {
        console.error('Investments fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [user?.id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) return <div className="text-white">Loading investments...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Investments</h2>
        <p className="text-gray-400">Track your investment performance and earnings</p>
      </div>

      {/* Investment Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-white">${summary.totalInvested.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-green-400">${summary.totalEarnings.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Available Capital</p>
                <p className="text-2xl font-bold text-blue-400">${summary.availableCapitalForWithdrawal.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">From completed investments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {investments.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You have no investments yet</p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                Start Investing
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {investments.map((investment) => (
            <Card key={investment.id} className="bg-gray-900 border-gray-800">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-white">
                        {investment.trading_plans?.name || 'Investment Plan'}
                      </h3>
                      <Badge className={`border ${getStatusColor(investment.status)} capitalize`}>
                        {investment.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Invested Amount</p>
                        <p className="text-white font-semibold">${investment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Daily ROI</p>
                        <p className="text-green-400 font-semibold">{investment.daily_roi}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Total Earnings</p>
                        <p className="text-green-400 font-semibold">${(investment.total_roi_earned || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">
                          {investment.status === 'active' ? 'Days Active' : 'End Date'}
                        </p>
                        <p className="text-white">
                          {investment.status === 'active'
                            ? investment.start_date
                              ? Math.floor((Date.now() - new Date(investment.start_date).getTime()) / (1000 * 60 * 60 * 24))
                              : 'N/A'
                            : investment.end_date
                              ? new Date(investment.end_date).toLocaleDateString()
                              : 'N/A'
                          }
                        </p>
                      </div>
                    </div>
                    {investment.status === 'completed' && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-400 text-sm">
                          ✅ Investment completed. Capital of ${investment.amount.toLocaleString()} is now available for withdrawal.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" className="border-gray-700 text-white">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
