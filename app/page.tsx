import type { Metadata } from "next"
import { Features } from "@/components/features"
import { About } from "@/components/about"
import { Security } from "@/components/security"
import { LiveCryptoMarket } from "@/components/live-crypto-market"
import { Hero } from "@/components/hero"
import TradingPlansPreview from "@/components/trading-plans-preview"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Emax Protocol: Leading Crypto Investment Platform | Daily ROI & Automated Trading",
  description:
    "Emax Protocol is a top crypto investment platform offering automated crypto trading, weekly daily ROI plans, and secure bitcoin investment strategies for passive income crypto growth.",
  keywords: [
    "crypto investment platform",
    "automated crypto trading",
    "daily ROI",
    "bitcoin investment",
    "cryptocurrency returns",
    "passive income crypto",
    "emax protocol",
    "trading plans",
    "crypto portfolio",
  ],
  openGraph: {
    title: "Emax Protocol | Crypto Investment Platform & Automated Crypto Trading",
    description:
      "Join Emax Protocol for advanced crypto portfolio management, algorithmic trading plans and daily ROI performance on bitcoin investment and cryptocurrency returns.",
    url: "https://emaxprotocol.pro/",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/",
  },
}

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Emax Protocol",
    url: "https://emaxprotocol.pro",
    logo: "https://emaxprotocol.pro/logo.png",
    description: "Leading crypto investment platform offering automated crypto trading and daily ROI trading plans",
    sameAs: [
      "https://twitter.com/emaxprotocol",
      "https://facebook.com/emaxprotocol",
      "https://linkedin.com/company/emaxprotocol",
    ],
    offers: {
      "@type": "Offer",
      name: "Automated Crypto Trading Plans",
      description: "Daily ROI trading plans for bitcoin investment and cryptocurrency portfolio growth",
      priceCurrency: "USD",
      price: "100",
      availability: "https://schema.org/InStock",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      telephone: "+1-122-3333-4444",
      email: "info@emaxprotocol.com",
      areaServed: "Worldwide",
      availableLanguage: "en",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-16">
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url(/images/building-walls-hero.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-purple-700/80" />

        {/* Floating Trading Dashboard Illustration */}
        <div className="absolute top-10 right-10 w-44 opacity-60">
          <div className="bg-gray-900/80 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-xs font-semibold">BTC/USD</span>
              <span className="text-green-400 text-xs">+2.4%</span>
            </div>
            <div className="flex items-end gap-0.5 h-10">
              {[40,55,35,60,45,70,50,65,45,80,60,75].map((h,i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-purple-400 rounded-sm" style={{height: h+"%"}} />
              ))}
            </div>
            <div className="mt-2 text-white/60 text-xs">3,250.00</div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <Hero />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">A True Crypto Investment Platform for Passive Income Crypto</h2>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Automated Crypto Trading & Daily ROI Strategies</h3>
          <p className="text-gray-600">
            Emax Protocol helps you build a crypto portfolio with bitcoin investment and diversified trading plans. Our platform focuses on cryptocurrency returns, cash flow stability, and a robust risk management system.
          </p>
        </div>
      </section>

      <Features />
      <TradingPlansPreview />
      <About />
      <Security />
      </div>
    </>
  )
}
