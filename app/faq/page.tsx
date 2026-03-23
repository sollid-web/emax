import type { Metadata } from 'next'
import FAQClient from './FAQClient'

export const metadata: Metadata = {
  title: "FAQ - Emax Protocol Crypto Trading & Investment",
  description:
    "Frequently asked questions about Emax Protocol crypto investment platform, automated crypto trading, daily ROI, bitcoin investment, and trading plans.",
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
    title: "FAQ - Emax Protocol",
    description:
      "Find answers on cryptocurrency returns, risk management, trading plans, and how to earn passive income crypto with Emax Protocol.",
    url: "https://emaxprotocol.pro/faq",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/faq",
  },
}

export default function FAQPage() {
  return <FAQClient />
}
