'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    category: 'Profitability',
    question: 'How much can I realistically make with algorithmic trading?',
    answer: 'Returns depend on market conditions and strategy quality. Conservative strategies generate 5-15% annually. Moderate strategies target 15-40% annually. Aggressive strategies can generate 40%+ but with significant drawdown risk. Remember: past performance does not guarantee future results. Many market participants experience losses, and cryptocurrency is inherently volatile.'
  },
  {
    category: 'Profitability',
    question: 'What\'s the minimum account size to get started?',
    answer: 'You can start with as little as $100-500 on our platform. However, account size affects profitability—smaller accounts have higher fee impact relative to gains. A $1,000+ account is more practical. We recommend starting small to learn before increasing capital deployment.'
  },
  {
    category: 'Risk',
    question: 'Can I lose my entire investment?',
    answer: 'Yes. Cryptocurrency is highly volatile and speculative. You should never invest more than you can afford to lose completely. Our risk management tools help reduce losses but don\'t eliminate the possibility of significant losses. Always review our risk disclosure thoroughly before trading.'
  },
  {
    category: 'Risk',
    question: 'What happens during market crashes or flash crashes?',
    answer: 'During crashes, algorithms may be triggered to sell if stop losses activate—protecting capital but locking in losses. In extreme events (flash crashes, exchange outages), positions may be liquidated involuntarily. Leverage amplifies losses during volatility. This is why we emphasize strict risk management.'
  },
  {
    category: 'Security',
    question: 'How are my funds protected and secured?',
    answer: 'Funds are held with institutional-grade custodians using cold storage (offline) and hot wallet redundancy for operational efficiency. We maintain comprehensive insurance coverage for digital asset custody. All transactions are cryptographically secured. API keys and seed phrases are never shared with our platform.'
  },
  {
    category: 'Security',
    question: 'What independent security audits have you completed?',
    answer: 'Our platform has been audited by CertiK and SlowMist, leading blockchain security firms. Audits cover smart contracts, cold storage implementation, API security, and operational procedures. Full audit reports are available in our Security & Compliance pages. We perform quarterly internal security reviews and vulnerability assessments.'
  },
  {
    category: 'Operations',
    question: 'What are your trading fees and how are they structured?',
    answer: 'Standard trading fees: 0.25% per transaction (buy/sell). Withdrawal fees vary by network (Bitcoin: $3-5, Ethereum: $2-3). Monthly management fee: 1% of AUM (Assets Under Management). Fees are deducted from profits, not from principal capital.'
  },
  {
    category: 'Operations',
    question: 'Can I withdraw funds anytime or are there lockup periods?',
    answer: 'Yes, withdrawals are processed within 24 hours. Network confirmation times vary: Bitcoin (10 mins to 1 hour), Ethereum (2-5 mins), Stablecoins (instant). Minimum withdrawal: $50. Maximum daily withdrawal: 50% of account balance (anti-manipulation measure).'
  },
  {
    category: 'Compliance',
    question: 'Do you require KYC (Know Your Customer) verification?',
    answer: 'Yes, for accounts above $500. Standard KYC includes identity verification, address confirmation, and source of funds documentation. This is required by regulators and protects both you and our platform from fraud and money laundering. Process typically completes within 24-48 hours.'
  },
  {
    category: 'Compliance',
    question: 'How do I handle taxes on my trading profits?',
    answer: 'You are responsible for tax reporting. We provide detailed transaction histories for tax preparation. Each trade is a taxable event in most jurisdictions. Long-term holdings (1+ year) often receive favorable tax treatment. Consult a tax professional regarding your specific situation and jurisdiction.'
  },
  {
    category: 'Trading',
    question: 'Which cryptocurrencies can I trade on your platform?',
    answer: 'We support: Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Ripple (XRP), Polkadot (DOT), Chainlink (LINK), and 15+ other major cryptocurrencies. Major assets have tighter spreads and better liquidity. Lesser-known assets may have wider spreads affecting profitability.'
  },
  {
    category: 'Trading',
    question: 'Can I use leverage for trading, and how much?',
    answer: 'Yes, up to 5x leverage available for verified users. Leverage amplifies both gains and losses. A 10% price move becomes a 50% portfolio change on 5x leverage. We recommend experienced traders only use leverage. Most beginners should avoid it entirely due to liquidation risk.'
  },
  {
    category: 'Support',
    question: 'What customer support options are available?',
    answer: 'We provide 24/7 email support and live chat. Average response time: under 2 hours. Weekly webinars cover trading strategies, risk management, and platform features. Extensive documentation and video tutorials available. Premium users receive priority support and dedicated account managers.'
  },
  {
    category: 'Support',
    question: 'What should I do if I suspect unauthorized access or fraud?',
    answer: 'Contact our compliance team immediately at compliance@emaxprotocol.com. We will freeze your account, investigate, and take corrective action within 24 hours. Enable two-factor authentication (2FA) on your account. Use unique, strong passwords. Never share API credentials or seed phrases with anyone.'
  },
  {
    category: 'Learning',
    question: 'Where can I learn about algorithmic trading strategies?',
    answer: 'Check our Blog for comprehensive guides: "What Is Algorithmic Crypto Trading", "Is Automated Trading Profitable", and "Risk Management Works in Volatile Markets". Watch our Webinar Series covering trading fundamentals, strategy development, and risk management. Our Team experts are available for consultations.'
  },
  {
    category: 'Learning',
    question: 'Do you offer trading strategy templates or pre-built algorithms?',
    answer: 'Yes, we provide several pre-built algorithmic templates for common strategies: momentum trading, mean reversion, and statistical arbitrage. These serve as starting points. We recommend customizing them to your risk tolerance and market conditions. All templates include backtesting modules and risk controls.'
  }
]

const categories = ['All', 'Profitability', 'Risk', 'Security', 'Operations', 'Compliance', 'Trading', 'Support', 'Learning']

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredFAQ = selectedCategory === 'All' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory)

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Get answers to common questions about algorithmic trading, fees, security, and compliance</p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col lg:flex-row-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredFAQ.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex flex-col lg:flex-row items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="text-left font-semibold text-gray-900">{item.question}</h3>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-50 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help 24/7.</p>
          <div className="flex flex-col sm:flex flex-col lg:flex-row-row gap-4 justify-center">
            <Link href="/compliance" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              View Compliance
            </Link>
            <Link href="/risk-disclosure" className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold">
              Risk Disclosure
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/blog" className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 mb-2">Blog Resources</h3>
              <p className="text-sm text-gray-600">In-depth guides on algorithmic trading and strategy development</p>
            </Link>
            <Link href="/security" className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 mb-2">Security & Audits</h3>
              <p className="text-sm text-gray-600">Third-party audit reports and security standards</p>
            </Link>
            <Link href="/how-it-works" className="p-6 border rounded-lg hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
              <p className="text-sm text-gray-600">Platform architecture and trading infrastructure</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
