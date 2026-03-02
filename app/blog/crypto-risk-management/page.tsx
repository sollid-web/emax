'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

export default function RiskManagementPost() {
  return (
    <div className="pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/blog" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How Risk Management Works in Volatile Crypto Markets
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-6 border-b">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Michael Torres</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>January 10, 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>9 min read</span>
            </div>
          </div>
        </div>

        <article className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Risk Management Separates Winners from Losers</h2>
          <p className="text-gray-700 mb-4">
            A trader with a 50% win rate can be massively profitable if their winners are 2x larger than losers. Conversely, a 70% win rate trader can be bankrupt if their losers are 5x larger than winners. Risk management determines the outcome.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Core Principle: Position Sizing</h2>
          <p className="text-gray-700 mb-4">
            Professional traders don't ask "how much can I make?" They ask "how much can I safely lose?" Position size flows from that answer.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">The 1% Rule</h3>
          <p className="text-gray-700 mb-4">
            Never risk more than 1% of your account per trade. If you have $10,000:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Maximum risk per trade: $100 (1%)</li>
            <li>If your stop loss is 5% away, your position size is $2,000 (risking $100)</li>
            <li>If your stop loss is 2% away, your position size is $5,000 (risking $100)</li>
          </ul>

          <p className="text-gray-700 mb-4">
            This approach means even after 10 consecutive losses, you've only lost 10% of capital. You can recover.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Advanced: Kelly Criterion</h3>
          <p className="text-gray-700 mb-4">
            For traders with statistically proven edges, Kelly Criterion calculates optimal position size:
          </p>
          <p className="text-gray-700 mb-4">
            Position Size = (Win% × Avg Win) - (Loss% × Avg Loss) / Avg Win
          </p>
          <p className="text-gray-700 mb-4">
            Example: If your system wins 55% of trades, wins average +2% profit, losses average -1.5%:
          </p>
          <p className="text-gray-700 mb-4">
            Position Size = (0.55 × 0.02) - (0.45 × 0.015) / 0.02 = 27.5% of capital per trade
          </p>
          <p className="text-gray-700 mb-4">
            Most professionals use half-Kelly (13.75%) to reduce volatility.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Stop Loss: Your Insurance Policy</h2>
          <p className="text-gray-700 mb-4">
            A stop loss is where you exit if the trade goes wrong. It defines your maximum loss upfront.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Types of Stop Losses</h3>

          <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Hard Stop (Automatic Exit)</h4>
          <p className="text-gray-700 mb-4">
            You place a stop order with the exchange: "If Bitcoin drops to $39,000, sell my position automatically." This prevents emotional override and works while you sleep.
          </p>

          <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Technical Stop (Support Levels)</h4>
          <p className="text-gray-700 mb-4">
            Place stop just below a key support level. If Bitcoin is at $40,000 with support at $38,500, set stop at $38,400. If price breaks support, you're out.
          </p>

          <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Volatility-Based Stop (ATR Stop)</h4>
          <p className="text-gray-700 mb-4">
            Use Average True Range (ATR) to set stops based on recent volatility. High volatility = wider stop. Low volatility = tighter stop.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Open Positions</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Profit Taking</h3>
          <p className="text-gray-700 mb-4">
            Don't hold for maximum profit. Take partial profits at predetermined targets:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>At +25% gain: Sell 50% of position, lock in half the profit</li>
            <li>At +50% gain: Sell 25% more, move stop to breakeven</li>
            <li>Let final 25% run for bigger wins</li>
          </ul>
          <p className="text-gray-700 mb-4">
            This approach guarantees you profit from your best trades while protecting from reversal.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Trailing Stops</h3>
          <p className="text-gray-700 mb-4">
            As price moves in your favor, move your stop higher. If Bitcoin rises from $40,000 to $45,000:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Move stop from $38,400 up to $43,500</li>
            <li>You lock in $3,500 gain regardless of further movement</li>
            <li>If Bitcoin drops below $43,500, you're automatically exited with a nice profit</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Portfolio-Level Risk Management</h2>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Diversification</h3>
          <p className="text-gray-700 mb-4">
            Don't put 100% into one asset. If Bitcoin is 70% of portfolio and it crashes 50%, your total portfolio is down 35%.
          </p>
          <p className="text-gray-700 mb-4">
            Sample allocation:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>50% Bitcoin (mature, core holding)</li>
            <li>20% Ethereum (established alternative)</li>
            <li>15% DeFi tokens (higher growth, higher risk)</li>
            <li>15% Stablecoins (capital preservation)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Maximum Drawdown Limits</h3>
          <p className="text-gray-700 mb-4">
            Set a maximum acceptable drawdown. If portfolio drops 20% from its peak:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Reduce position sizes 50%</li>
            <li>Move stops tighter</li>
            <li>Take profits faster</li>
          </ul>
          <p className="text-gray-700 mb-4">
            If drawdown hits 30%, step back entirely. Wait for market stabilization before resuming.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Volatility Adjustment</h2>
          <p className="text-gray-700 mb-4">
            Crypto volatility changes. Sometimes Bitcoin moves $500/day, sometimes $2,000/day. Adjust risk accordingly:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>High volatility (VIX {'>'} 60):</strong> Reduce position sizes 50%, tighter stops</li>
            <li><strong>Normal volatility (VIX 30-60):</strong> Standard position sizing</li>
            <li><strong>Low volatility (VIX 30):</strong> Can slightly increase sizes</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Risk/Reward Ratio</h2>
          <p className="text-gray-700 mb-4">
            Every trade should have a favorable risk/reward ratio. If you risk $100:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li><strong>Minimum win target:</strong> $150 (1.5:1 ratio)</li>
            <li><strong>Preferred:</strong> $200+ (2:1 ratio)</li>
            <li><strong>Ideal:</strong> $300+ (3:1 ratio)</li>
          </ul>
          <p className="text-gray-700 mb-4">
            With 2:1 ratio, you need only 50% win rate to profit. This provides margin of safety.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">The Bottom Line</h2>
          <p className="text-gray-700 mb-4">
            Risk management isn't about predicting where markets go. It's about ensuring you survive long enough to profit from your correct predictions. Professional traders focus on capital preservation first, profits second.
          </p>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 my-8">
            <p className="text-green-900 font-semibold mb-2">Implement These Rules Today</p>
            <p className="text-green-800 mb-4">Create a risk management system using position sizing limits, stop orders, and portfolio allocation.</p>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Learn from Your Trades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/crypto-trading-mistakes" className="p-4 border rounded-lg hover:shadow-lg transition">
              <h4 className="font-semibold text-gray-900 mb-2">Common Trading Mistakes</h4>
              <p className="text-sm text-gray-600">Errors that destroy profitability</p>
            </Link>
            <Link href="/blog/is-automated-crypto-trading-profitable" className="p-4 border rounded-lg hover:shadow-lg transition">
              <h4 className="font-semibold text-gray-900 mb-2">Profitable Trading Systems</h4>
              <p className="text-sm text-gray-600">How systematic approaches reduce risk</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
