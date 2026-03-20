"use client"

import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ChatWidget } from "@/components/chat-widget"
import { Sidebar } from "@/components/sidebar"
import { PublicLayoutWrapper } from "@/components/public-layout-wrapper"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  const handleHamburger = () => {
    setDrawerOpen(!drawerOpen)
  }

  // Close drawer when route changes
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <PublicLayoutWrapper
      header={<Header onHamburger={handleHamburger} />}
      footer={<Footer />}
    >
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-200"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-white shadow-lg animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* <CookieConsent /> */}
      <ChatWidget />
    </PublicLayoutWrapper>
  )
}