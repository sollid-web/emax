'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, Play } from 'lucide-react'

export default function WebinarsPage() {
  const [selectedCategory, setSelectedCategory] = useState('upcoming')

  const webinars = [
    // Upcoming
    {
      id: 1,
      title: 'Algorithmic Trading Fundamentals: From Strategy to Execution',
      category: 'upcoming',
      date: 'January 25, 2024',
      time: '2:00 PM EST',
      duration: '90 minutes',
      speaker: 'Dr. Marcus Sullivan, CEO',
      description: 'Learn the fundamentals of algorithmic trading: how to develop strategies, backtest them, and deploy them live.',
      topics: [
        'Strategy development framework',
        'Backtesting best practices',
        'Live deployment procedures',
        'Performance monitoring'
      ],
      status: 'Register Now',
      attendees: 245
    },
    {
      id: 2,
      title: 'Risk Management in Volatile Markets: Protecting Your Capital',
      category: 'upcoming',
      date: 'January 30, 2024',
      time: '1:00 PM EST',
      duration: '75 minutes',
      speaker: 'Michael Torres, Head of Risk Management',
      description: 'Master position sizing, stop losses, and portfolio optimization techniques to survive and thrive in volatile cryptocurrency markets.',
      topics: [
        'Position sizing formulas',
        'Stop loss optimization',
        'Portfolio diversification',
        'Drawdown management'
      ],
      status: 'Register Now',
      attendees: 189
    },
    {
      id: 3,
      title: 'Machine Learning for Crypto Trading: Models That Work',
      category: 'upcoming',
      date: 'February 5, 2024',
      time: '3:00 PM EST',
      duration: '120 minutes',
      speaker: 'James Park, Head of Technology',
      description: 'Explore machine learning models for cryptocurrency prediction, including LSTMs, random forests, and ensemble methods.',
      topics: [
        'Feature engineering',
        'Model selection and training',
        'Avoiding overfitting',
        'Live model deployment'
      ],
      status: 'Register Now',
      attendees: 312
    },
    // Past
    {
      id: 4,
      title: 'Cryptocurrency Market Structure: Liquidity and Execution',
      category: 'past',
      date: 'January 18, 2024',
      time: '2:00 PM EST',
      duration: '90 minutes',
      speaker: 'Sarah Chen, Head of Quantitative Research',
      description: 'Understanding order book microstructure, liquidity dynamics, and execution optimization.',
      topics: [
        'Exchange order book analysis',
        'Spread dynamics',
        'Market impact',
        'Execution algorithms'
      ],
      status: 'Watch Recording',
      attendees: 267
    },
    {
      id: 5,
      title: 'Regulatory Compliance for Cryptocurrency Traders',
      category: 'past',
      date: 'January 10, 2024',
      time: '1:00 PM EST',
      duration: '75 minutes',
      speaker: 'Jennifer Morrison, Chief Compliance Officer',
      description: 'Navigate the evolving regulatory landscape for cryptocurrency trading and understand KYC/AML requirements.',
      topics: [
        'Current regulatory framework',
        'KYC and AML procedures',
        'Compliance best practices',
        'Tax reporting requirements'
      ],
      status: 'Watch Recording',
      attendees: 198
    },
    {
      id: 6,
      title: 'Security First: Protecting Your Digital Assets',
      category: 'past',
      date: 'January 3, 2024',
      time: '3:00 PM EST',
      duration: '80 minutes',
      speaker: 'Elena Rodriguez, Chief Security Officer',
      description: 'Enterprise-grade security practices, audits, and insurance coverage for cryptocurrency holdings.',
      topics: [
        'Cold storage best practices',
        'Smart contract auditing',
        'API security',
        'Custody and insurance'
      ],
      status: 'Watch Recording',
      attendees: 289
    }
  ]

  const upcomingWebinars = webinars.filter(w => w.category === 'upcoming')
  const pastWebinars = webinars.filter(w => w.category === 'past')
  const displayedWebinars = selectedCategory === 'upcoming' ? upcomingWebinars : pastWebinars

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Educational Webinar Series</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Live sessions with industry experts covering algorithmic trading, risk management, security, and regulatory compliance.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('upcoming')}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Upcoming Webinars ({upcomingWebinars.length})
          </button>
          <button
            onClick={() => setSelectedCategory('past')}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              selectedCategory === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Past Sessions ({pastWebinars.length})
          </button>
        </div>

        {/* Webinars Grid */}
        <div className="grid gap-6 mb-16">
          {displayedWebinars.map((webinar) => (
            <div key={webinar.id} className="bg-white border rounded-lg p-8 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{webinar.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{webinar.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {webinar.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {webinar.time} ({webinar.duration})
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {webinar.attendees} registered
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-2">Key Topics:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {webinar.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-blue-600 mt-1">✓</span>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Speaker</p>
                  <p className="text-gray-900 font-semibold">{webinar.speaker}</p>
                </div>
                <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  selectedCategory === 'upcoming'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-white hover:bg-gray-900'
                }`}>
                  {selectedCategory === 'upcoming' ? 'Register' : <><Play className="w-4 h-4" /> Watch</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Series Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="font-bold text-gray-900 mb-2">Weekly Schedule</h3>
            <p className="text-gray-700 text-sm">
              New webinars every Tuesday and Thursday at 1:00 PM and 3:00 PM EST. Join live or watch recordings anytime.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="font-bold text-gray-900 mb-2">Expert Speakers</h3>
            <p className="text-gray-700 text-sm">
              Learn from our executive team with 50+ years of combined experience in algorithmic trading and cryptocurrency.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="font-bold text-gray-900 mb-2">Hands-On Learning</h3>
            <p className="text-gray-700 text-sm">
              Access code examples, backtesting templates, and strategy frameworks discussed in each webinar.
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Webinar Updates</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to receive calendar invitations, recording links, and exclusive resources for registered webinars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="px-4 py-3 rounded-lg text-gray-900 flex-1"
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
