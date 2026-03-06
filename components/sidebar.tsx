"use client"

import Link from "next/link"
import { X } from "lucide-react"

interface SidebarProps {
  onClose: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
          <div className="relative h-8 w-24">
            <img src="/images/emax-logo.png" alt="Emax Protocol Logo" className="object-contain" />
          </div>
        </Link>
        <button onClick={onClose} className="p-2">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 p-4">
        <div className="space-y-4">
          <Link href="/about" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            About Us
          </Link>
          <Link href="/trading" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Trading
          </Link>
          <Link href="/trading-plans" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Trading Plans
          </Link>
          <Link href="/markets" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Markets
          </Link>
          <Link href="/affiliate" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Affiliate
          </Link>
          <Link href="/get-started" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Get Started
          </Link>
          <Link href="/faq" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            FAQ
          </Link>
          <Link href="/contact" className="block text-gray-700 hover:text-blue-600 transition-colors" onClick={onClose}>
            Contact
          </Link>
        </div>
      </nav>
    </div>
  )
}