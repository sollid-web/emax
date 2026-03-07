-- Production-Ready Database Schema for Emax Protocol
-- Includes authentication, KYC, investments, deposits, withdrawals, admin approvals

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with profile information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  profile_picture_url VARCHAR(500),
  bio TEXT,
  wallet_address VARCHAR(255),
  balance DECIMAL(18, 8) DEFAULT 0,
  total_invested DECIMAL(18, 8) DEFAULT 0,
  total_earnings DECIMAL(18, 8) DEFAULT 0,
  kyc_status VARCHAR(50) DEFAULT 'not_started', -- not_started, pending, approved, rejected
  is_admin BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active', -- active, suspended, banned
  two_fa_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- KYC (Know Your Customer) table
CREATE TABLE IF NOT EXISTS public.kyc_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  country VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  id_type VARCHAR(50) NOT NULL, -- passport, drivers_license, national_id
  id_number VARCHAR(100) NOT NULL,
  id_front_url VARCHAR(500),
  id_back_url VARCHAR(500),
  selfie_url VARCHAR(500),
  proof_of_address_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_by_admin_id UUID,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by_admin_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Trading plans definition
CREATE TABLE IF NOT EXISTS public.trading_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  min_deposit DECIMAL(18, 8) NOT NULL,
  max_deposit DECIMAL(18, 8),
  daily_roi DECIMAL(5, 2) NOT NULL, -- percentage
  profit_withdrawal_days INTEGER NOT NULL,
  capital_withdrawal_days INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default trading plans
INSERT INTO public.trading_plans (name, min_deposit, max_deposit, daily_roi, profit_withdrawal_days, capital_withdrawal_days, description) VALUES
('Consensus', 250, 999, 1.5, 1, 3, 'Entry-level trading plan'),
('Polkadot', 2000, 4999, 2.0, 1, 3, 'Intermediate trading plan'),
('Ethereum Protocol', 6000, 10000, 3.0, 3, 9, 'Advanced trading plan'),
('Hyperledger Fabric', 20000, NULL, 4.0, 4, 12, 'Premium trading plan')
ON CONFLICT DO NOTHING;

-- Crypto wallets configuration
CREATE TABLE IF NOT EXISTS public.platform_crypto_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  currency VARCHAR(10) NOT NULL UNIQUE, -- BTC, ETH, USDT, USDC
  wallet_address VARCHAR(255) NOT NULL,
  network VARCHAR(50), -- mainnet, testnet, polygon, etc
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default crypto wallets (update these with real addresses)
INSERT INTO public.platform_crypto_wallets (currency, wallet_address, network) VALUES
('BTC', '1A1z7agoat8Bt16TS8UAm8zP6jn14dN7c', 'mainnet'),
('ETH', '0x742d35Cc6634C0532925a3b844Bc9e7595f8bEb2', 'mainnet'),
('USDT', '0x742d35Cc6634C0532925a3b844Bc9e7595f8bEb2', 'ethereum'),
('USDC', '0x742d35Cc6634C0532925a3b844Bc9e7595f8bEb2', 'ethereum')
ON CONFLICT (currency) DO NOTHING;

