'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Mail, Phone } from 'lucide-react'

export default function SupportPage() {
  const { user } = useAuth()
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // TODO: Submit support ticket to database
      console.log('Support ticket:', { subject, message, user })
      setSubject('')
      setMessage('')
      alert('Support ticket submitted successfully. We will respond within 24 hours.')
    } catch (error) {
      console.error('Error submitting ticket:', error)
      alert('Failed to submit support ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Customer Support</h2>
        <p className="text-gray-400">Get help from our support team</p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-blue-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Email</h3>
            </div>
            <p className="text-gray-400 text-sm">support@emaxprotocol.pro</p>
            <p className="text-gray-500 text-xs mt-2">Response time: 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="text-green-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Phone</h3>
            </div>
            <p className="text-gray-400 text-sm">+1-800-EMAX-123</p>
            <p className="text-gray-500 text-xs mt-2">Mon-Fri: 9 AM - 5 PM EST</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="text-purple-400 w-6 h-6" />
              <h3 className="text-white font-semibold">Live Chat</h3>
            </div>
            <p className="text-gray-400 text-sm">Available in dashboard</p>
            <p className="text-gray-500 text-xs mt-2">Real-time support</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Ticket Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Create Support Ticket</CardTitle>
          <CardDescription>Describe your issue and we'll help you as soon as possible</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-gray-300">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                disabled={submitting}
                required
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-300">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Provide details about your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white h-32"
                disabled={submitting}
                required
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={submitting || !subject || !message}
            >
              {submitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Quick Links */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Common Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'How do I deposit funds?',
              'What are the withdrawal fees?',
              'How do I verify my account?',
              'How can I reset my password?',
              'What is the minimum investment?',
              'How are profits calculated?',
            ].map((faq, index) => (
              <div
                key={index}
                className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition flex items-center justify-between"
              >
                <p className="text-gray-300 text-sm">{faq}</p>
                <span className="text-gray-500">→</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
