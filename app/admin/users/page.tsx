'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Search, Filter, ChevronRight } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface User {
  id: string
  email: string
  full_name: string
  account_status: 'active' | 'pending' | 'suspended'
  kyc_status: 'approved' | 'pending' | 'rejected'
  created_at: string
  is_admin: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        q: searchTerm,
        limit: '50',
        offset: '0',
      })
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error('[v0] Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      setUpdating(userId)
      const response = await apiFetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...updates }),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
      }
    } catch (error) {
      console.error('[v0] Failed to update user:', error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'suspended':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getKYCColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8" />
          User Management
        </h1>
        <p className="text-gray-400 mt-2">Manage platform users, KYC status, and account restrictions</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              fetchUsers()
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter(e.target.value || null)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">KYC</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Admin</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <td className="py-3 px-4 text-white">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">{user.full_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.account_status)}`}>
                          {user.account_status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getKYCColor(user.kyc_status)}`}>
                          {user.kyc_status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={user.is_admin}
                          onChange={(e) => updateUser(user.id, { is_admin: e.target.checked })}
                          disabled={updating === user.id}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <select
                          value={user.account_status}
                          onChange={(e) => updateUser(user.id, { account_status: e.target.value as any })}
                          disabled={updating === user.id}
                          className="px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-8 text-gray-400">No users found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
