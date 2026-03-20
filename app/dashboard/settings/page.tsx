'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.fullname || '')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await apiFetch('/api/user/profile')
        const data = await res.json()
        if (res.ok && data.profile) {
          setFullName(data.profile.full_name || user?.fullname || '')
          setPhone(data.profile.phone || '')
          setBio(data.profile.bio || '')
          setProfilePictureUrl(data.profile.profile_picture_url || '')
        }
      } catch (err) {
        console.error('[v0] Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user?.fullname])

  const handleSaveSettings = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await apiFetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          bio,
          profile_picture_url: profilePictureUrl,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')
      setMessage('Settings saved successfully')
    } catch (err: any) {
      setMessage(err?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Settings</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Full Name</Label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-300">Email Address</Label>
            <Input
              type="email"
              value={user?.email || ''}
              readOnly
              className="bg-gray-800 border-gray-700 text-gray-400 mt-2"
            />
          </div>

          <div>
            <Label className="text-gray-300">Phone</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label className="text-gray-300">Bio</Label>
            <Input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <Label className="text-gray-300">Profile Picture URL</Label>
            <Input
              type="text"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              placeholder="https://..."
            />
          </div>

          {message && <div className="text-sm text-green-400">{message}</div>}

          <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
