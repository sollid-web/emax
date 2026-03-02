'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { createInvestment } from '@/lib/db-operations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function InvestmentForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    plan_id: 'consensus',
    amount: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const plans = [
    { id: 'consensus', name: 'Consensus', min: 250, max: 999, roi: 1.5 },
    { id: 'polkadot', name: 'Polkadot', min: 2000, max: 4999, roi: 2 },
    { id: 'ethereum', name: 'Ethereum Protocol', min: 6000, max: 10000, roi: 3 },
    { id: 'hyperledger', name: 'Hyperledger Fabric', min: 20000, max: 999999, roi: 4 },
  ]

  const selectedPlan = plans.find((p) => p.id === formData.plan_id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!selectedPlan) {
      setError('Invalid plan selected')
      return
    }

    const amount = parseFloat(formData.amount)
    if (amount < selectedPlan.min || amount > selectedPlan.max) {
      setError(`Investment amount must be between $${selectedPlan.min} and $${selectedPlan.max}`)
      return
    }

    setLoading(true)
    try {
      await createInvestment({
        user_id: user?.id,
        plan_id: formData.plan_id,
        amount,
        daily_roi: selectedPlan.roi,
        status: 'active',
        created_at: new Date().toISOString(),
      })
      setSuccess(true)
      setFormData({ plan_id: 'consensus', amount: '' })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Investment</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-500 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50">
            <AlertDescription className="text-green-700">Investment created successfully!</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="plan">Investment Plan</Label>
            <select
              id="plan"
              value={formData.plan_id}
              onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - {plan.roi}% Daily ROI
                </option>
              ))}
            </select>
          </div>

          {selectedPlan && (
            <div className="text-sm text-muted-foreground">
              Min: ${selectedPlan.min} | Max: ${selectedPlan.max}
            </div>
          )}

          <div>
            <Label htmlFor="amount">Investment Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min={selectedPlan?.min}
              max={selectedPlan?.max}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Invest Now'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
