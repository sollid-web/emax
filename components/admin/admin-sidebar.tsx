'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  DollarSign,
  BarChart3,
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'KYC Approvals', href: '/admin/kyc' },
  { icon: Wallet, label: 'Crypto Wallets', href: '/admin/crypto-wallets' },
  { icon: CreditCard, label: 'Deposits', href: '/admin/deposits' },
  { icon: Wallet, label: 'Withdrawals', href: '/admin/withdrawals' },
  { icon: TrendingUp, label: 'Investments', href: '/admin/investments' },
  { icon: DollarSign, label: 'Financial Ops', href: '/admin/financials' },
  { icon: BarChart3, label: 'Transactions', href: '/admin/transactions' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Emax Admin</h1>
        <p className="text-xs text-gray-500">Control Panel</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
