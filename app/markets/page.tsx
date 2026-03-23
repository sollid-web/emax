import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Markets - Real-Time Cryptocurrency Markets | Emax Protocol",
  description:
    "Markets page showing live cryptocurrency prices, market data, and trends for bitcoin investment and crypto portfolio tracking with Emax Protocol.",
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
    title: "Cryptocurrency Markets - Emax Protocol",
    description:
      "Monitor real-time cryptocurrency markets and support your bitcoin investment decisions with detailed analytics and trading plans.",
    url: "https://emaxprotocol.pro/markets",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/markets",
  },
}

export default function MarketsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Cryptocurrency Markets",
    description: "Real-time cryptocurrency market data, prices, and trading volumes for bitcoin investment and crypto portfolio tracking",
    mainEntity: {
      "@type": "Dataset",
      name: "Live Cryptocurrency Data",
      description: "Real-time cryptocurrency prices and market information",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cryptocurrency Markets</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Live Bitcoin Investment and Crypto Portfolio Data</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time cryptocurrency prices, market caps, and trading volumes powered by CoinGecko API, giving Emax Protocol users actionable insights into automated crypto trading and daily ROI opportunities.
          </p>
        </div>
      </section>
    </div>
    </>
  )
}
