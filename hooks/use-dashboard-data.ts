import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { apiFetch } from '@/lib/api'

async function fetchJson(path: string) {
  const res = await apiFetch(path)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function useDashboardData() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState(null)
  const [investments, setInvestments] = useState([])
  const [transactions, setTransactions] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchData() {
      try {
        setLoading(true)
        const [portfolioData, investmentsData, transactionsData, withdrawalsData, profileData] =
          await Promise.all([
            fetchJson('/api/dashboard/portfolio').then(d => d.portfolio),
            fetchJson('/api/investments/history').then(d => d.investments),
            fetchJson(`/api/admin/transactions?user_id=${user.id}`).then(d => d.transactions),
            fetchJson('/api/withdrawals/history').then(d => d.withdrawals),
            fetchJson('/api/user/profile').then(d => d.profile),
          ])

        setPortfolio(portfolioData)
        setInvestments(investmentsData)
        setTransactions(transactionsData)
        setWithdrawals(withdrawalsData)
        setProfile(profileData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  return { portfolio, investments, transactions, withdrawals, profile, loading, error }
}
