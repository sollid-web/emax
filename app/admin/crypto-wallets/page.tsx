'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Bitcoin, Coins, Pencil, Save, X, CheckCircle, AlertCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface CryptoWallet {
  id: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  wallet_address: string
  network: string
  is_active: boolean
}

const cryptoIcons: Record<string, React.ReactNode> = {
  BTC:  <Bitcoin className="w-6 h-6 text-orange-500" />,
  ETH:  <Coins className="w-6 h-6 text-blue-500" />,
  USDT: <Coins className="w-6 h-6 text-green-500" />,
  USDC: <Coins className="w-6 h-6 text-blue-400" />,
}

export default function AdminCryptoWalletsPage() {
  const { user } = useAuth()
  const [wallets, setWallets] = useState<CryptoWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ wallet_address: '', network: '', is_active: true })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchWallets()
  }, [])

  const fetchWallets = async () => {
    try {
      // Use apiFetch so admin token is sent — gets all wallets including inactive
      const res = await apiFetch('/api/admin/crypto-wallets')
      const data = await res.json()
      setWallets(data.wallets || [])
    } catch (error) {
      console.error('Failed to fetch wallets:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (wallet: CryptoWallet) => {
    setEditingId(wallet.id)
    setEditForm({
      wallet_address: wallet.wallet_address,
      network:        wallet.network,
      is_active:      wallet.is_active,
    })
    setMessage(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ wallet_address: '', network: '', is_active: true })
  }

  const saveWallet = async (currency: string) => {
    if (!editForm.wallet_address.trim()) {
      setMessage({ text: 'Wallet address cannot be empty', type: 'error' })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const res = await apiFetch('/api/admin/crypto-wallets', {
        method: 'POST',
        body: JSON.stringify({
          currency,
          wallet_address: editForm.wallet_address.trim(),
          network:        editForm.network.trim() || 'mainnet',
          is_active:      editForm.is_active,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ text: `${currency} wallet updated successfully`, type: 'success' })
        setEditingId(null)
        fetchWallets() // refresh to show updated data
      } else {
        setMessage({ text: data.error || 'Failed to update wallet', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row items-center justify-center h-64">
        <p className="text-gray-400">Loading wallets...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">Crypto Wallet Management</h2>
        <p className="text-gray-400">Manage platform cryptocurrency wallet addresses shown to users on the deposit page</p>
      </div>

      {/* Global message */}
      {message && (
        <Alert className={message.type === 'success'
          ? 'border-green-500 bg-green-500/10'
          : 'border-red-500 bg-red-500/10'
        }>
          <div className="flex flex-col lg:flex-row items-center gap-2">
            {message.type === 'success'
              ? <CheckCircle className="w-4 h-4 text-green-400" />
              : <AlertCircle className="w-4 h-4 text-red-400" />
            }
            <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Info banner */}
      <Alert className="border-yellow-500 bg-yellow-500/10">
        <AlertDescription className="text-yellow-200">
          These wallet addresses are shown to users when they make deposits. 
          Make sure they are correct before saving. Changes take effect immediately.
        </AlertDescription>
      </Alert>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="border-gray-700 bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="flex flex-col lg:flex-row items-center gap-3">
                  {cryptoIcons[wallet.currency]}
                  <div>
                    <CardTitle className="text-white text-lg">{wallet.currency}</CardTitle>
                    <CardDescription>{wallet.network}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    wallet.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {wallet.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {editingId !== wallet.id && (
                    <Button
                      onClick={() => startEdit(wallet)}
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {editingId === wallet.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 mb-1 block">Wallet Address</Label>
                    <Input
                      value={editForm.wallet_address}
                      onChange={(e) => setEditForm(f => ({ ...f, wallet_address: e.target.value }))}
                      placeholder="Enter wallet address"
                      className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-1 block">Network</Label>
                    <Input
                      value={editForm.network}
                      onChange={(e) => setEditForm(f => ({ ...f, network: e.target.value }))}
                      placeholder="e.g. mainnet, ethereum, polygon"
                      className="bg-gray-800 border-gray-600 text-white text-sm"
                    />
                  </div>

                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    <input
                      type="checkbox"
                      id={`active-${wallet.id}`}
                      checked={editForm.is_active}
                      onChange={(e) => setEditForm(f => ({ ...f, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <Label htmlFor={`active-${wallet.id}`} className="text-gray-300 cursor-pointer">
                      Enable this wallet for deposits
                    </Label>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-3 pt-2">
                    <Button
                      onClick={() => saveWallet(wallet.currency)}
                      disabled={saving}
                      className="flex flex-col lg:flex-row-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      disabled={saving}
                      variant="outline"
                      className="flex flex-col lg:flex-row-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-2">
                  <Label className="text-gray-500 text-xs uppercase tracking-wider">Wallet Address</Label>
                  <div className="p-3 bg-gray-800 rounded border border-gray-700 break-all">
                    <code className="text-blue-400 text-sm">{wallet.wallet_address}</code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {wallets.length === 0 && (
        <Card className="border-gray-700 bg-gray-900">
          <CardContent className="py-12 text-center">
            <p className="text-gray-400">No wallets configured. Run the database setup SQL to add default wallets.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}