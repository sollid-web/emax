import type { Metadata } from "next"
import GetStartedClient from "./GetStartedClient"

export const metadata: Metadata = {
  title: "Get Started - Emax Protocol Crypto Investment & Trading Plans",
  description:
    "Follow the step-by-step get started guide for Emax Protocol automated crypto trading, bitcoin investment, and daily ROI crypto portfolio growth.",
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
    title: "Get Started - Emax Protocol",
    description:
      "A complete path to start with Emax Protocol, from registration to funding and active daily ROI trading plans.",
    url: "https://emaxprotocol.pro/get-started",
  },
  alternates: {
    canonical: "https://emaxprotocol.pro/get-started",
  },
}

export default function GetStartedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get Started with Emax Protocol",
    description: "A step-by-step guide to getting started with Emax Protocol crypto trading platform",
    step: [
      {
        "@type": "HowToStep",
        name: "Create Your Account",
        text: "Sign up with your email address and create a password",
        image: "https://emaxprotocol.pro/images/step1.png",
      },
      {
        "@type": "HowToStep",
        name: "Fund Your Account",
        text: "Make your first bitcoin deposit of at least 0.001 BTC",
        image: "https://emaxprotocol.pro/images/step2.png",
      },
      {
        "@type": "HowToStep",
        name: "Choose Investment Plan",
        text: "Select a trading plan that matches your goals",
        image: "https://emaxprotocol.pro/images/step3.png",
      },
      {
        "@type": "HowToStep",
        name: "Start Earning",
        text: "Watch your daily returns and manage your portfolio",
        image: "https://emaxprotocol.pro/images/step4.png",
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GetStartedClient />
    </>
  )
}
