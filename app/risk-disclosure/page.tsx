import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, TrendingDown, DollarSign, Lock, RefreshCw } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Risk Disclosure & Investment Warnings | Emax Protocol',
  description:
    'Comprehensive risk disclosure for cryptocurrency trading. Understand volatility risks, market exposure, compliance standards, and trading risks before investing.',
  openGraph: {
    title: 'Risk Disclosure & Investment Warnings',
    description: 'Full transparency about cryptocurrency investment risks and market considerations.',
  },
}

export default function RiskDisclosurePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Risk Disclosure & Investment Warnings</h1>
            <p className="text-xl text-gray-600">
              Comprehensive transparency about cryptocurrency investment risks and market conditions
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Critical Warnings */}
      <section className="py-20 bg-red-50 border-b border-red-200">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-red-100 border-2 border-red-600 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              Critical Risk Warnings
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-red-600 font-bold text-xl">⚠</span>
                <span className="text-red-900">
                  <strong>You may lose your entire investment.</strong> Cryptocurrency trading is highly volatile and speculative. There is no guarantee of profitability.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold text-xl">⚠</span>
                <span className="text-red-900">
                  <strong>Past performance does not guarantee future results.</strong> Historical returns are not indicative of future market conditions or algorithmic system performance.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold text-xl">⚠</span>
                <span className="text-red-900">
                  <strong>Not suitable for all investors.</strong> Cryptocurrency trading carries substantial risk and may not be appropriate for conservative or risk-averse investors.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-red-600 font-bold text-xl">⚠</span>
                <span className="text-red-900">
                  <strong>Only invest what you can afford to lose.</strong> Never invest funds needed for essential expenses or retirement savings.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Risk Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Understanding Cryptocurrency Risks</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Market Volatility Risk */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <TrendingDown className="w-6 h-6 text-orange-600 mr-3" />
                  <CardTitle>Market Volatility</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cryptocurrency markets experience extreme price fluctuations. Asset values can change dramatically within hours or minutes, resulting in significant losses.
                </p>
                <p className="text-sm text-gray-500">Volatility risk increases during market stress and regulatory uncertainty.</p>
              </CardContent>
            </Card>

            {/* Regulatory Risk */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <Lock className="w-6 h-6 text-blue-600 mr-3" />
                  <CardTitle>Regulatory Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cryptocurrency regulations are evolving globally. Changes in regulatory frameworks can impact market prices and trading operations.
                </p>
                <p className="text-sm text-gray-500">Regulatory restrictions may limit market access or impose operational constraints.</p>
              </CardContent>
            </Card>

            {/* Liquidity Risk */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <RefreshCw className="w-6 h-6 text-purple-600 mr-3" />
                  <CardTitle>Liquidity Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Not all cryptocurrency pairs maintain consistent trading volume. Low liquidity markets may prevent timely entry or exit from positions.
                </p>
                <p className="text-sm text-gray-500">Slippage and widened spreads occur during low-liquidity market conditions.</p>
              </CardContent>
            </Card>

            {/* Technical Risk */}
            <Card>
              <CardHeader>
                <div className="flex items-center mb-2">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <CardTitle>Technology Risk</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Trading systems depend on technology infrastructure. Outages, connectivity issues, or system failures can interrupt trading operations.
                </p>
                <p className="text-sm text-gray-500">Blockchain network congestion may delay transaction processing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Risk Factors */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Additional Risk Considerations</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Counterparty Risk</h3>
              <p className="text-gray-600">
                Cryptocurrency exchanges and custodians pose counterparty risk. If an exchange becomes insolvent or is compromised, user funds may be at risk.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cybersecurity Risk</h3>
              <p className="text-gray-600">
                Digital asset systems are subject to cyberattacks. While we implement security measures, no system is completely immune to sophisticated attacks.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Algorithmic Risk</h3>
              <p className="text-gray-600">
                Trading algorithms may underperform during unprecedented market conditions. No algorithm can adapt perfectly to all market scenarios.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Concentration Risk</h3>
              <p className="text-gray-600">
                Cryptocurrency markets are heavily influenced by major institutional players and whale activity. Concentrated positions can create sudden price movements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Operational Risk</h3>
              <p className="text-gray-600">
                Trading errors, execution mistakes, or human oversight can result in losses. Automated systems may execute trades contrary to user intent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Commitment to Transparency</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Management Protocols</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We implement position sizing, exposure limits, and stop-loss mechanisms to manage systematic risk exposure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Clear disclosure of fees, performance metrics, and algorithmic trading parameters for informed decision-making.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Educational Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive guides on algorithmic trading, risk management, and cryptocurrency market dynamics.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Third-Party Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Regular security and operational audits by independent firms verify system integrity and controls.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <p className="text-gray-700">
              <strong>No trading system can eliminate market risk.</strong> Responsible participation in cryptocurrency markets requires awareness of risks, strategic planning, and acceptance of potential losses. If you do not fully understand these risks, do not invest.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-6">
            By creating an account, you acknowledge that you have read and understood this risk disclosure.
          </p>
          <a href="/compliance" className="text-blue-600 hover:text-blue-700 font-semibold">
            View Full Compliance Documentation →
          </a>
        </div>
      </section>
    </div>
  )
}
