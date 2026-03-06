'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

interface FinancialMetrics {
  totalDeposits: number
  totalWithdrawals: number
  totalTradeVolume: number
  platformFees: number
  avgDailyReturn: number
  activeCapital: number
  reserveCapital: number
}

export default function FinancialsPage() {
  const [metrics] = useState<FinancialMetrics>({
    totalDeposits: 5234500,
    totalWithdrawals: 3890200,
    totalTradeVolume: 24567890,
    platformFees: 245678,
    avgDailyReturn: 8.5,
    activeCapital: 1344300,
    reserveCapital: 500000,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex flex-col lg:flex-row items-center gap-3">
          <DollarSign className="w-8 h-8" />
          Financial Operations
        </h1>
        <p className="text-gray-400 mt-2">Monitor platform financials, capital, and revenue metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-col lg:flex-row-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Deposits</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(metrics.totalDeposits / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-gray-400">All time deposits</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-col lg:flex-row-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Withdrawals</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(metrics.totalWithdrawals / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-gray-400">All time withdrawals</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-col lg:flex-row-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Trade Volume</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(metrics.totalTradeVolume / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-gray-400">Total traded value</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-col lg:flex-row-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Platform Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${(metrics.platformFees / 1000).toFixed(2)}K</div>
            <p className="text-xs text-gray-400">Revenue collected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Capital Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Active Capital</span>
                <span className="text-lg font-bold text-green-400">${(metrics.activeCapital / 1000000).toFixed(2)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Reserve Capital</span>
                <span className="text-lg font-bold text-blue-400">${(metrics.reserveCapital / 1000000).toFixed(2)}M</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-center">
                <span className="text-sm text-gray-300">Total Capital Available</span>
                <span className="text-2xl font-bold text-white">
                  ${((metrics.activeCapital + metrics.reserveCapital) / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Average Daily Return</span>
                <span className="text-lg font-bold text-green-400">{metrics.avgDailyReturn}%</span>
              </div>
              <p className="text-xs text-gray-500">Platform-wide average</p>
            </div>

            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Active Users</span>
                <span className="text-lg font-bold text-blue-400">2,547</span>
              </div>
              <p className="text-xs text-gray-500">Users with active positions</p>
            </div>

            <div>
              <div className="flex flex-col lg:flex-row justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Monthly Recurring Revenue</span>
                <span className="text-lg font-bold text-purple-400">$45,230</span>
              </div>
              <p className="text-xs text-gray-500">Subscription and fee-based revenue</p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex flex-col lg:flex-row justify-between items-center">
                <span className="text-sm text-gray-300">Platform Health</span>
                <span className="text-sm font-bold px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                  Excellent
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
