import type { Metadata } from "next"
import ContactForm from "./ContactForm"

export const metadata: Metadata = {
  title: "Contact - Emax Protocol Crypto Investment Platform",
  description:
    "Contact Emax Protocol for support on automated crypto trading, bitcoin investment, daily ROI plans, crypto portfolio management, and affiliate inquiries.",
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
    title: "Contact - Emax Protocol",
    description:
      "Reach Emax Protocol support for questions about cryptocurrency returns, trading plans, and passive income crypto strategies.",
    url: "https://emaxprotocol.pro/contact",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/contact",
  },
}

export default function ContactPage() {
  return <ContactForm />
}
