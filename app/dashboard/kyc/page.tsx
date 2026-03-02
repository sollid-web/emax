'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, Clock, AlertCircle, Upload } from 'lucide-react'
import { apiFetch, apiFormFetch } from '@/lib/api'

interface KYCStatus {
  status: 'not_started' | 'pending' | 'approved' | 'rejected'
  reason?: string
  submitted_at?: string
  approved_at?: string
}

export default function KYCPage() {
  const { user } = useAuth()
  const [kycStatus, setKycStatus] = useState<KYCStatus>({ status: 'not_started' })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    idType: 'passport',
    idNumber: '',
  })
  
  const [files, setFiles] = useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
    addressProof: null as File | null,
  })

  useEffect(() => {
    fetchKYCStatus()
  }, [user?.id])

  const fetchKYCStatus = async () => {
    if (!user?.id) return
    try {
      setLoading(true)
      const response = await fetch(`/api/kyc/status?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setKycStatus(data.status)
      }
    } catch (error) {
      console.error('Failed to fetch KYC status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
    const file = e.target.files?.[0]
    if (file) {
      setFiles(prev => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.country) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    if (!files.idFront || !files.selfie) {
      setMessage({ type: 'error', text: 'Please upload required documents' })
      return
    }

    setSubmitting(true)
    try {
      const data = new FormData()
      data.append('userId', user?.id || '')
      data.append('firstName', formData.firstName)
      data.append('lastName', formData.lastName)
      data.append('dateOfBirth', formData.dateOfBirth)
      data.append('country', formData.country)
      data.append('state', formData.state)
      data.append('city', formData.city)
      data.append('postalCode', formData.postalCode)
      data.append('address', formData.address)
      data.append('idType', formData.idType)
      data.append('idNumber', formData.idNumber)
      
      if (files.idFront) data.append('idFront', files.idFront)
      if (files.idBack) data.append('idBack', files.idBack)
      if (files.selfie) data.append('selfie', files.selfie)
      if (files.addressProof) data.append('addressProof', files.addressProof)

        const response = await apiFetch('/kyc/submit', {
        method: 'POST',
        body: data,
      })

      if (!response.ok) {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to submit KYC' })
        return
      }

      setMessage({ type: 'success', text: 'KYC submitted successfully. Awaiting review.' })
      await fetchKYCStatus()
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      not_started: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-300 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    }
    return colors[status] || colors.not_started
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-5 h-5" />
      case 'pending':
        return <Clock className="w-5 h-5" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  if (loading) return <div className="text-white">Loading KYC status...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Know Your Customer (KYC)</h2>
        <p className="text-gray-400">Complete your identity verification to unlock all features</p>
      </div>

      {message && (
        <Alert className={message.type === 'success' ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* KYC Status */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">KYC Status</CardTitle>
              <CardDescription>Your verification status</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(kycStatus.status)}
              <Badge className={`border capitalize ${getStatusColor(kycStatus.status)}`}>
                {kycStatus.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {kycStatus.status === 'approved' && (
            <div className="text-green-300 text-sm">
              Your identity has been verified. You can now use all platform features.
            </div>
          )}
          {kycStatus.status === 'rejected' && (
            <div className="space-y-2">
              <p className="text-red-300 text-sm">Your KYC submission was rejected:</p>
              <p className="text-gray-300 text-sm bg-gray-800 p-3 rounded">{kycStatus.reason}</p>
              <p className="text-gray-400 text-xs">Please resubmit with corrected information.</p>
            </div>
          )}
          {kycStatus.status === 'pending' && (
            <div className="text-yellow-300 text-sm">
              Your KYC submission is under review. This typically takes 24-48 hours.
            </div>
          )}
          {kycStatus.status === 'not_started' && (
            <div className="text-gray-400 text-sm">
              Complete your KYC verification to enable deposits, investments, and withdrawals.
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Form */}
      {(kycStatus.status === 'not_started' || kycStatus.status === 'rejected') && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Complete Your Profile</CardTitle>
            <CardDescription>Provide your personal and identity information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-white font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob" className="text-gray-300">Date of Birth *</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-white font-semibold mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-gray-300">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Enter your country"
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-300">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-gray-300">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal" className="text-gray-300">Postal Code</Label>
                    <Input
                      id="postal"
                      value={formData.postalCode}
                      onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address" className="text-gray-300">Full Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Identity Information */}
              <div>
                <h3 className="text-white font-semibold mb-4">Identity Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="idType" className="text-gray-300">Document Type *</Label>
                    <select
                      id="idType"
                      value={formData.idType}
                      onChange={(e) => setFormData(prev => ({ ...prev, idType: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 w-full mt-2"
                      disabled={submitting}
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="idNumber" className="text-gray-300">Document Number *</Label>
                    <Input
                      id="idNumber"
                      value={formData.idNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h3 className="text-white font-semibold mb-4">Document Upload</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">ID Front *</Label>
                    <label className="mt-2 flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 bg-gray-800/50">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-300">
                          {files.idFront ? files.idFront.name : 'Upload ID Front'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idFront')}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                  <div>
                    <Label className="text-gray-300">ID Back</Label>
                    <label className="mt-2 flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 bg-gray-800/50">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-300">
                          {files.idBack ? files.idBack.name : 'Upload ID Back'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idBack')}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                  <div>
                    <Label className="text-gray-300">Selfie *</Label>
                    <label className="mt-2 flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 bg-gray-800/50">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-300">
                          {files.selfie ? files.selfie.name : 'Upload Selfie'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'selfie')}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                  <div>
                    <Label className="text-gray-300">Proof of Address</Label>
                    <label className="mt-2 flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 bg-gray-800/50">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-300">
                          {files.addressProof ? files.addressProof.name : 'Upload Address Proof'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'addressProof')}
                        className="hidden"
                        disabled={submitting}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit KYC'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
