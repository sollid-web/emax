import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { ChatWidget } from "@/components/chat-widget"
import { organizationSchema } from "@/lib/schema"
import { PublicLayoutWrapper } from "@/components/public-layout-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Automated Crypto Trading Platform | Emax Protocol",
  description:
    "Explore a structured automated crypto trading platform designed for algorithmic execution, risk management, and digital asset strategy deployment.",
  openGraph: {
    title: "Automated Crypto Trading Platform | Emax Protocol",
    description:
      "Harness algorithmic trading technology designed to navigate cryptocurrency markets with structured execution and data-driven strategy deployment.",
    type: "website",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {/*
            PublicLayoutWrapper checks the current path.
            It shows Header/Footer only on public pages.
            Dashboard and admin pages have their own layouts.
          */}
          <PublicLayoutWrapper
            header={<Header />}
            footer={<Footer />}
          >
            {children}
          </PublicLayoutWrapper>
          <CookieConsent />
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  )
}