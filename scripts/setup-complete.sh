#!/bin/bash
# Complete Test User Setup - Verifies and Creates Everything

SUPABASE_URL="https://xvbsxxqdmzpvfkpbyxre.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YnN4eHFkbXpwdmZrcGJ5eHJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2Mjc1MiwiZXhwIjoyMDg4MTM4NzUyfQ.dEMAYMboLZTIFIseKSCCOUUnzBUN5emjoeoMilhD-8I"

echo "=== Emax Protocol Test User Setup ==="
echo ""
echo "STEP 1: Verify auth users exist"
echo "================================"

# Check if auth users exist
AUTH_USERS=$(curl -s -X GET "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Authorization: Bearer $SERVICE_KEY" 2>/dev/null | grep -o '"email":"test@example.com"' | wc -l)

echo "Test users in auth:"
curl -s -X GET "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Authorization: Bearer $SERVICE_KEY" 2>/dev/null | grep -o '"email":"[^"]*"' | grep -E "(test|admin)@example.com"

echo ""
echo "STEP 2: Create user profiles (if missing)"
echo "=========================================="

# This SQL creates the tables and profiles
SQL=$(cat <<'SQL_EOF'
-- Step 1: Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  fullname VARCHAR(255),
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

-- Step 2: Create portfolios table if not exists
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

-- Step 3: Insert or update test user profile
INSERT INTO public.users (id, email, full_name, username, is_admin, account_status, kyc_status)
SELECT id, 'test@example.com', 'Test User', 'testuser', FALSE, 'active', 'approved'
FROM auth.users WHERE email = 'test@example.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Test User',
  username = 'testuser',
  is_admin = FALSE,
  account_status = 'active',
  kyc_status = 'approved';

-- Step 4: Insert or update admin user profile
INSERT INTO public.users (id, email, full_name, username, is_admin, account_status, kyc_status)
SELECT id, 'admin@example.com', 'Admin User', 'adminuser', TRUE, 'active', 'approved'
FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Admin User',
  username = 'adminuser',
  is_admin = TRUE,
  account_status = 'active',
  kyc_status = 'approved';

-- Step 5: Create portfolios for both users
INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage)
SELECT id, 0, 0, 0, 0 FROM public.users WHERE email = 'test@example.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage)
SELECT id, 0, 0, 0, 0 FROM public.users WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Step 6: Verify everything
SELECT 
  u.email,
  u.full_name,
  u.username,
  u.is_admin,
  u.account_status,
  p.id as portfolio_id
FROM public.users u
LEFT JOIN public.portfolios p ON u.id = p.user_id
WHERE u.email IN ('test@example.com', 'admin@example.com')
ORDER BY u.email;
SQL_EOF
)

# Execute SQL via REST API
echo "Executing SQL setup..."
RESULT=$(curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d "{\"sql\": $(echo "$SQL" | jq -Rs .)}" 2>/dev/null)

echo "SQL Result: $RESULT"

echo ""
echo "STEP 3: Verify setup complete"
echo "============================="

# Verify the profiles were created
echo "Checking user profiles in public.users:"
PROFILES=$(curl -s -X GET "$SUPABASE_URL/rest/v1/users?email=in.(test@example.com,admin@example.com)" \
  -H "Authorization: Bearer $SERVICE_KEY" 2>/dev/null)

echo "$PROFILES" | jq '.'

echo ""
echo "✅ Setup complete!"
echo ""
echo "Test Credentials:"
echo "  • test@example.com / Test123456!"
echo "  • admin@example.com / Test123456!"
echo ""
echo "Run tests with:"
echo "  npm run test:e2e"
