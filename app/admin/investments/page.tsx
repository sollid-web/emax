'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface Investment {
  id: string
  user_id: string
  user_email: string
  user_name: string
  plan_name: string
  amount: number
  daily_roi: number
  status: 'pending' | 'active' | 'completed' | 'rejected'
  created_at: string
  start_date?: string
  end_date?: string
  rejection_reason?: string
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      // TODO: Fetch investments from API
      // For now, using mock data
      setInvestments([])
    } catch (error) {
      console.error('Failed to fetch investments:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveInvestment = async (investmentId: string) => {
    try {
      setActionLoading(investmentId)
      const response = await fetch('/api/admin/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investment_id: investmentId,
          status: 'approved'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to approve investment')
      }

      const data = await response.json()
      setMessage({ type: 'success', text: data.message || 'Investment approved successfully' })
      await fetchInvestments()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to approve investment' })
    } finally {
      setActionLoading(null)
    }
  }

  const rejectInvestment = async () => {
    if (!selectedInvestment || !rejectionReason.trim()) return

    try {
      setActionLoading(selectedInvestment.id)
      const response = await fetch('/api/admin/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investment_id: selectedInvestment.id,
          status: 'rejected',
          rejection_reason: rejectionReason
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to reject investment')
      }

      const data = await response.json()
      setMessage({ type: 'success', text: data.message || 'Investment rejected' })
      setSelectedInvestment(null)
      setRejectionReason('')
      await fetchInvestments()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to reject investment' })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'active':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case 'completed':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-500/10 text-red-500"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading investments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Investment Approvals</h2>
        <p className="text-gray-400">Review and approve user investment requests</p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {investments.length === 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="pt-6">
              <div className="text-center text-gray-400">
                No pending investments to review
              </div>
            </CardContent>
          </Card>
        ) : (
          investments.map((investment) => (
            <Card key={investment.id} className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">{investment.user_name}</CardTitle>
                    <CardDescription className="text-gray-400">{investment.user_email}</CardDescription>
                  </div>
                  {getStatusBadge(investment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Plan</p>
                    <p className="text-white font-medium">{investment.plan_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-white font-medium">${investment.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Daily ROI</p>
                    <p className="text-white font-medium">{investment.daily_roi}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Requested</p>
                    <p className="text-white font-medium">{new Date(investment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {investment.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approveInvestment(investment.id)}
                      disabled={actionLoading === investment.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === investment.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedInvestment(investment)}
                      disabled={actionLoading === investment.id}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {investment.status === 'rejected' && investment.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-sm text-red-400">
                      <AlertCircle className="w-4 h-4 inline mr-2" />
                      Rejection reason: {investment.rejection_reason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Rejection Modal */}
      {selectedInvestment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-white">Reject Investment</CardTitle>
              <CardDescription className="text-gray-400">
                Provide a reason for rejecting this investment request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={rejectInvestment}
                  disabled={!rejectionReason.trim() || actionLoading === selectedInvestment.id}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {actionLoading === selectedInvestment.id ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInvestment(null)
                    setRejectionReason('')
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}