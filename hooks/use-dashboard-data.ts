import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import {
  getUserPortfolio,
  getUserInvestments,
  getUserTransactions,
  getUserWithdrawals,
  getUserProfile,
} from '@/lib/db-operations'

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
            getUserPortfolio(user.id),
            getUserInvestments(user.id),
            getUserTransactions(user.id),
            getUserWithdrawals(user.id),
            getUserProfile(user.id),
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
