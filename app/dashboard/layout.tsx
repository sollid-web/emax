import { ProtectedRoute } from '@/components/protected-route'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-950">
        <DashboardSidebar />
        <div className="flex flex-col flex-1 overflow-auto">
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
