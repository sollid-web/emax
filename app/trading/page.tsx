import type { Metadata } from "next"
import TradingClient from "./TradingClient"

export const metadata: Metadata = {
  title: "Trading - Automated Crypto Trading & Daily ROI | Emax Protocol",
  description:
    "Explore Emax Protocol trading features: automated crypto trading, bitcoin investment returns, and daily ROI crypto portfolio tools for passive income crypto.",
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
    title: "Trading - Emax Protocol Automated Crypto Trading",
    description:
      "Build your crypto portfolio with Emax Protocol's automated trading, daily ROI and bitcoin investment features for consistent cryptocurrency returns.",
    url: "https://emaxprotocol.pro/trading",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/trading",
  },
}

export default function TradingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hybrid Automated Cryptocurrency Trading",
    description: "Advanced automated crypto trading platform with daily ROI and algorithmic portfolio management",
    provider: {
      "@type": "Organization",
      name: "Emax Protocol",
      url: "https://emaxprotocol.pro",
    },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      name: "Trading Plans",
      description: "2.5% daily ROI for 7 days on bitcoin investment",
      price: "100",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TradingClient />
    </>
  )
}
