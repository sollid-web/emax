'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'

interface Withdrawal {
  id: string
  user_id: string
  user_email: string
  user_name: string
  amount: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  withdrawal_type: 'profit' | 'capital'
  wallet_address: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  created_at: string
  notes?: string
}

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/admin/withdrawals?status=pending')
      if (response.ok) {
        const data = await response.json()
        setWithdrawals(data.withdrawals || [])
      } else {
        console.error('Failed to fetch withdrawals:', response.status)
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveWithdrawal = async (withdrawalId: string) => {
    setSubmitting(true)
    try {
      const response = await apiFetch('/api/admin/withdrawals-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          action: 'approve',
        }),
      })

      if (response.ok) {
        setSelectedWithdrawal(null)
        await fetchWithdrawals()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve withdrawal')
      }
    } catch (error) {
      console.error('Failed to approve withdrawal:', error)
      alert('Error approving withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  const processWithdrawal = async (withdrawalId: string) => {
    setSubmitting(true)
    try {
      const response = await apiFetch('/api/admin/withdrawals-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          action: 'process',
        }),
      })

      if (response.ok) {
        setSelectedWithdrawal(null)
        await fetchWithdrawals()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to process withdrawal')
      }
    } catch (error) {
      console.error('Failed to process withdrawal:', error)
      alert('Error processing withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  const completeWithdrawal = async (withdrawalId: string) => {
    if (!transactionHash.trim()) {
      alert('Please provide a transaction hash')
      return
    }
    setSubmitting(true)
    try {
      const response = await apiFetch('/api/admin/withdrawals-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          action: 'complete',
          transaction_hash: transactionHash,
        }),
      })

      if (response.ok) {
        setTransactionHash('')
        setSelectedWithdrawal(null)
        await fetchWithdrawals()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to complete withdrawal')
      }
    } catch (error) {
      console.error('Failed to complete withdrawal:', error)
      alert('Error completing withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  const rejectWithdrawal = async (withdrawalId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    setSubmitting(true)
    try {
      const response = await apiFetch('/api/admin/withdrawals-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          action: 'reject',
          rejection_reason: rejectionReason,
        }),
      })

      if (response.ok) {
        setRejectionReason('')
        setSelectedWithdrawal(null)
        await fetchWithdrawals()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to reject withdrawal')
      }
    } catch (error) {
      console.error('Failed to reject withdrawal:', error)
      alert('Error rejecting withdrawal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Withdrawal Approvals</h1>
        <p className="text-gray-400 mt-2">Review and process cryptocurrency withdrawals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Pending Withdrawals</CardTitle>
              <CardDescription>Users awaiting withdrawal processing</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : withdrawals.length === 0 ? (
                <p className="text-gray-400">No pending withdrawals</p>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex flex-col lg:flex-row items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750"
                      onClick={() => setSelectedWithdrawal(withdrawal)}
                    >
                      <div className="flex flex-col lg:flex-row-1">
                        <p className="font-medium text-white">{withdrawal.user_name}</p>
                        <p className="text-sm text-gray-400">{withdrawal.user_email}</p>
                        <div className="flex flex-col lg:flex-row gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            $${parseFloat(withdrawal.amount).toLocaleString()} via {withdrawal.currency}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({withdrawal.withdrawal_type})
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-900 text-purple-200">
                        {withdrawal.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedWithdrawal && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Review Withdrawal</CardTitle>
              <CardDescription>{selectedWithdrawal.user_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-lg font-bold text-white">
                  $${parseFloat(selectedWithdrawal.amount).toLocaleString()} via {selectedWithdrawal.currency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Type</p>
                <Badge>{selectedWithdrawal.withdrawal_type}</Badge>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                <code className="block p-2 bg-gray-800 rounded text-xs text-gray-300 break-all">
                  {selectedWithdrawal.wallet_address}
                </code>
              </div>

              {selectedWithdrawal.status === 'pending' && (
                <>
                  <Textarea
                    placeholder="Rejection reason (if rejecting)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />

                  <div className="flex flex-col lg:flex-row-col gap-2">
                    <Button
                      onClick={() => approveWithdrawal(selectedWithdrawal.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectWithdrawal(selectedWithdrawal.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </>
              )}

              {selectedWithdrawal.status === 'approved' && (
                <Button
                  onClick={() => processWithdrawal(selectedWithdrawal.id)}
                  className="w-full bg-yellow-600 hover:bg-yellow-700"
                >
                  Start Processing
                </Button>
              )}

              {selectedWithdrawal.status === 'processing' && (
                <>
                  <Input
                    placeholder="Transaction Hash"
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={() => completeWithdrawal(selectedWithdrawal.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Mark Complete
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
