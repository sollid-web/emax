'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Shield, TrendingUp, Zap, ArrowRight } from 'lucide-react'

interface Plan {
  id: string
  name: string
  min_deposit: number
  max_deposit: number | null
  daily_roi: number
  profit_withdrawal_days: number
  capital_withdrawal_days: number
  description: string | null
}

export default function DashboardPlansPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/trading-plans')
      .then(r => r.json())
      .then(d => { if (d.plans) setPlans(d.plans) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handlePurchase = async (plan: Plan) => {
    setError(null)
    setSuccess(null)
    setPurchasing(plan.id)
    try {
      const res = await apiFetch('/api/investments/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: plan.id, amount: plan.min_deposit }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to purchase plan')
      } else {
        setSuccess(`Investment in ${plan.name} submitted — pending admin approval`)
        setTimeout(() => router.push('/dashboard/investments'), 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) return <div className="text-white p-8">Loading plans...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Investment Plans</h2>
        <p className="text-gray-400">Choose a trading plan that matches your investment goals</p>
      </div>

      {error && <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">{error}</div>}
      {success && <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">{success}</div>}

      {plans.length === 0 ? (
        <div className="text-gray-400">No active plans available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, idx) => (
            <Card key={plan.id} className={`bg-gray-900 border-gray-800 relative overflow-hidden transition-all hover:border-gray-700 ${idx === 1 ? 'ring-2 ring-purple-500' : ''}`}>
              {idx === 1 && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <CardHeader className={idx === 1 ? 'pt-12' : ''}>
                <CardTitle className="text-2xl text-white mb-1">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description || 'Professional investment plan'}</CardDescription>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Daily ROI:</span>
                    <span className="text-lg font-bold text-green-400">{plan.daily_roi}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Min Deposit:</span>
                    <span className="text-white font-semibold">${plan.min_deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Max Deposit:</span>
                    <span className="text-white font-semibold">{plan.max_deposit ? `$${plan.max_deposit.toLocaleString()}` : 'Unlimited'}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 p-3 bg-gray-800 rounded">
                  <p className="text-sm text-gray-400 font-semibold">Withdrawal Timeline</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-gray-300">Profit: {plan.profit_withdrawal_days} day(s)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-blue-400" />
                    <span className="text-gray-300">Capital: {plan.capital_withdrawal_days} day(s)</span>
                  </div>
                </div>
                <Button
                  onClick={() => handlePurchase(plan)}
                  disabled={purchasing === plan.id}
                  className={`w-full h-10 text-base font-semibold gap-2 ${idx === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                >
                  {purchasing === plan.id ? 'Processing...' : 'Invest Now'}
                  {purchasing !== plan.id && <ArrowRight size={18} />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2"><Shield size={20} />Why Choose Emax Protocol?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex gap-3"><TrendingUp size={20} className="text-green-400 shrink-0" /><div><p className="font-semibold text-white">Consistent Returns</p><p className="text-sm text-gray-400">Daily profits with transparent reporting</p></div></div>
            <div className="flex gap-3"><Zap size={20} className="text-yellow-400 shrink-0" /><div><p className="font-semibold text-white">Fast Withdrawals</p><p className="text-sm text-gray-400">Get your profits within 24 hours</p></div></div>
            <div className="flex gap-3"><Shield size={20} className="text-blue-400 shrink-0" /><div><p className="font-semibold text-white">Secure Platform</p><p className="text-sm text-gray-400">Your funds are protected with advanced security</p></div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
