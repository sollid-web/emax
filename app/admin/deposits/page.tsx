'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check } from 'lucide-react'

interface Deposit {
  id: string
  user_id: string
  user_email: string
  user_name: string
  amount: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  wallet_address_used: string
  transaction_hash?: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  created_at: string
}

export default function DepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchDeposits()
  }, [])

  const fetchDeposits = async () => {
    try {
      setLoading(true)
      // TODO: Fetch deposits from API
    } catch (error) {
      console.error('Failed to fetch deposits:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveDeposit = async (depositId: string) => {
    try {
      // TODO: Call admin deposit approval API
      console.log('Approving deposit:', depositId)
    } catch (error) {
      console.error('Failed to approve deposit:', error)
    }
  }

  const completeDeposit = async (depositId: string) => {
    try {
      // TODO: Call admin deposit complete API
      console.log('Completing deposit:', depositId)
    } catch (error) {
      console.error('Failed to complete deposit:', error)
    }
  }

  const rejectDeposit = async (depositId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    try {
      // TODO: Call admin deposit rejection API
      console.log('Rejecting deposit:', depositId)
      setRejectionReason('')
      setSelectedDeposit(null)
    } catch (error) {
      console.error('Failed to reject deposit:', error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Deposit Approvals</h1>
        <p className="text-gray-400 mt-2">Review and approve cryptocurrency deposits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Pending Deposits</CardTitle>
              <CardDescription>Users awaiting deposit confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : deposits.length === 0 ? (
                <p className="text-gray-400">No pending deposits</p>
              ) : (
                <div className="space-y-4">
                  {deposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="flex flex-col lg:flex-row items-center justify-between p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750"
                      onClick={() => setSelectedDeposit(deposit)}
                    >
                      <div className="flex flex-col lg:flex-row-1">
                        <p className="font-medium text-white">{deposit.user_name}</p>
                        <p className="text-sm text-gray-400">{deposit.user_email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {deposit.amount} {deposit.currency}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-900 text-blue-200">
                        {deposit.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedDeposit && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Review Deposit</CardTitle>
              <CardDescription>{selectedDeposit.user_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Amount</p>
                <p className="text-lg font-bold text-white">
                  {selectedDeposit.amount} {selectedDeposit.currency}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Wallet Address</p>
                <div className="flex flex-col lg:flex-row gap-2">
                  <code className="flex flex-col lg:flex-row-1 p-2 bg-gray-800 rounded text-xs text-gray-300 break-all">
                    {selectedDeposit.wallet_address_used}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedDeposit.wallet_address_used)}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {selectedDeposit.transaction_hash && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">TX Hash</p>
                  <code className="block p-2 bg-gray-800 rounded text-xs text-gray-300 break-all">
                    {selectedDeposit.transaction_hash}
                  </code>
                </div>
              )}

              {selectedDeposit.status === 'pending' && (
                <>
                  <Textarea
                    placeholder="Rejection reason (if rejecting)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />

                  <div className="flex flex-col lg:flex-row-col gap-2">
                    <Button
                      onClick={() => approveDeposit(selectedDeposit.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Approve (Wallet Verified)
                    </Button>
                    <Button
                      onClick={() => completeDeposit(selectedDeposit.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete (Credit User)
                    </Button>
                    <Button
                      onClick={() => rejectDeposit(selectedDeposit.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
