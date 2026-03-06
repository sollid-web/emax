'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight, ArrowDownLeft, Plus } from 'lucide-react'
import type { Transaction } from '@/types/auth'

export default function TransactionsPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id || !supabase) {
        setLoading(false)
        return
      }

      try {
        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (data) setTransactions(data)
      } catch (err) {
        console.error('[v0] Transactions fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [user?.id])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-5 h-5" />
      case 'withdrawal':
        return <ArrowDownLeft className="w-5 h-5" />
      case 'profit':
        return <ArrowUpRight className="w-5 h-5" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      failed: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  if (loading) return <div className="text-white">Loading transactions...</div>

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Transaction History</h2>
        <p className="text-gray-400">View all your deposits, withdrawals, and profits</p>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
          <CardDescription>All your account transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col lg:flex-row items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === 'deposit'
                          ? 'bg-blue-500/20 text-blue-400'
                          : transaction.type === 'profit'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-white font-semibold capitalize">{transaction.type}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.created_at).toLocaleDateString()} at{' '}
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {transaction.type === 'withdrawal' || transaction.type === 'deposit' ? '-' : '+'}$
                      {transaction.amount.toLocaleString()}
                    </p>
                    <Badge className={`border mt-2 ${getStatusBadge(transaction.status)} capitalize`}>
                      {transaction.status}
                    </Badge>
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
