'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Investment } from '@/types/auth'

export default function InvestmentsPage() {
  const { user } = useAuth()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!user?.id || !supabase) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('investments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) setInvestments(data)
      } catch (err) {
        console.error('[v0] Investments fetch error:', err)
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
        <p className="text-gray-400">Manage and track your active investments</p>
      </div>

      {investments.length === 0 ? (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You have no active investments yet</p>
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Investment ID: {investment.id.slice(0, 8)}...
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p className="text-white font-semibold">${investment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Daily ROI</p>
                        <p className="text-green-400 font-semibold">{investment.daily_roi}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Start Date</p>
                        <p className="text-white">{new Date(investment.start_date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Days Active</p>
                        <p className="text-white">
                          {Math.floor((Date.now() - new Date(investment.start_date).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge className={`border ${getStatusColor(investment.status)} capitalize`}>
                      {investment.status}
                    </Badge>
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
