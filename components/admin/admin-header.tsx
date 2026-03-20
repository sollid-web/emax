'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut, Settings, Menu } from 'lucide-react'

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps = {}) {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-3 md:px-8 py-3 md:py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg md:text-xl font-bold text-white truncate">Admin Control Panel</h2>
        <p className="text-xs md:text-sm text-gray-400 truncate">Emax Protocol Management System</p>
      </div>

      <div className="flex items-center gap-1 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 md:p-2 text-gray-400 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="w-5 md:w-6 h-5 md:h-6" />
        </button>
        <div className="text-right hidden sm:block">
          <p className="text-xs md:text-sm font-medium text-white truncate">{user?.full_name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
        </div>

        <div className="flex gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1.5 md:p-2 h-auto"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white p-1.5 md:p-2 h-auto"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
