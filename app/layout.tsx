import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { organizationSchema } from "@/lib/schema"
import { ClientLayout } from "@/components/client-layout"

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
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}