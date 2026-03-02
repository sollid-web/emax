'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { apiFetch, apiFormFetch } from '@/lib/api'

interface KYCSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  firstName: string
  lastName: string
  country: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  rejectionReason?: string
}

export default function KYCApprovalsPage() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedKYC, setSelectedKYC] = useState<KYCSubmission | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchKYCSubmissions()
  }, [])

  const fetchKYCSubmissions = async () => {
    try {
      setLoading(true)
      const response = await apiFetch('/api/admin/kyc-list?status=pending')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('[v0] Failed to fetch KYC submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const approveKYC = async (kycId: string) => {
    if (!user?.id) return
    setSubmitting(true)
    setMessage(null)
    
    try {
      const response = await apiFetch('/api/admin/kyc-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          kycId,
          action: 'approve',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to approve KYC' })
        return
      }

      setMessage({ type: 'success', text: 'KYC approved successfully' })
      setSelectedKYC(null)
      await fetchKYCSubmissions()
    } catch (error) {
      console.error('[v0] Failed to approve KYC:', error)
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  const rejectKYC = async (kycId: string) => {
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a rejection reason' })
      return
    }

    if (!user?.id) return
    setSubmitting(true)
    setMessage(null)

    try {
      const response = await apiFetch('/api/admin/kyc-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: user.id,
          kycId,
          action: 'reject',
          rejectionReason,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to reject KYC' })
        return
      }

      setMessage({ type: 'success', text: 'KYC rejected' })
      setRejectionReason('')
      setSelectedKYC(null)
      await fetchKYCSubmissions()
    } catch (error) {
      console.error('[v0] Failed to reject KYC:', error)
      setMessage({ type: 'error', text: 'Network error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">KYC Approvals</h1>
        <p className="text-gray-400 mt-2">Review and approve user KYC submissions</p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Pending Submissions</CardTitle>
              <CardDescription>Users awaiting KYC review ({submissions.length})</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : submissions.length === 0 ? (
                <p className="text-gray-400">No pending KYC submissions</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition ${
                        selectedKYC?.id === submission.id
                          ? 'bg-blue-900/50 border border-blue-500'
                          : 'bg-gray-800 hover:bg-gray-750 border border-gray-700'
                      }`}
                      onClick={() => setSelectedKYC(submission)}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{submission.firstName} {submission.lastName}</p>
                        <p className="text-sm text-gray-400">{submission.userEmail}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {submission.country} • Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {selectedKYC && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Review KYC</CardTitle>
              <CardDescription>{selectedKYC.firstName} {selectedKYC.lastName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 bg-gray-800 p-3 rounded">
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-white">{selectedKYC.userEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Country</p>
                  <p className="text-white">{selectedKYC.country}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Submitted</p>
                  <p className="text-white">{new Date(selectedKYC.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedKYC.status === 'pending' && (
                <>
                  <Textarea
                    placeholder="Rejection reason (if rejecting)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                    disabled={submitting}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => approveKYC(selectedKYC.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={submitting}
                    >
                      {submitting ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      onClick={() => rejectKYC(selectedKYC.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      disabled={submitting}
                    >
                      {submitting ? 'Processing...' : 'Reject'}
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
