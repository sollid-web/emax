'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, TrendingUp, Clock, Shield, Zap, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Consensus',
    subtitle: 'Perfect for Beginners',
    minDeposit: '$250.00',
    maxDeposit: '$999.00',
    dailyROI: '1.5%',
    profitWithdrawal: '24 Hours',
    capitalWithdrawal: '3 Days',
    color: 'from-blue-500 to-blue-600',
    features: ['24/7 Customer Support', 'Real-time Portfolio Tracking', 'Basic Trading Signals', 'Mobile App Access'],
    popular: false,
  },
  {
    name: 'Polkadot',
    subtitle: 'Most Popular Choice',
    minDeposit: '$2,000.00',
    maxDeposit: '$4,999.00',
    dailyROI: '2%',
    profitWithdrawal: '24 Hours',
    capitalWithdrawal: '5 Days',
    color: 'from-purple-500 to-purple-600',
    features: ['Priority Customer Support', 'Advanced Trading Signals', 'Risk Management Tools', 'Weekly Market Analysis'],
    popular: true,
  },
  {
    name: 'Ethereum Protocol',
    subtitle: 'For Serious Investors',
    minDeposit: '$6,000.00',
    maxDeposit: '$10,000.00',
    dailyROI: '3%',
    profitWithdrawal: '3 Days',
    capitalWithdrawal: '9 Days',
    color: 'from-green-500 to-green-600',
    features: ['Dedicated Account Manager', 'Premium Trading Algorithms', 'Custom Risk Profiles', 'Daily Market Reports'],
    popular: false,
  },
  {
    name: 'Hyperledger Fabric',
    subtitle: 'VIP Investment Tier',
    minDeposit: '$20,000.00',
    maxDeposit: 'Unlimited',
    dailyROI: '4%',
    profitWithdrawal: '4 Days',
    capitalWithdrawal: '12 Days',
    color: 'from-orange-500 to-orange-600',
    features: ['VIP Customer Service', 'Institutional-Grade Tools', 'Personalized Strategies', 'Direct Trader Access'],
    popular: false,
  },
]

export default function DashboardPlansPage() {
  const router = useRouter()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Investment Plans</h2>
        <p className="text-gray-400">Choose a trading plan that matches your investment goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`bg-gray-900 border-gray-800 relative overflow-hidden transition-all hover:border-gray-700 ${
              plan.popular ? 'ring-2 ring-purple-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                Most Popular
              </div>
            )}

            <CardHeader className={plan.popular ? 'pt-12' : ''}>
              <div className="flex flex-col lg:flex-row items-start justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl text-white mb-1">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.subtitle}</CardDescription>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <span className="text-gray-400">Daily ROI:</span>
                  <span className="text-lg font-bold text-green-400">{plan.dailyROI}</span>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <span className="text-gray-400">Min Deposit:</span>
                  <span className="text-white font-semibold">{plan.minDeposit}</span>
                </div>
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <span className="text-gray-400">Max Deposit:</span>
                  <span className="text-white font-semibold">{plan.maxDeposit}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2 p-3 bg-gray-800 rounded">
                <p className="text-sm text-gray-400 font-semibold">Withdrawal Timeline</p>
                <div className="flex flex-col lg:flex-row items-center gap-2 text-sm">
                  <Clock size={16} className="text-blue-400" />
                  <span className="text-gray-300">Profit: {plan.profitWithdrawal}</span>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-2 text-sm">
                  <Clock size={16} className="text-blue-400" />
                  <span className="text-gray-300">Capital: {plan.capitalWithdrawal}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-400 font-semibold">Plan Features</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex flex-col lg:flex-row items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5 flex flex-col lg:flex-row-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => router.push('/dashboard/deposit')}
                className={`w-full h-10 text-base font-semibold gap-2 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                Invest Now
                <ArrowRight size={18} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Comparison Info */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex flex-col lg:flex-row items-center gap-2">
            <Shield size={20} />
            Why Choose Emax Protocol?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <TrendingUp size={20} className="text-green-400 flex flex-col lg:flex-row-shrink-0" />
              <div>
                <p className="font-semibold text-white">Consistent Returns</p>
                <p className="text-sm text-gray-400">Daily profits with transparent reporting</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <Zap size={20} className="text-yellow-400 flex flex-col lg:flex-row-shrink-0" />
              <div>
                <p className="font-semibold text-white">Fast Withdrawals</p>
                <p className="text-sm text-gray-400">Get your profits within 24 hours</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-3">
              <Shield size={20} className="text-blue-400 flex flex-col lg:flex-row-shrink-0" />
              <div>
                <p className="font-semibold text-white">Secure Platform</p>
                <p className="text-sm text-gray-400">Your funds are protected with advanced security</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
