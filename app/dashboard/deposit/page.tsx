'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, Check, Bitcoin, Coins } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface CryptoWallet {
  id: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  wallet_address: string
  network: string
}

interface DepositHistory {
  id: string
  amount: string
  currency: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  created_at: string
  transaction_hash?: string
}

export default function DepositPage() {
  const { user } = useAuth()
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'USDT' | 'USDC'>('BTC')
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([])
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (user) {
      fetchCryptoWallets()
      fetchDepositHistory()
    }
  }, [user])

  // Wallet addresses are publicly readable, but exposed through a dedicated public endpoint
  // so we don't expose admin-only routes to the client.
  const fetchCryptoWallets = async () => {
    try {
      const response = await apiFetch('/api/crypto-wallets')
      const data = await response.json()
      setCryptoWallets(data.wallets || [])
    } catch (error) {
      console.error('Failed to fetch crypto wallets:', error)
    }
  }

  // FIX 3: Deposit history — use apiFetch so auth token is sent
  const fetchDepositHistory = async () => {
    try {
      const response = await apiFetch('/api/deposits/history')
      const data = await response.json()
      setDepositHistory(data.deposits || [])
    } catch (error) {
      console.error('Failed to fetch deposit history:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedWallet = cryptoWallets.find(w => w.currency === selectedCurrency)

  const copyToClipboard = async () => {
    if (selectedWallet?.wallet_address) {
      await navigator.clipboard.writeText(selectedWallet.wallet_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // FIX 4: Deposit request — use apiFetch so auth token is sent
  // FIX 5: Removed user_id from body — server gets it from the token
  const handleDepositRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' })
      return
    }
    if (!selectedWallet) {
      setMessage({ text: 'No wallet address found for selected currency', type: 'error' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const response = await apiFetch('/api/deposits/request', {
        method: 'POST',
        body: JSON.stringify({
          amount:              depositAmount,
          currency:            selectedCurrency,
          wallet_address_used: selectedWallet.wallet_address,
          transaction_hash:    transactionHash || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ text: 'Deposit request submitted. Admin will review and approve within 1-24 hours.', type: 'success' })
        setDepositAmount('')
        setTransactionHash('')
        fetchDepositHistory()
      } else {
        setMessage({ text: data.error || 'Failed to submit deposit request', type: 'error' })
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const cryptoIcons = {
    BTC:  <Bitcoin className="w-8 h-8 text-orange-500" />,
    ETH:  <Coins className="w-8 h-8 text-blue-500" />,
    USDT: <Coins className="w-8 h-8 text-green-500" />,
    USDC: <Coins className="w-8 h-8 text-blue-400" />,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Deposit Funds</h2>
        <p className="text-gray-400">Select a cryptocurrency and transfer funds to your account</p>
      </div>

      {/* Currency Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['BTC', 'ETH', 'USDT', 'USDC'] as const).map(currency => (
          <button
            key={currency}
            onClick={() => setSelectedCurrency(currency)}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedCurrency === currency
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex flex-col lg:flex-row justify-center mb-3">{cryptoIcons[currency]}</div>
            <p className="font-bold text-white text-lg">{currency}</p>
            <p className="text-gray-400 text-sm">
              {currency === 'BTC' && 'Bitcoin'}
              {currency === 'ETH' && 'Ethereum'}
              {currency === 'USDT' && 'Tether'}
              {currency === 'USDC' && 'USD Coin'}
            </p>
          </button>
        ))}
      </div>

      {/* Wallet Address */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Send {selectedCurrency} to this address</CardTitle>
          <CardDescription>Copy the address, send your {selectedCurrency}, then enter the USD value below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedWallet ? (
            <>
              <div className="space-y-2">
                <Label className="text-gray-300">
                  Wallet Address ({selectedWallet.network})
                </Label>
                <div className="flex flex-col lg:flex-row gap-2">
                  <div className="flex flex-col lg:flex-row-1 p-3 bg-gray-800 rounded border border-gray-700 break-all">
                    <code className="text-blue-400 text-sm">{selectedWallet.wallet_address}</code>
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="bg-blue-600 hover:bg-blue-700 text-white border-0 shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Alert className="border-blue-500 bg-blue-500/10">
                <AlertDescription className="text-blue-200">
                  After sending your {selectedCurrency}, enter the USD equivalent amount below and submit your request. The transaction must be confirmed and approved by our admin team. This typically takes 1-24 hours.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <p className="text-gray-400">No wallet address configured for {selectedCurrency}. Please contact support.</p>
          )}
        </CardContent>
      </Card>

      {/* Deposit Request Form */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Create Deposit Request</CardTitle>
          <CardDescription>Submit a deposit request after sending your funds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDepositRequest} className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-gray-300">
                Deposit Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="txHash" className="text-gray-300">
                Transaction Hash <span className="text-gray-500">(optional but recommended)</span>
              </Label>
              <Input
                id="txHash"
                type="text"
                placeholder="Paste your blockchain transaction ID"
                value={transactionHash}
                onChange={(e) => setTransactionHash(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
              />
            </div>

            {message && (
              <Alert className={message.type === 'success'
                ? 'border-green-500 bg-green-500/10'
                : 'border-red-500 bg-red-500/10'
              }>
                <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={!depositAmount || submitting || !selectedWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {submitting ? 'Submitting...' : 'Submit Deposit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Deposit History */}
      <Card className="border-gray-700 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Deposit History</CardTitle>
          <CardDescription>Track your deposit requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading...</p>
          ) : depositHistory.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No deposit history yet</p>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-4">
                {depositHistory.map(deposit => (
                  <Card key={deposit.id} className="border-gray-700 bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row justify-between items-start space-y-2 lg:space-y-0">
                        <div>
                          <p className="text-white font-semibold">${`${parseFloat(deposit.amount).toLocaleString("en-US", {minimumFractionDigits:2})}`} <span className="text-gray-400 text-xs">via {deposit.currency}</span></p>
                          <p className="text-gray-400 text-sm">
                            {new Date(deposit.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start lg:self-center ${
                          deposit.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          deposit.status === 'approved'  ? 'bg-blue-500/20 text-blue-400' :
                          deposit.status === 'pending'   ? 'bg-yellow-500/20 text-yellow-400' :
                                                           'bg-red-500/20 text-red-400'
                        }`}>
                          {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left py-3 px-2 text-gray-300">Amount</th>
                      <th className="text-left py-3 px-2 text-gray-300">Currency</th>
                      <th className="text-left py-3 px-2 text-gray-300">Date</th>
                      <th className="text-left py-3 px-2 text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {depositHistory.map(deposit => (
                      <tr key={deposit.id} className="border-b border-gray-800">
                        <td className="py-3 px-2 text-white">${`${parseFloat(deposit.amount).toLocaleString("en-US", {minimumFractionDigits:2})}`}</td>
                        <td className="py-3 px-2 text-gray-300">{deposit.currency}</td>
                        <td className="py-3 px-2 text-gray-400">
                          {new Date(deposit.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            deposit.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            deposit.status === 'approved'  ? 'bg-blue-500/20 text-blue-400' :
                            deposit.status === 'pending'   ? 'bg-yellow-500/20 text-yellow-400' :
                                                             'bg-red-500/20 text-red-400'
                          }`}>
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}