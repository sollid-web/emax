-- TEST USER SETUP SQL
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/xvbsxxqdmzpvfkpbyxre/sql/new

-- ============================================
-- STEP 1: Create users table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  username VARCHAR(100) UNIQUE,
  is_admin BOOLEAN DEFAULT FALSE,
  account_status VARCHAR(50) DEFAULT 'active',
  kyc_status VARCHAR(50) DEFAULT 'approved',
  balance DECIMAL(20, 2) DEFAULT 0,
  total_invested DECIMAL(20, 2) DEFAULT 0,
  total_earnings DECIMAL(20, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 2: Create portfolios table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  total_invested DECIMAL(20, 2) DEFAULT 0,
  current_balance DECIMAL(20, 2) DEFAULT 0,
  total_profit DECIMAL(20, 2) DEFAULT 0,
  profit_percentage DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 3: Create test user profile
-- ============================================
INSERT INTO public.users (id, email, full_name, username, is_admin, account_status, kyc_status)
SELECT id, 'test@example.com', 'Test User', 'testuser', FALSE, 'active', 'approved'
FROM auth.users WHERE email = 'test@example.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Test User',
  username = 'testuser',
  is_admin = FALSE;

-- ============================================
-- STEP 4: Create admin user profile
-- ============================================
INSERT INTO public.users (id, email, full_name, username, is_admin, account_status, kyc_status)
SELECT id, 'admin@example.com', 'Admin User', 'adminuser', TRUE, 'active', 'approved'
FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Admin User',
  username = 'adminuser',
  is_admin = TRUE;

-- ============================================
-- STEP 5: Create portfolios for test users
-- ============================================
INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage)
SELECT id, 0, 0, 0, 0 FROM public.users WHERE email = 'test@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage)
SELECT id, 0, 0, 0, 0 FROM public.users WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- STEP 6: VERIFY - Check if users and portfolios exist
-- ============================================
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.username,
  u.is_admin,
  u.account_status,
  p.id as portfolio_id,
  CASE WHEN p.id IS NOT NULL THEN '✓ Portfolio exists' ELSE '✗ Portfolio missing' END as status
FROM public.users u
LEFT JOIN public.portfolios p ON u.id = p.user_id
WHERE u.email IN ('test@example.com', 'admin@example.com')
ORDER BY u.email;
