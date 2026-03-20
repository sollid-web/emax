'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import {
  LogOut, Bell, Settings, User, ShieldCheck,
  ChevronDown, Wallet, FileCheck, Menu
} from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps = {}) {
  const { user, signOut } = useAuth()
  const isAdmin = ['super_admin', 'finance_admin', 'support'].includes(user?.role || '')
  const [profileOpen, setProfileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-3 md:px-8 py-3 md:py-4">
      {/* Mobile layout: stacked rows */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left — Page title (mobile-compact) */}
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-white truncate">Dashboard</h1>
          <p className="text-gray-400 text-xs md:text-sm truncate">
            Welcome back, {user?.full_name || user?.email?.split('@')[0]}
          </p>
        </div>

        {/* Right — Actions + Profile (mobile-compact) */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 md:p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          {/* Notifications */}
          <button className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition">
            <Bell size={18} />
          </button>

          {/* Settings */}
          <Link
            href="/dashboard/settings"
            className="p-1.5 md:p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
          >
            <Settings size={18} />
          </Link>

          {/* Admin link — only if admin, hidden on mobile */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition text-xs md:text-sm font-medium"
            >
              <ShieldCheck size={16} />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 hover:bg-gray-800 rounded-lg transition"
            >
              {/* Avatar */}
              <div className="w-7 md:w-8 h-7 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="avatar"
                    className="w-7 md:w-8 h-7 md:h-8 rounded-full object-cover"
                  />
                ) : (
                  <User size={14} className="text-white" />
                )}
              </div>
              <span className="text-xs md:text-sm text-white hidden sm:inline">
                {user?.full_name?.split(' ')[0] || 'Profile'}
              </span>
              <ChevronDown size={12} className="text-gray-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 md:w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">

                {/* User Info */}
                <div className="p-4 border-b border-gray-800">
                  <div className="flex flex-col lg:flex-row items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      {user?.profile_picture_url ? (
                        <img
                          src={user.profile_picture_url}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-white" />
                      )}
                    </div>
                    <div className="flex flex-col lg:flex-row-1 min-w-0">
                      <p className="text-white font-semibold truncate">{user?.full_name}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="text-xs text-yellow-400 font-medium flex flex-col lg:flex-row items-center gap-1 mt-0.5">
                          <ShieldCheck size={10} /> Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-4 border-b border-gray-800 grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Balance</p>
                    <p className="text-white font-bold text-sm">
                      ${(user?.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Invested</p>
                    <p className="text-white font-bold text-sm">
                      ${(user?.total_invested ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* KYC Status */}
                <div className="px-4 py-3 border-b border-gray-800">
                  <div className="flex flex-col lg:flex-row items-center justify-between">
                    <span className="text-xs text-gray-400">KYC Status</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user?.kyc_status === 'approved'
                        ? 'bg-green-900 text-green-400'
                        : user?.kyc_status === 'pending'
                        ? 'bg-yellow-900 text-yellow-400'
                        : user?.kyc_status === 'rejected'
                        ? 'bg-red-900 text-red-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {user?.kyc_status || 'Not Started'}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="p-2">
                  <Link
                    href="/dashboard/kyc"
                    onClick={() => setProfileOpen(false)}
                    className="flex flex-col lg:flex-row items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"
                  >
                    <FileCheck size={16} />
                    KYC Verification
                  </Link>
                  <Link
                    href="/dashboard/portfolio"
                    onClick={() => setProfileOpen(false)}
                    className="flex flex-col lg:flex-row items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"
                  >
                    <Wallet size={16} />
                    Portfolio
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex flex-col lg:flex-row items-center gap-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex flex-col lg:flex-row items-center gap-3 px-3 py-2 text-yellow-400 hover:text-white hover:bg-gray-800 rounded-lg transition text-sm"
                    >
                      <ShieldCheck size={16} />
                      Admin Dashboard
                    </Link>
                  )}
                </div>

                {/* Sign Out */}
                <div className="p-2 border-t border-gray-800">
                  <button
                    onClick={() => { setProfileOpen(false); signOut() }}
                    className="w-full flex flex-col lg:flex-row items-center gap-3 px-3 py-2 text-red-400 hover:text-white hover:bg-red-900/30 rounded-lg transition text-sm"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}