'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    apiFetch('/api/transactions/history')
      .then(r => r.json())
      .then(d => { if (d.transactions) setTransactions(d.transactions) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const getIcon = (type: string) => {
    if (type === 'deposit') return <Plus className="w-5 h-5" />
    if (type === 'withdrawal') return <ArrowDownLeft className="w-5 h-5" />
    return <ArrowUpRight className="w-5 h-5" />
  }

  const getStatusBadge = (status: string) => ({ completed: 'bg-green-500/20 text-green-400 border-green-500/30', pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', failed: 'bg-red-500/20 text-red-400 border-red-500/30' }[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30')

  if (loading) return <div className="text-white">Loading transactions...</div>

  return (
    <div className="space-y-8">
      <div><h2 className="text-3xl font-bold text-white mb-2">Transaction History</h2><p className="text-gray-400">View all your deposits, withdrawals, and profits</p></div>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader><CardTitle className="text-white">Recent Transactions</CardTitle><CardDescription>All your account transactions</CardDescription></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12"><p className="text-gray-400">No transactions yet</p></div>
          ) : (
            <div className="space-y-4">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${tx.transaction_type === 'deposit' ? 'bg-blue-500/20 text-blue-400' : tx.transaction_type === 'withdrawal' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {getIcon(tx.transaction_type)}
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize">{tx.transaction_type?.replace(/_/g, ' ')}</p>
                      <p className="text-gray-400 text-sm">{new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString()}</p>
                      {tx.description && <p className="text-gray-500 text-xs mt-1">{tx.description}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${parseFloat(tx.amount).toLocaleString()}</p>
                    <Badge className={`border mt-2 ${getStatusBadge(tx.status)} capitalize`}>{tx.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
