'use client'

import Link from 'next/link'
import { Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react'

export default function MarketReportsPage() {
  const reports = [
    {
      title: 'Q1 2024 Cryptocurrency Market Report',
      date: 'January 15, 2024',
      description: 'Comprehensive analysis of Bitcoin, Ethereum, and altcoin market dynamics, trading volume trends, and volatility patterns.',
      highlights: [
        'Bitcoin dominance trends and network activity',
        'Ethereum layer 2 adoption analysis',
        'Altcoin correlation matrix and risk assessment',
        'Trading volume concentration on major exchanges'
      ],
      size: '2.4 MB',
      status: 'Available'
    },
    {
      title: 'Algorithmic Trading Performance Review Q4 2023',
      date: 'December 28, 2023',
      description: 'Backtested performance analysis of popular algorithmic strategies across different market regimes.',
      highlights: [
        'Mean reversion strategy performance',
        'Momentum trading backtests',
        'Statistical arbitrage results',
        'Risk-adjusted returns (Sharpe ratio analysis)'
      ],
      size: '1.8 MB',
      status: 'Available'
    },
    {
      title: 'Volatility & Risk Management Study 2023',
      date: 'November 30, 2023',
      description: 'In-depth analysis of cryptocurrency market volatility patterns and effective risk management techniques.',
      highlights: [
        'Historical volatility (ATR) analysis by asset',
        'Drawdown statistics and recovery patterns',
        'VIX equivalent metrics for crypto markets',
        'Stop loss optimization research'
      ],
      size: '2.1 MB',
      status: 'Available'
    },
    {
      title: 'Cryptocurrency Market Structure Analysis',
      date: 'October 15, 2023',
      description: 'Deep dive into exchange order book structures, liquidity dynamics, and market microstructure.',
      highlights: [
        'Spread analysis across major exchanges',
        'Liquidity depth comparison (Coinbase vs Kraken vs Binance)',
        'Market impact analysis',
        'Order execution optimization'
      ],
      size: '2.2 MB',
      status: 'Available'
    },
    {
      title: 'Blockchain Network Analysis & Security Report',
      date: 'September 20, 2023',
      description: 'Technical analysis of major blockchain networks, transaction patterns, and security metrics.',
      highlights: [
        'Bitcoin transaction analysis and fee trends',
        'Ethereum gas optimization',
        'Network security metrics',
        'Smart contract auditing standards'
      ],
      size: '1.9 MB',
      status: 'Available'
    },
    {
      title: 'Machine Learning in Crypto Trading: Benchmarks',
      date: 'August 10, 2023',
      description: 'Comparative analysis of machine learning models for cryptocurrency price prediction and trading.',
      highlights: [
        'LSTM vs traditional time series models',
        'Feature engineering for crypto prediction',
        'Model performance metrics and limitations',
        'Overfitting prevention techniques'
      ],
      size: '2.5 MB',
      status: 'Available'
    }
  ]

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Market Research Reports</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quarterly analysis and research on cryptocurrency markets, algorithmic trading strategies, and blockchain infrastructure.
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6 mb-16">
          {reports.map((report, index) => (
            <div key={index} className="bg-white border rounded-lg p-8 hover:shadow-lg transition">
              <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{report.title}</h3>
                  <div className="flex flex-col lg:flex-row items-center gap-4 text-sm text-gray-600">
                    <div className="flex flex-col lg:flex-row items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </div>
                    <span>{report.size}</span>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {report.status}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{report.description}</p>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">Key Sections:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {report.highlights.map((highlight, i) => (
                    <li key={i} className="flex flex-col lg:flex-row items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 mt-1">•</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              <a href="#download" className="inline-flex flex-col lg:flex-row items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          ))}
        </div>

        {/* About Reports Section */}
        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Research Methodology</h3>
              <p className="text-gray-700 text-sm">
                Our reports combine quantitative analysis of on-chain data, exchange data, and historical market patterns with qualitative research from industry experts. All findings are peer-reviewed and independently verified.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Data Sources</h3>
              <p className="text-gray-700 text-sm">
                We utilize data from major cryptocurrency exchanges (Coinbase, Kraken, Binance), blockchain explorers (Etherscan, Blockchain.com), and proprietary datasets to ensure accuracy and completeness.
              </p>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Reports Delivered to Your Inbox</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to receive new research reports, market analysis, and trading insights directly to your email.
          </p>
          <div className="flex flex-col sm:flex flex-col lg:flex-row-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg text-gray-900 flex flex-col lg:flex-row-1"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold">
              Subscribe
            </button>
          </div>
          <p className="text-blue-100 text-xs mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  )
}
