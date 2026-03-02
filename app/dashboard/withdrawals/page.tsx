'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, AlertCircle, CheckCircle2 } from 'lucide-react'
import { apiFetch, apiFormFetch } from '@/lib/api'

const CRYPTO_CURRENCIES = [
  { code: 'BTC', name: 'Bitcoin', icon: '₿' },
  { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { code: 'USDT', name: 'Tether', icon: '₮' },
  { code: 'USDC', name: 'USD Coin', icon: '◎' },
]

interface Withdrawal {
  id: string
  amount: number
  currency: string
  withdrawal_type: string
  wallet_address: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  created_at: string
  approved_at?: string
  completed_at?: string
  transaction_hash?: string
}

export default function WithdrawalsPage() {
  const { user } = useAuth()
  const [currency, setCurrency] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC'>('BTC')
  const [withdrawalType, setWithdrawalType] = useState<'profit' | 'capital'>('profit')
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const balance = user?.balance || 0
  const maxWithdrawal = withdrawalType === 'profit' ? balance * 0.5 : balance

  useEffect(() => {
    fetchWithdrawals()
  }, [user?.id])

  const fetchWithdrawals = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const response = await fetch(`/api/withdrawals/history?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setWithdrawals(data.withdrawals)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!amount || !walletAddress.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    const withdrawAmount = parseFloat(amount)
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setMessage({ type: 'error', text: 'Invalid amount' })
      return
    }

    if (withdrawAmount > maxWithdrawal) {
      setMessage({ type: 'error', text: `Maximum ${withdrawalType} withdrawal: ${maxWithdrawal.toFixed(2)}` })
      return
    }

    setSubmitting(true)
    try {
      const response = await apiFetch('/api/withdrawals/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          amount: withdrawAmount,
          currency,
          withdrawalType,
          walletAddress: walletAddress.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to submit withdrawal' })
        return
      }

      setMessage({ type: 'success', text: 'Withdrawal request submitted successfully' })
      setAmount('')
      setWalletAddress('')
      await fetchWithdrawals()
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  const copyAddress = (id: string) => {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  if (loading) return <div className="text-white">Loading withdrawals...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Withdrawals</h2>
        <p className="text-gray-400">Request cryptocurrency withdrawals to your wallet</p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Withdrawal Request Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Request Withdrawal</CardTitle>
          <CardDescription>Available Balance: ${balance.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Withdrawal Type */}
            <div>
              <Label className="text-gray-300 mb-3 block">Withdrawal Type</Label>
              <div className="flex gap-4">
                {['profit', 'capital'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWithdrawalType(type as 'profit' | 'capital')}
                    className={`flex-1 py-2 px-4 rounded border transition ${
                      withdrawalType === type
                        ? 'bg-blue-500/30 border-blue-500/60 text-blue-200'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {withdrawalType === 'profit'
                  ? 'Withdraw up to 50% of your profits'
                  : 'Withdraw your entire capital after investment completion'}
              </p>
            </div>

            {/* Cryptocurrency Selection */}
            <div>
              <Label className="text-gray-300 mb-3 block">Select Cryptocurrency</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CRYPTO_CURRENCIES.map((crypto) => (
                  <button
                    key={crypto.code}
                    type="button"
                    onClick={() => setCurrency(crypto.code as any)}
                    className={`p-3 rounded border text-center transition ${
                      currency === crypto.code
                        ? 'bg-blue-500/30 border-blue-500/60'
                        : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{crypto.icon}</div>
                    <div className="text-sm font-semibold text-white">{crypto.code}</div>
                    <div className="text-xs text-gray-400">{crypto.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Withdrawal Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={maxWithdrawal}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-2">
                Max: ${maxWithdrawal.toFixed(2)} | Min: $50
              </p>
            </div>

            {/* Wallet Address */}
            <div>
              <Label htmlFor="wallet" className="text-gray-300">
                {currency} Wallet Address
              </Label>
              <Input
                id="wallet"
                type="text"
                placeholder={`Enter your ${currency} wallet address`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white mt-2"
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-2">
                Funds will be sent to this address after admin approval
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              disabled={submitting || !amount || !walletAddress.trim()}
            >
              {submitting ? 'Submitting...' : 'Submit Withdrawal Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Withdrawal History</CardTitle>
          <CardDescription>Track your withdrawal requests and status</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No withdrawal requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{CRYPTO_CURRENCIES.find((c) => c.code === withdrawal.currency)?.icon}</span>
                        <div>
                          <p className="text-white font-semibold">
                            ${withdrawal.amount.toFixed(2)} {withdrawal.currency}
                          </p>
                          <p className="text-gray-400 text-sm capitalize">{withdrawal.withdrawal_type} Withdrawal</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs font-mono break-all mb-2">{withdrawal.wallet_address}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(withdrawal.created_at).toLocaleDateString()} at{' '}
                        {new Date(withdrawal.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge className={`border capitalize whitespace-nowrap ml-4 ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status}
                    </Badge>
                  </div>
                  {withdrawal.status === 'completed' && withdrawal.transaction_hash && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                      <p className="text-gray-300 text-xs font-mono break-all">{withdrawal.transaction_hash}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
