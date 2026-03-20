'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Search, Filter, ChevronRight, Plus, CreditCard, UserPlus } from 'lucide-react'
import { apiFetch } from '@/lib/api'

interface User {
  id: string
  email: string
  full_name: string
  username: string
  balance: number
  account_status: 'active' | 'pending' | 'suspended'
  kyc_status: 'approved' | 'pending' | 'rejected' | 'not_started'
  created_at: string
  role: 'user' | 'super_admin' | 'finance_admin' | 'support'
}

interface CreateUserData {
  email: string
  password: string
  full_name: string
  username: string
  phone: string
  initial_balance: string
  role: 'user' | 'super_admin' | 'finance_admin' | 'support'
}

interface BalanceAdjustmentData {
  user_id: string
  amount: string
  operation: 'credit' | 'debit'
  reason: string
  description: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  // Modal states
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showBalanceModal, setShowBalanceModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Form states
  const [createUserData, setCreateUserData] = useState<CreateUserData>({
    email: '',
    password: '',
    full_name: '',
    username: '',
    phone: '',
    initial_balance: '0',
    role: 'user'
  })

  const [balanceData, setBalanceData] = useState<BalanceAdjustmentData>({
    user_id: '',
    amount: '',
    operation: 'credit',
    reason: '',
    description: ''
  })

  const [submitting, setSubmitting] = useState(false)

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

  const createUser = async () => {
    try {
      setSubmitting(true)
      const response = await apiFetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserData),
      })

      if (response.ok) {
        const data = await response.json()
        setUsers([data.user, ...users])
        setShowCreateUser(false)
        setCreateUserData({
          email: '',
          password: '',
          full_name: '',
          username: '',
          phone: '',
          initial_balance: '0',
          role: 'user'
        })
        alert('User created successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const adjustBalance = async () => {
    try {
      setSubmitting(true)
      const response = await apiFetch('/api/admin/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(balanceData),
      })

      if (response.ok) {
        const data = await response.json()
        // Update the user's balance in the local state
        setUsers(users.map(u =>
          u.id === balanceData.user_id
            ? { ...u, balance: data.data.new_balance }
            : u
        ))
        setShowBalanceModal(false)
        setBalanceData({
          user_id: '',
          amount: '',
          operation: 'credit',
          reason: '',
          description: ''
        })
        setSelectedUser(null)
        alert(`Balance ${balanceData.operation}ed successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to adjust balance')
      }
    } catch (error) {
      console.error('Failed to adjust balance:', error)
      alert('Failed to adjust balance')
    } finally {
      setSubmitting(false)
    }
  }

  const openBalanceModal = (user: User) => {
    setSelectedUser(user)
    setBalanceData({
      user_id: user.id,
      amount: '',
      operation: 'credit',
      reason: '',
      description: ''
    })
    setShowBalanceModal(true)
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
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-gray-400 mt-2">Manage platform users, balances, and account settings</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCreateUser(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col lg:flex-row-1 relative">
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
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No users found</div>
          ) : (
            <>
              {/* Mobile Cards */}
              <div className="block lg:hidden space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-white font-semibold">{user.full_name}</h3>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between items-start space-y-2 lg:space-y-0">
                          <div className="flex flex-col lg:flex-row space-y-1 lg:space-y-0 lg:space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.account_status)}`}>
                              {user.account_status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKYCColor(user.kyc_status)}`}>
                              KYC: {user.kyc_status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Joined: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => updateUser(user.id, { role: e.target.value as any })}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="user">User</option>
                            <option value="support">Support</option>
                            <option value="finance_admin">Finance Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                          <select
                            value={user.account_status}
                            onChange={(e) => updateUser(user.id, { account_status: e.target.value as any })}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-semibold">Balance</th>
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
                        <td className="py-3 px-4 text-green-400 font-semibold">${user.balance?.toFixed(2) || '0.00'}</td>
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
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => updateUser(user.id, { role: e.target.value as any })}
                            disabled={updating === user.id}
                            className="px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="user">User</option>
                            <option value="support">Support</option>
                            <option value="finance_admin">Finance Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openBalanceModal(user)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            Balance
                          </Button>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Create New User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={createUserData.email}
                  onChange={(e) => setCreateUserData({ ...createUserData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input
                  type="password"
                  value={createUserData.password}
                  onChange={(e) => setCreateUserData({ ...createUserData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={createUserData.full_name}
                  onChange={(e) => setCreateUserData({ ...createUserData, full_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input
                  type="text"
                  value={createUserData.username}
                  onChange={(e) => setCreateUserData({ ...createUserData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="johndoe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={createUserData.phone}
                  onChange={(e) => setCreateUserData({ ...createUserData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={createUserData.initial_balance}
                  onChange={(e) => setCreateUserData({ ...createUserData, initial_balance: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  value={createUserData.role}
                  onChange={(e) => setCreateUserData({ ...createUserData, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="support">Support</option>
                  <option value="finance_admin">Finance Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowCreateUser(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={createUser}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {submitting ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Balance Management Modal */}
      {showBalanceModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Manage Balance
              </CardTitle>
              <p className="text-gray-400 text-sm">
                Current balance: <span className="text-green-400 font-semibold">${selectedUser.balance?.toFixed(2) || '0.00'}</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Operation</label>
                <select
                  value={balanceData.operation}
                  onChange={(e) => setBalanceData({ ...balanceData, operation: e.target.value as 'credit' | 'debit' })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                >
                  <option value="credit">Credit (Add Money)</option>
                  <option value="debit">Debit (Subtract Money)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={balanceData.amount}
                  onChange={(e) => setBalanceData({ ...balanceData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Reason</label>
                <input
                  type="text"
                  value={balanceData.reason}
                  onChange={(e) => setBalanceData({ ...balanceData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  placeholder="Bonus, refund, adjustment..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                  value={balanceData.description}
                  onChange={(e) => setBalanceData({ ...balanceData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Additional details about this balance adjustment..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowBalanceModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={adjustBalance}
                  disabled={submitting || !balanceData.amount || !balanceData.reason}
                  className={`flex-1 ${
                    balanceData.operation === 'credit'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting ? 'Processing...' : `${balanceData.operation.charAt(0).toUpperCase() + balanceData.operation.slice(1)} Balance`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
