import Link from "next/link"
import { Facebook, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-400">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/company" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Compliance
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Security & Audits
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-400">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/risk-disclosure" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Risk Disclosure
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-white transition-colors text-sm">
                  News
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col lg:flex-row-col justify-between">
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide text-gray-400">Connect</h3>
              <div className="flex flex-col lg:flex-row space-x-4 mb-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              © 2024 Emax Protocol. All rights reserved.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 mt-8">
          <p className="text-xs text-gray-500 text-center">
            Risk Disclaimer: Cryptocurrency trading involves substantial risk of loss. Past performance does not guarantee future results. Always do your own research and only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  )
}
