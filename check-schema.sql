-- Check all tables in public schema
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check columns for users table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- Check columns for deposits table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'deposits'
ORDER BY ordinal_position;

-- Check columns for kyc_submissions table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'kyc_submissions'
ORDER BY ordinal_position;

-- Check columns for withdrawals table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'withdrawals'
ORDER BY ordinal_position;

-- Check columns for investments table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'investments'
ORDER BY ordinal_position;
