import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, BarChart3, Shield, Zap, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Automated Crypto Trading Works | Emax Protocol',
  description:
    'Learn how our algorithmic crypto trading systems work. Understand our market analysis engine, strategy deployment, risk management, and execution framework.',
  openGraph: {
    title: 'How Automated Crypto Trading Works',
    description: 'Explore our structured crypto trading process and technological infrastructure.',
  },
}

export default function HowItWorksPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">How Automated Crypto Trading Works</h1>
            <p className="text-xl text-gray-600 mb-8">
              Understanding our structured algorithmic trading infrastructure and systematic approach to digital asset markets.
            </p>
          </div>
        </div>
      </section>

      {/* What is Automated Crypto Trading */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">What Is Automated Crypto Trading?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Automated crypto trading uses algorithmic systems to analyze market conditions, identify trading opportunities, and execute transactions based on predefined strategies. Unlike manual trading, automation reduces emotional decision-making and allows continuous market monitoring across multiple digital asset pairs.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Our infrastructure is built to support:
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <span className="text-gray-600">Algorithmic execution strategies</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <span className="text-gray-600">Portfolio diversification logic</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <span className="text-gray-600">Market data integration</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <span className="text-gray-600">Structured risk management protocols</span>
            </li>
          </ul>
        </div>
      </section>

      {/* How Our Trading Infrastructure Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Trading Infrastructure</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Market Analysis Engine */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
                  <CardTitle>Market Analysis Engine</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time data aggregation across supported cryptocurrency markets. Our systems continuously monitor price movements, volume patterns, and market indicators.
                </p>
              </CardContent>
            </Card>

            {/* Strategy Deployment Layer */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Zap className="w-6 h-6 text-green-600 mr-3" />
                  <CardTitle>Strategy Deployment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Algorithmic models designed to identify trading inefficiencies and price movements. Systematic approach to digital asset engagement based on data-driven parameters.
                </p>
              </CardContent>
            </Card>

            {/* Risk Control Framework */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Shield className="w-6 h-6 text-purple-600 mr-3" />
                  <CardTitle>Risk Control Framework</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Position sizing logic and exposure balancing mechanisms help maintain portfolio structure. Disciplined approach to managing market volatility exposure.
                </p>
              </CardContent>
            </Card>

            {/* Execution & Monitoring */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-6 h-6 text-indigo-600 mr-3" />
                  <CardTitle>Execution & Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated trade execution with ongoing performance tracking. Continuous system monitoring and operational transparency for all trades.
                </p>
              </CardContent>
            </Card>
          </div>

          <p className="text-lg text-gray-600 mt-12 text-center">
            This layered approach supports systematic engagement with digital asset markets through structured technological infrastructure.
          </p>
        </div>
      </section>

      {/* Why Structured Automation Matters */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Structured Automation Matters</h2>
          <p className="text-lg text-gray-600 mb-8">
            Algorithmic systems offer distinct advantages in digital asset market participation:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">24/7 Market Monitoring</h3>
                <p className="text-gray-600">Continuous market surveillance without human constraints or emotional influence.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data-Driven Execution</h3>
                <p className="text-gray-600">Decisions based on quantifiable market metrics and historical patterns.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reduced Emotional Bias</h3>
                <p className="text-gray-600">Systematic execution removes psychological barriers to disciplined trading.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-blue-600 font-bold text-xl">✓</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Diversified Allocation</h3>
                <p className="text-gray-600">Strategic distribution across multiple asset pairs and timeframes.</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 border-l-4 border-blue-600 pl-6 py-4 bg-blue-50">
            Important: Automation supports consistency, but market conditions remain dynamic and unpredictable. Past performance does not guarantee future results.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore Algorithmic Trading?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover how structured automation can integrate into your digital asset strategy.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
