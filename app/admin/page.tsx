'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, pendingKYC: 0, pendingDeposits: 0, totalVolume: 0, activeInvestments: 0, pendingWithdrawals: 0 })
  const [recentKyc, setRecentKyc] = useState<any[]>([])
  const [recentDeposits, setRecentDeposits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [financials, kyc, deposits, users] = await Promise.all([
          apiFetch('/api/admin/financials').then(r => r.json()),
          apiFetch('/api/admin/kyc-list?status=pending').then(r => r.json()),
          apiFetch('/api/admin/deposits?status=pending').then(r => r.json()),
          apiFetch('/api/admin/users').then(r => r.json()),
        ])
        setStats({
          totalUsers: users.total || 0,
          pendingKYC: financials.pendingKyc || 0,
          pendingDeposits: financials.pendingDeposits || 0,
          totalVolume: financials.totalDeposits || 0,
          activeInvestments: 0,
          pendingWithdrawals: financials.pendingWithdrawals || 0,
        })
        setRecentKyc(kyc.submissions?.slice(0, 3) || [])
        setRecentDeposits(deposits.deposits?.slice(0, 3) || [])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage users, approvals, and platform operations</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total Users', value: stats.totalUsers, color: 'text-white', icon: <Users className="h-4 w-4 text-blue-500" />, sub: 'Registered users' },
          { label: 'Pending KYC', value: stats.pendingKYC, color: 'text-yellow-500', icon: <AlertCircle className="h-4 w-4 text-yellow-500" />, sub: 'Awaiting review' },
          { label: 'Pending Deposits', value: stats.pendingDeposits, color: 'text-green-500', icon: <DollarSign className="h-4 w-4 text-green-500" />, sub: 'Pending approval' },
          { label: 'Active Investments', value: stats.activeInvestments, color: 'text-purple-500', icon: <TrendingUp className="h-4 w-4 text-purple-500" />, sub: 'Currently running' },
          { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, color: 'text-red-500', icon: <AlertCircle className="h-4 w-4 text-red-500" />, sub: 'Awaiting processing' },
          { label: 'Total Volume', value: `$${stats.totalVolume.toFixed(2)}`, color: 'text-indigo-500', icon: <DollarSign className="h-4 w-4 text-indigo-500" />, sub: 'All transactions' },
        ].map(s => (
          <Card key={s.label} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">{s.label}</CardTitle>
              {s.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader><CardTitle className="text-white">Recent KYC Submissions</CardTitle><CardDescription>Latest user KYC requests</CardDescription></CardHeader>
          <CardContent>
            {loading ? <p className="text-gray-400">Loading...</p> : recentKyc.length === 0 ? <p className="text-sm text-gray-400">No pending KYC submissions</p> : (
              <div className="space-y-3">
                {recentKyc.map((k: any) => (
                  <div key={k.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div><p className="text-white text-sm font-medium">{k.firstName} {k.lastName}</p><p className="text-gray-400 text-xs">{k.userEmail}</p></div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">pending</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader><CardTitle className="text-white">Recent Deposits</CardTitle><CardDescription>Latest deposit requests</CardDescription></CardHeader>
          <CardContent>
            {loading ? <p className="text-gray-400">Loading...</p> : recentDeposits.length === 0 ? <p className="text-sm text-gray-400">No pending deposits</p> : (
              <div className="space-y-3">
                {recentDeposits.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div><p className="text-white text-sm font-medium">{d.user_name}</p><p className="text-gray-400 text-xs">{d.user_email}</p></div>
                    <span className="text-white text-sm font-semibold">${parseFloat(d.amount).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
