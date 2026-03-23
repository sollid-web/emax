"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle, TrendingUp, Shield, Zap } from 'lucide-react'

interface Plan {
  id: string
  name: string
  min_deposit: number
  max_deposit: number | null
  daily_roi: number
  profit_withdrawal_days: number
  capital_withdrawal_days: number
  description: string | null
}

const colors = [
  { bg: 'bg-blue-600', badge: 'bg-blue-700', text: 'text-blue-100' },
  { bg: 'bg-purple-600', badge: 'bg-yellow-400', text: 'text-yellow-900' },
  { bg: 'bg-green-600', badge: 'bg-green-700', text: 'text-green-100' },
  { bg: 'bg-orange-500', badge: 'bg-orange-700', text: 'text-orange-100' },
]

export default function TradingPlansClient() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Trading Plans",
    description: "Emax Protocol trading plans with daily ROI and crypto portfolio investment options",
    mainEntity: {
      "@type": "Product",
      name: "Trading Plans",
      description: "Professionally managed investment plans with guaranteed daily returns",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "100",
        highPrice: "unlimited",
      },
    },
  };

  useEffect(() => {
    fetch('/api/trading-plans')
      .then(r => r.json())
      .then(d => { if (d.plans) setPlans(d.plans) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 pt-24 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Trading Plans</h1>
          <h2 className="text-2xl font-semibold text-blue-100 mb-3">Emax Protocol Trading Plans for Daily ROI and Passive Income Crypto</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4">
            Choose from our professionally managed investment plans designed to maximize your cryptocurrency returns, support bitcoin investment, and grow your crypto portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-300">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-400" /> Secure & Regulated</span>
            <span className="flex items-center gap-2"><TrendingUp size={16} className="text-blue-400" /> Guaranteed Returns</span>
            <span className="flex items-center gap-2"><Zap size={16} className="text-yellow-400" /> Fast Withdrawals</span>
          </div>
        </div>

        {/* Plans */}
        <div className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="text-center text-gray-500 py-20">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {plans.map((plan, idx) => {
                const color = colors[idx % colors.length]
                const isPopular = idx === 1
                return (
                  <div key={plan.id} className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${isPopular ? 'ring-2 ring-purple-500' : ''}`}>
                    {isPopular && (
                      <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className={`${color.bg} p-5`}>
                      <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                      <p className="text-white/70 text-xs mt-1">{plan.description || 'Professional investment plan'}</p>
                      <div className="mt-3">
                        <span className="text-3xl font-bold text-white">{plan.daily_roi}%</span>
                        <span className="text-white/70 text-sm ml-1">Daily ROI</span>
                      </div>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Min Deposit:</span><span className="font-semibold text-gray-800">${plan.min_deposit.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Max Deposit:</span><span className="font-semibold text-gray-800">{plan.max_deposit ? `$${plan.max_deposit.toLocaleString()}` : 'Unlimited'}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Profit Withdrawal:</span><span className="font-semibold text-gray-800">{plan.profit_withdrawal_days} Days</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Capital Withdrawal:</span><span className="font-semibold text-gray-800">{plan.capital_withdrawal_days} Days</span></div>
                      <div className="pt-2 border-t border-gray-100">
                        <Link href="/signup" className={`block w-full text-center py-2.5 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90 ${color.bg}`}>
                          Get Started
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Why section */}
          <div className="max-w-4xl mx-auto mt-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">Why Choose Our Trading Plans?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <TrendingUp className="text-blue-600" size={28} />, bg: 'bg-blue-100', title: 'Guaranteed Returns', desc: 'Our advanced algorithms ensure consistent daily returns on your investment.' },
                { icon: <Shield className="text-green-600" size={28} />, bg: 'bg-green-100', title: 'Secure Platform', desc: 'Your investments are protected by bank-level security and insurance.' },
                { icon: <Zap className="text-purple-600" size={28} />, bg: 'bg-purple-100', title: 'Fast Withdrawals', desc: 'Quick and reliable withdrawal processing with minimal waiting times.' },
              ].map(item => (
                <div key={item.title} className="text-center">
                  <div className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}