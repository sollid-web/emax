'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, Wallet, CreditCard, Send, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<any>(null)
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

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Your Portfolio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Invested */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex flex-col lg:flex-row items-center gap-2">
                <Wallet size={16} />
                Total Invested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${portfolio?.total_invested?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-gray-500 mt-1">All-time investment</p>
            </CardContent>
          </Card>

          {/* Current Balance */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex flex-col lg:flex-row items-center gap-2">
                <CreditCard size={16} />
                Current Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${portfolio?.current_balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Available balance</p>
            </CardContent>
          </Card>

          {/* Total Profit */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-400 flex flex-col lg:flex-row items-center gap-2">
                <ArrowUpRight size={16} />
                Total Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${portfolio?.total_profit?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
            </CardContent>
          </Card>

          {/* Profit Percentage */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex flex-col lg:flex-row items-center gap-2">
                <TrendingUp size={16} />
                ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                {portfolio?.profit_percentage?.toFixed(2) || '0'}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Return on investment</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => router.push('/dashboard/deposit')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 h-12 text-base"
          >
            <CreditCard size={20} className="mr-2" />
            Deposit Funds
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/withdrawals')}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 h-12 text-base"
          >
            <Send size={20} className="mr-2" />
            Withdraw Profit
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/plans')}
            className="h-12 text-base bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
          >
            View Plans
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/settings')}
            className="h-12 text-base bg-gray-800 border border-gray-700 text-white hover:bg-gray-700"
          >
            Account Settings
          </Button>
        </div>
      </div>

      {/* Empty State for New Users */}
      {!portfolio?.total_invested || portfolio.total_invested === 0 ? (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white">Get Started with Emax Protocol</CardTitle>
            <CardDescription>You haven't invested yet. Choose a trading plan to start earning</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
              View Trading Plans
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
