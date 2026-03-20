'use client'

import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    apiFetch('/api/admin/transactions')
      .then(r => r.json())
      .then(d => { if (d.transactions) setTransactions(d.transactions) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = transactions.filter(tx => {
    const email = tx.users?.email || ''
    const matchSearch = email.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.includes(searchTerm)
    const matchType = filterType === 'all' || tx.transaction_type === filterType
    return matchSearch && matchType
  })

  const getStatusColor = (s: string) => ({ completed: 'bg-green-500/20 text-green-400', pending: 'bg-yellow-500/20 text-yellow-400', failed: 'bg-red-500/20 text-red-400' }[s] || 'bg-gray-500/20 text-gray-400')

  return (
    <div className="space-y-8">
      <div><h1 className="text-3xl font-bold text-white">Transactions</h1><p className="text-gray-400 mt-2">Monitor all platform transactions and financial activity</p></div>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader><CardTitle className="text-white">Recent Transactions ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search by email or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none" />
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700">
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="investment">Investments</option>
                <option value="admin_adjustment">Adjustments</option>
              </select>
            </div>
            {loading ? <p className="text-gray-400">Loading...</p> : (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400">User</th>
                  <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400">Date</th>
                </tr></thead>
                <tbody>
                  {filtered.map(tx => (
                    <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-white capitalize">{tx.transaction_type?.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-4 text-gray-300">{tx.users?.email || tx.user_id}</td>
                      <td className="py-3 px-4 text-white font-medium">${parseFloat(tx.amount).toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>{tx.status}</span></td>
                      <td className="py-3 px-4 text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && <div className="text-center py-8 text-gray-400">No transactions found</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
