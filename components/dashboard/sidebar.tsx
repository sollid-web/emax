'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import {
  LayoutDashboard, Wallet, TrendingUp, Send,
  Settings, Ticket, FileCheck, ShieldCheck, LogOut, User
} from 'lucide-react'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/kyc', icon: FileCheck, label: 'KYC Verification' },
  { href: '/dashboard/deposit', icon: Send, label: 'Deposit Funds' },
  { href: '/dashboard/plans', icon: TrendingUp, label: 'Investment Plans' },
  { href: '/dashboard/portfolio', icon: Wallet, label: 'Portfolio' },
  { href: '/dashboard/investments', icon: TrendingUp, label: 'Investments' },
  { href: '/dashboard/transactions', icon: Send, label: 'Transactions' },
  { href: '/dashboard/withdrawals', icon: Wallet, label: 'Withdrawals' },
  { href: '/dashboard/support', icon: Ticket, label: 'Support Tickets' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

const adminItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Admin Overview' },
  { href: '/admin/kyc', icon: FileCheck, label: 'KYC Reviews' },
  { href: '/admin/deposits', icon: Send, label: 'Deposits' },
  { href: '/admin/withdrawals', icon: Wallet, label: 'Withdrawals' },
  { href: '/admin/crypto-wallets', icon: Wallet, label: 'Crypto Wallets' },
]

export function DashboardSidebar({ onClose }: { onClose?: () => void } = {}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const isAdmin = ['super_admin', 'finance_admin', 'support'].includes(user?.role || '')

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="text-2xl font-bold text-white mb-8 flex flex-col lg:flex-row items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
        Emax
      </Link>

      {/* Main Nav */}
      <nav className="flex flex-col lg:flex-row-1 space-y-1 overflow-y-auto">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Admin Section — only visible to admins */}
        {isAdmin && (
          <div className="pt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-2 flex flex-col lg:flex-row items-center gap-1">
              <ShieldCheck size={12} className="text-yellow-400" />
              Admin
            </p>
            {adminItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                      : 'text-yellow-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Profile Section */}
      <div className="pt-6 border-t border-gray-800 mt-4">
        <div className="flex flex-col lg:flex-row items-center gap-3 px-2 mb-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            {user?.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User size={18} className="text-white" />
            )}
          </div>

          {/* User info */}
          <div className="flex flex-col lg:flex-row-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.full_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            {isAdmin && (
              <span className="text-xs text-yellow-400 font-medium">Admin</span>
            )}
          </div>
        </div>

        {/* KYC Status Badge */}
        <div className="px-2 mb-4">
          <div className={`text-xs px-3 py-1 rounded-full inline-flex items-center gap-1 ${
            user?.kyc_status === 'approved'
              ? 'bg-green-900 text-green-400'
              : user?.kyc_status === 'pending'
              ? 'bg-yellow-900 text-yellow-400'
              : user?.kyc_status === 'rejected'
              ? 'bg-red-900 text-red-400'
              : 'bg-gray-800 text-gray-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            KYC {user?.kyc_status || 'not started'}
          </div>
        </div>

        {/* Balance */}
        <div className="px-2 mb-4 bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-lg font-bold text-white">
            ${(user?.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Sign out */}
        <button
          onClick={() => signOut()}
          className="w-full flex flex-col lg:flex-row items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}