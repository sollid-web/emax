'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function PortfolioPage() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.id || !supabase) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data) setPortfolio(data)
      } catch (err) {
        console.error('[v0] Portfolio fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolio()
  }, [user?.id])

  // Sample chart data
  const chartData = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 1200 },
    { month: 'Mar', value: 2400 },
    { month: 'Apr', value: 3600 },
    { month: 'May', value: 4800 },
    { month: 'Jun', value: 6000 },
  ]

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Portfolio Performance</h2>
        <p className="text-gray-400">Track your investment growth over time</p>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Balance Growth</CardTitle>
            <CardDescription>Your account balance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Profit Breakdown</CardTitle>
            <CardDescription>Daily profit distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Allocation</CardTitle>
          <CardDescription>How your investments are distributed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Consensus Plan', percentage: 30, amount: '$3,000' },
              { name: 'Polkadot Plan', percentage: 40, amount: '$4,000' },
              { name: 'Ethereum Protocol', percentage: 20, amount: '$2,000' },
              { name: 'Hyperledger Fabric', percentage: 10, amount: '$1,000' },
            ].map((plan) => (
              <div key={plan.name}>
                <div className="flex flex-col lg:flex-row justify-between mb-2">
                  <span className="text-gray-300">{plan.name}</span>
                  <span className="text-white font-semibold">{plan.amount}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">{plan.percentage}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
