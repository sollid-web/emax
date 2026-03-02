'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

export function AdminHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">Admin Control Panel</h2>
        <p className="text-sm text-gray-400">Emax Protocol Management System</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-white">{user?.full_name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
