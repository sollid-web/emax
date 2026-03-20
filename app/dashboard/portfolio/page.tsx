'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PortfolioPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const res = await apiFetch('/api/dashboard/portfolio')
        const data = await res.json()
        if (res.ok && data.portfolio) {
          setPortfolio(data.portfolio)
        } else {
          console.error('[v0] Portfolio fetch error:', data.error || data)
        }
      } catch (err) {
        console.error('[v0] Portfolio fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [user?.id])

  if (loading) return <div className="text-white p-8">Loading...</div>
  if (!portfolio) return <div className="text-white p-8">No portfolio data available.</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio Overview</h2>
        <p className="text-gray-400">View your current balance and investment performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Number(portfolio.total_invested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">All-time investments</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Number(portfolio.current_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Available balance</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-400">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              ${Number(portfolio.total_profit || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Earnings to date</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {Number(portfolio.profit_percentage || 0).toFixed(2)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Return on investment</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
