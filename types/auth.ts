// User & Authentication
export interface User {
  id: string
  email: string
  full_name: string
  username: string
  phone?: string
  profile_picture_url?: string
  balance: number
  total_invested: number
  total_earnings: number
  kyc_status: 'not_started' | 'pending' | 'approved' | 'rejected'
  is_admin: boolean
  account_status: 'active' | 'suspended' | 'banned'
  two_fa_enabled: boolean
  created_at: string
  updated_at: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullname: string, username: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

export interface AuthResponse {
  user: User
  session?: {
    access_token: string
    refresh_token: string
  }
}

// KYC
export interface KYCSubmission {
  id: string
  userId: string
  firstName: string
  lastName: string
  country: string
  idType: 'passport' | 'driver_license' | 'national_id'
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  rejectionReason?: string
}

// Trading Plans
export interface TradingPlan {
  id: string
  name: string
  description: string
  minDeposit: number
  maxDeposit: number
  dailyROI: number
  totalROI: number
  duration: number
  durationUnit: 'days' | 'weeks' | 'months'
  features: string[]
  riskLevel: 'low' | 'medium' | 'high'
  created_at: string
}

// Deposits
export interface Deposit {
  id: string
  userId: string
  amount: number
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  walletAddressUsed: string
  transactionHash?: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  rejectionReason?: string
  notes?: string
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

// Withdrawals
export interface Withdrawal {
  id: string
  userId: string
  amount: number
  withdrawalType: 'profit' | 'capital'
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  walletAddress: string
  transactionHash?: string
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  rejectionReason?: string
  notes?: string
  createdAt: string
  approvedAt?: string
  completedAt?: string
}

// Investments
export interface Investment {
  id: string
  userId: string
  planId: string
  amount: number
  dailyROI: number
  totalROI: number
  status: 'pending_approval' | 'active' | 'completed' | 'cancelled'
  startDate?: string
  endDate?: string
  createdAt: string
  approvedAt?: string
}

// Daily Earnings
export interface DailyEarning {
  id: string
  userId: string
  investmentId: string
  amount: number
  earnedDate: string
  createdAt: string
}

// Transactions
export interface Transaction {
  id: string
  userId: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'earning'
  amount: number
  currency?: string
  referenceId?: string
  referenceType?: string
  status: 'pending' | 'completed' | 'failed'
  description?: string
  createdAt: string
}

// Crypto Wallets
export interface CryptoWallet {
  id: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  walletAddress: string
  network: string
  isActive: boolean
  createdAt: string
}

export interface UserCryptoWallet {
  id: string
  userId: string
  currency: 'BTC' | 'ETH' | 'USDT' | 'USDC'
  walletAddress: string
  isDefault: boolean
  isVerified: boolean
  createdAt: string
}

// Portfolio
export interface Portfolio {
  id: string
  userId: string
  totalInvested: number
  currentBalance: number
  totalEarnings: number
  totalWithdrawn: number
  createdAt: string
  updatedAt: string
}

// Admin
export interface AdminLog {
  id: string
  adminId: string
  action: string
  targetType: string
  targetId: string
  details?: Record<string, any>
  createdAt: string
}
