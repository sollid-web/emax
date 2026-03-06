'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Save } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    platformName: 'Emax Protocol',
    minDeposit: 100,
    maxDeposit: 1000000,
    minWithdrawal: 50,
    maxWithdrawal: 500000,
    defaultDailyReturn: 10,
    leverage: 5,
    maintenanceMode: false,
    emailNotificationsEnabled: true,
  })

  const [savedMessage, setSavedMessage] = useState('')

  const handleChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      // TODO: API call to save settings
      setSavedMessage('Settings saved successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error) {
      console.error('[v0] Failed to save settings:', error)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white flex flex-col lg:flex-row items-center gap-3">
          <Settings className="w-8 h-8" />
          Platform Settings
        </h1>
        <p className="text-gray-400 mt-2">Configure global platform parameters and rules</p>
      </div>

      {savedMessage && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg">
          {savedMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleChange('platformName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-3">
              <input
                type="checkbox"
                id="maintenance"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="maintenance" className="text-sm font-medium text-gray-300">
                Enable Maintenance Mode
              </label>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-3">
              <input
                type="checkbox"
                id="emails"
                checked={settings.emailNotificationsEnabled}
                onChange={(e) => handleChange('emailNotificationsEnabled', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="emails" className="text-sm font-medium text-gray-300">
                Enable Email Notifications
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Trading Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Default Daily Return (%)</label>
              <input
                type="number"
                value={settings.defaultDailyReturn}
                onChange={(e) => handleChange('defaultDailyReturn', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Leverage</label>
              <input
                type="number"
                value={settings.leverage}
                onChange={(e) => handleChange('leverage', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Deposit Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Deposit ($)</label>
              <input
                type="number"
                value={settings.minDeposit}
                onChange={(e) => handleChange('minDeposit', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Deposit ($)</label>
              <input
                type="number"
                value={settings.maxDeposit}
                onChange={(e) => handleChange('maxDeposit', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Withdrawal ($)</label>
              <input
                type="number"
                value={settings.minWithdrawal}
                onChange={(e) => handleChange('minWithdrawal', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Withdrawal ($)</label>
              <input
                type="number"
                value={settings.maxWithdrawal}
                onChange={(e) => handleChange('maxWithdrawal', parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2" size="lg">
        <Save className="w-4 h-4" />
        Save Settings
      </Button>
    </div>
  )
}
