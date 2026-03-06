'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageSquare, Mail, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface SupportTicket {
  id: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
  updated_at: string
  admin_response?: string
}

export default function SupportPage() {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [user])

  const fetchTickets = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch('/api/support')
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    setSubmitting(true)
    setAlertMessage(null)

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit support ticket')
      }

      const data = await response.json()
      setAlertMessage({ type: 'success', text: data.message || 'Support ticket submitted successfully' })
      setSubject('')
      setMessage('')
      await fetchTickets()
    } catch (error: any) {
      setAlertMessage({ type: 'error', text: error.message || 'Failed to submit support ticket' })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500"><Clock className="w-3 h-3 mr-1" />Open</Badge>
      case 'in_progress':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500"><AlertCircle className="w-3 h-3 mr-1" />In Progress</Badge>
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>
      case 'closed':
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-500"><CheckCircle className="w-3 h-3 mr-1" />Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Customer Support</h2>
        <p className="text-gray-400">Get help from our support team</p>
      </div>

      {alertMessage && (
        <Alert className={alertMessage.type === 'success' ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}>
          <AlertDescription className={alertMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}>
            {alertMessage.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
              <Mail className="text-blue-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Email</h3>
            </div>
            <p className="text-gray-400 text-sm">support@emaxprotocol.com</p>
            <p className="text-gray-400 text-sm">Response within 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
              <MessageSquare className="text-green-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Live Chat</h3>
            </div>
            <p className="text-gray-400 text-sm">Available 24/7</p>
            <p className="text-gray-400 text-sm">Average response: 5 minutes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
              <Phone className="text-purple-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Phone</h3>
            </div>
            <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            <p className="text-gray-400 text-sm">Mon-Fri 9AM-6PM EST</p>
          </CardContent>
        </Card>
      </div>

      {/* Submit Ticket Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Submit a Support Ticket</CardTitle>
          <CardDescription className="text-gray-400">
            Describe your issue and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-white">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-white">Message</Label>
              <Textarea
                id="message"
                placeholder="Detailed description of your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={submitting || !subject.trim() || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Ticket History */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Your Support Tickets</CardTitle>
          <CardDescription className="text-gray-400">
            Track the status of your submitted tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No support tickets found</div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{ticket.subject}</h4>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{ticket.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Created: {new Date(ticket.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(ticket.updated_at).toLocaleDateString()}</span>
                  </div>
                  {ticket.admin_response && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                      <p className="text-sm text-blue-400">
                        <strong>Admin Response:</strong> {ticket.admin_response}
                      </p>
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
