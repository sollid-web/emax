# E2E Test Setup Guide

## Current Status: Test Users Need Setup

You have 401 authentication errors because test users don't exist in the TEST Supabase project.

## Complete Setup Steps (2 minutes)

### Step 1: Create Auth Users via Supabase Dashboard

1. Go to: https://app.supabase.com/project/xvbsxxqdmzpvfkpbyxre/auth/users
2. Click **"Add user"** button (top right)
3. Create first user:
   - Email: `test@example.com`
   - Password: `Test123456!`
   - Email confirmed: ✅ (toggle ON)
   - Click **"Create user"**

4. Create second user:
   - Email: `admin@example.com`
   - Password: `Test123456!`
   - Email confirmed: ✅ (toggle ON)
   - Click **"Create user"**

### Step 2: Create User Profiles (SQL)

1. Go to: https://app.supabase.com/project/xvbsxxqdmzpvfkpbyxre/sql/new
2. Copy and paste this SQL:

```sql
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

-- Create portfolios
INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage) 
VALUES ((SELECT id FROM auth.users WHERE email = 'test@example.com'), 0, 0, 0, 0) 
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.portfolios (user_id, total_invested, current_balance, total_profit, profit_percentage) 
VALUES ((SELECT id FROM auth.users WHERE email = 'admin@example.com'), 0, 0, 0, 0) 
ON CONFLICT (user_id) DO NOTHING;

-- Verify
SELECT email, full_name, username FROM public.users 
WHERE email IN ('test@example.com', 'admin@example.com');
```

3. Click **"Run"** and wait for success

### Step 3: Run E2E Tests

```bash
npm run test:e2e
```

## Environment Details

- **Test Supabase Project**: https://xvbsxxqdmzpvfkpbyxre.supabase.co
- **Test Credentials**:
  - Email: `test@example.com`, Password: `Test123456!`
  - Email: `admin@example.com`, Password: `Test123456!`
- **Environment Files**:
  - `.env.local` = Production database (for development)
  - `.env.test` = Test database (for e2e tests)
  - `npm run test:e2e` = Automatically loads `.env.test` ✅

## Troubleshooting

**Still getting 401 errors?**
- Verify users exist in Auth section: https://app.supabase.com/project/xvbsxxqdmzpvfkpbyxre/auth/users
- Verify profiles exist by running this SQL:
  ```sql
  SELECT * FROM public.users 
  WHERE email IN ('test@example.com', 'admin@example.com');
  ```

**All set? Run tests:**
```bash
npm run test:e2e
```
