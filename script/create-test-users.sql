-- Complete SQL to setup test users in Supabase TEST project
-- Run this in your Supabase SQL Editor

-- First, ensure the portfolios table exists (from setup-dashboard-db.sql)
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  total_invested DECIMAL(20, 2) DEFAULT 0,
  current_balance DECIMAL(20, 2) DEFAULT 0,
  total_profit DECIMAL(20, 2) DEFAULT 0,
  profit_percentage DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Enable RLS on portfolios if not already enabled
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for portfolios
DROP POLICY IF EXISTS "Users can view their own portfolio" ON public.portfolios;
CREATE POLICY "Users can view their own portfolio"
  ON public.portfolios FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own portfolio" ON public.portfolios;
CREATE POLICY "Users can update their own portfolio"
  ON public.portfolios FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- IMPORTANT: First create the auth users via API or dashboard:
-- 1. test@example.com / Test123456!
-- 2. admin@example.com / Test123456!

-- Then run this SQL to create their profiles:

-- Regular test user
INSERT INTO public.users (
  id,
  email,
  full_name,
  username,
  is_admin,
  account_status,
  kyc_status,
  balance,
  total_invested,
  total_earnings
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test User',
  'testuser',
  FALSE,
  'active',
  'approved',
  0,
  0,
  0
) ON CONFLICT (id) DO NOTHING;

-- Admin test user
INSERT INTO public.users (
  id,
  email,
  full_name,
  username,
  is_admin,
  account_status,
  kyc_status,
  balance,
  total_invested,
  total_earnings
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin@example.com',
  'Admin User',
  'adminuser',
  TRUE,
  'active',
  'approved',
  0,
  0,
  0
) ON CONFLICT (id) DO NOTHING;

-- Create portfolios for the test users
INSERT INTO public.portfolios (
  user_id,
  total_invested,
  current_balance,
  total_profit,
  profit_percentage
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  0,
  0,
  0,
  0
) ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.portfolios (
  user_id,
  total_invested,
  current_balance,
  total_profit,
  profit_percentage
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  0,
  0,
  0,
  0
) ON CONFLICT (user_id) DO NOTHING;

-- Verify the users were created
SELECT
  u.email,
  u.full_name,
  u.username,
  u.is_admin,
  u.account_status,
  u.kyc_status,
  p.total_invested,
  p.current_balance
FROM public.users u
LEFT JOIN public.portfolios p ON u.id = p.user_id
WHERE u.email IN ('test@example.com', 'admin@example.com');