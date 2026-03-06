'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block absolute left-0 top-0 h-screen w-64">
          <DashboardSidebar />
        </div>

        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50 transition-opacity duration-200"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 animate-in slide-in-from-left duration-200 overflow-y-auto">
              <DashboardSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <DashboardHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-auto p-3 md:p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
