'use client'

import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
}

// Routes where public Header and Footer should NOT appear
const PRIVATE_PREFIXES = ['/dashboard', '/admin']

export function PublicLayoutWrapper({ children, header, footer }: Props) {
  const pathname = usePathname()
  const isPrivate = PRIVATE_PREFIXES.some(prefix => pathname.startsWith(prefix))

  if (isPrivate) {
    // Dashboard and admin have their own headers/footers
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  )
}