-- Deposits table with admin approval - CRYPTO ONLY
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  currency VARCHAR(10) NOT NULL, -- BTC, ETH, USDT, USDC
  wallet_address_used VARCHAR(255) NOT NULL, -- The wallet address user sent crypto to
  transaction_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by_admin_id UUID,
  completed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by_admin_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Investments table
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  daily_roi DECIMAL(5, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed, cancelled
  approval_required BOOLEAN DEFAULT TRUE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by_admin_id UUID,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  total_profit DECIMAL(18, 8) DEFAULT 0,
  total_roi_earned DECIMAL(18, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES public.trading_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by_admin_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Daily earnings table
CREATE TABLE IF NOT EXISTS public.daily_earnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investment_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  earned_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, credited, withdrawn
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (investment_id) REFERENCES public.investments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- User crypto wallets - where users receive withdrawals
CREATE TABLE IF NOT EXISTS public.user_crypto_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  currency VARCHAR(10) NOT NULL, -- BTC, ETH, USDT, USDC
  wallet_address VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, currency),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Withdrawals table with admin approval - CRYPTO ONLY
CREATE TABLE IF NOT EXISTS public.withdrawals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  withdrawal_type VARCHAR(50) NOT NULL, -- profit, capital
  currency VARCHAR(10) NOT NULL, -- BTC, ETH, USDT, USDC
  user_wallet_id UUID NOT NULL, -- The user's crypto wallet address to receive funds
  transaction_hash VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, processing, completed
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by_admin_id UUID,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_wallet_id) REFERENCES public.user_crypto_wallets(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by_admin_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Transactions table (general ledger)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- deposit, withdrawal, earnings, bonus, fee
  related_id UUID, -- references deposit, investment, or withdrawal
  amount DECIMAL(18, 8) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'completed', -- pending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_user_id UUID,
  target_type VARCHAR(50), -- kyc, investment, deposit, withdrawal
  target_id UUID,
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (admin_id) REFERENCES public.users(id) ON DELETE SET NULL
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Users RLS policies
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id OR is_admin = TRUE);

CREATE POLICY "users_insert_service_role" ON public.users
  FOR INSERT WITH CHECK (TRUE); -- Service role can insert any user

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- KYC RLS policies
CREATE POLICY "kyc_select_own" ON public.kyc_submissions
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "kyc_insert_own" ON public.kyc_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "kyc_update_own" ON public.kyc_submissions
  FOR UPDATE USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- Deposits RLS policies
CREATE POLICY "deposits_select_own" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "deposits_insert_own" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Investments RLS policies
CREATE POLICY "investments_select_own" ON public.investments
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "investments_insert_own" ON public.investments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Withdrawals RLS policies
CREATE POLICY "withdrawals_select_own" ON public.withdrawals
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "withdrawals_insert_own" ON public.withdrawals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User crypto wallets RLS policies
CREATE POLICY "user_wallets_select_own" ON public.user_crypto_wallets
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "user_wallets_insert_own" ON public.user_crypto_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_wallets_update_own" ON public.user_crypto_wallets
  FOR UPDATE USING (auth.uid() = user_id);

-- Platform crypto wallets RLS policies (public read, admin write)
CREATE POLICY "platform_wallets_select_all" ON public.platform_crypto_wallets
  FOR SELECT USING (TRUE);

CREATE POLICY "platform_wallets_admin_write" ON public.platform_crypto_wallets
  FOR INSERT WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "platform_wallets_admin_update" ON public.platform_crypto_wallets
  FOR UPDATE USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- Transactions RLS policies
CREATE POLICY "transactions_select_own" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id OR (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- Admin logs RLS policies
CREATE POLICY "admin_logs_select_admin" ON public.admin_logs
  FOR SELECT USING ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

CREATE POLICY "admin_logs_insert_admin" ON public.admin_logs
  FOR INSERT WITH CHECK ((SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON public.users(kyc_status);
CREATE INDEX IF NOT EXISTS idx_kyc_user_id ON public.kyc_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_status ON public.kyc_submissions(status);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id ON public.deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON public.deposits(status);
CREATE INDEX IF NOT EXISTS idx_deposits_created_at ON public.deposits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investments_status ON public.investments(status);
CREATE INDEX IF NOT EXISTS idx_investments_plan_id ON public.investments(plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_earnings_user_id ON public.daily_earnings(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_earnings_date ON public.daily_earnings(earned_date);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON public.withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_created_at ON public.withdrawals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_updated_at BEFORE UPDATE ON public.kyc_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON public.investments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    username,
    kyc_status,
    account_status,
    balance,
    total_invested,
    total_earnings,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::TEXT, 1, 8)),
    'not_started',
    'active',
    0,
    0,
    0,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on auth.users to create public.users record
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
