'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'trade'
  user_email: string
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  created_at: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      // TODO: Replace with actual API call
      setTransactions([
        {
          id: '1',
          type: 'deposit',
          user_email: 'user1@example.com',
          amount: 5000,
          currency: 'USD',
          status: 'completed',
          created_at: '2024-03-01',
        },
        {
          id: '2',
          type: 'withdrawal',
          user_email: 'user2@example.com',
          amount: 1500,
          currency: 'USD',
          status: 'pending',
          created_at: '2024-03-01',
        },
        {
          id: '3',
          type: 'trade',
          user_email: 'user3@example.com',
          amount: 2000,
          currency: 'BTC',
          status: 'completed',
          created_at: '2024-02-28',
        },
      ])
      setLoading(false)
    } catch (error) {
      console.error('[v0] Failed to fetch transactions:', error)
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.user_email.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.includes(searchTerm)
    const matchesFilter = filterType === 'all' || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />
      case 'trade':
        return <ArrowUpRight className="w-4 h-4 text-blue-400" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Transactions</h1>
        <p className="text-gray-400 mt-2">Monitor all platform transactions and financial activity</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex flex-col lg:flex-row-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by email or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="trade">Trades</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-4">
                {filteredTransactions.map((tx) => (
                  <Card key={tx.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row justify-between items-start space-y-2 lg:space-y-0">
                        <div className="flex flex-col lg:flex-row items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <div>
                            <p className="text-white font-semibold capitalize">{tx.type}</p>
                            <p className="text-gray-400 text-sm">{tx.user_email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row items-end lg:items-center space-y-1 lg:space-y-0 lg:space-x-2">
                          <p className="text-white font-medium">${tx.amount.toLocaleString()} {tx.currency}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">{tx.created_at}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">User</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Currency</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="py-3 px-4">
                          <div className="flex flex-col lg:flex-row items-center gap-2">
                            {getTypeIcon(tx.type)}
                            <span className="capitalize text-white">{tx.type}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{tx.user_email}</td>
                        <td className="py-3 px-4 text-white font-medium">${tx.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-gray-400">{tx.currency}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-400">{tx.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-400">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
