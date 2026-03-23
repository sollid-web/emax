import type { Metadata } from "next"
import TradingPlansClient from "./TradingPlansClient"

export const metadata: Metadata = {
  title: "Trading Plans - Crypto Investment Platform | Emax Protocol",
  description:
    "Discover trading plans with daily ROI schedules, algorithmic strategy options, and bitcoin investment support on Emax Protocol, your top crypto investment platform.",
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
    title: "Trading Plans - Emax Protocol Crypto Portfolio Strategies",
    description:
      "Compare trading plans with daily ROI, passive income crypto opportunities, and professional management for bitcoin investment and cryptocurrency returns.",
    url: "https://emaxprotocol.pro/trading-plans",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/trading-plans",
  },
}

export default function TradingPlansPage() {
  return <TradingPlansClient />
}
