'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Lock, Mail, Bell, Eye } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    profits: true,
    withdrawals: true,
    security: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // TODO: Save settings to database
      alert('Settings updated successfully')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    setSaving(true)
    try {
      // TODO: Change password using Supabase auth
      alert('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      alert('Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile Information */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Full Name</Label>
            <Input
              type="text"
              value={user?.fullname || ''}
              readOnly
              className="bg-gray-800 border-gray-700 text-gray-400 mt-2"
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
            <Label className="text-gray-300">Username</Label>
            <Input
              type="text"
              value={user?.username || ''}
              readOnly
              className="bg-gray-800 border-gray-700 text-gray-400 mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex flex-col lg:flex-row items-center gap-2">
            <Lock size={20} />
            Security
          </CardTitle>
          <CardDescription>Change your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="text-gray-300">
              Current Password
            </Label>
            <div className="relative mt-2">
              <Input
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white pr-10"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password" className="text-gray-300">
              New Password
            </Label>
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-gray-300">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white mt-2"
              placeholder="Confirm new password"
            />
          </div>

          <Button
            onClick={handleChangePassword}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            disabled={saving || !currentPassword || !newPassword || !confirmPassword}
          >
            {saving ? 'Updating...' : 'Change Password'}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex flex-col lg:flex-row items-center gap-2">
            <Bell size={20} />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex flex-col lg:flex-row items-center gap-2">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">Receive updates via email</p>
              </div>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Profit Notifications</p>
              <p className="text-gray-400 text-sm">Get notified about daily profits</p>
            </div>
            <Switch
              checked={notifications.profits}
              onCheckedChange={(checked) => setNotifications({ ...notifications, profits: checked })}
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Withdrawal Updates</p>
              <p className="text-gray-400 text-sm">Get notified about withdrawal requests</p>
            </div>
            <Switch
              checked={notifications.withdrawals}
              onCheckedChange={(checked) => setNotifications({ ...notifications, withdrawals: checked })}
            />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div>
              <p className="text-white font-medium">Security Alerts</p>
              <p className="text-gray-400 text-sm">Important security notifications</p>
            </div>
            <Switch
              checked={notifications.security}
              onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
            />
          </div>

          <Button
            onClick={handleSaveSettings}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
