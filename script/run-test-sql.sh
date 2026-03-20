#!/bin/bash
# Execute the test user creation SQL directly

SUPABASE_URL="https://xvbsxxqdmzpvfkpbyxre.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YnN4eHFkbXpwdmZrcGJ5eHJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2Mjc1MiwiZXhwIjoyMDg4MTM4NzUyfQ.dEMAYMboLZTIFIseKSCCOUUnzBUN5emjoeoMilhD-8I"

echo "📝 Running SQL to create user profiles..."
echo ""

SQL=$(cat <<'SQL_END'
-- Create portfolios table if not exists
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

-- Insert test user profile
INSERT INTO public.users (
  id,
  email,
  full_name,
  username
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@example.com'),
  'test@example.com',
  'Test User',
  'testuser'
) ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Test User',
  username = 'testuser';

-- Insert admin user profile
INSERT INTO public.users (
  id,
  email,
  full_name,
  username
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin@example.com',
  'Admin User',
  'adminuser'
) ON CONFLICT (id) DO UPDATE SET 
  full_name = 'Admin User',
  username = 'adminuser';

-- Create portfolios for test users
INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage) 
VALUES ((SELECT id FROM auth.users WHERE email = 'test@example.com'), 0, 0, 0, 0) 
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage) 
VALUES ((SELECT id FROM auth.users WHERE email = 'admin@example.com'), 0, 0, 0, 0) 
ON CONFLICT (user_id) DO NOTHING;
SQL_END
)

# Execute SQL via REST API
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/exec_sql" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d "{\"sql\": $(echo "$SQL" | jq -R -s .)}" \
  2>&1 | head -20

echo ""
echo "✅ SQL executed!"
echo "You can now run: npm run test:e2e"
