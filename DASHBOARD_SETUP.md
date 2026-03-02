# Emax Protocol Dashboard Setup Guide

## Overview
The production-ready dashboard has been fully integrated with Supabase authentication and a comprehensive user management system. Users can now sign up, log in, and access their personalized trading dashboard.

## Architecture

### Authentication Flow
1. User signs up/logs in via `/signup` or `/login`
2. Supabase handles authentication and session management
3. Upon successful auth, users are redirected to `/dashboard`
4. AuthContext maintains user state across the application
5. Protected routes ensure only authenticated users access the dashboard

### Database Schema
- **user_profiles**: User account information
- **portfolios**: User portfolio data and balances
- **investments**: User investments and trading positions
- **transactions**: Transaction history
- **daily_earnings**: Daily profit tracking
- **withdrawals**: Withdrawal requests and history
- **support_tickets**: Customer support tickets
- **bank_details**: User banking information for withdrawals

### Row Level Security (RLS)
All database tables have RLS enabled to ensure users can only access their own data:
- Users can SELECT, INSERT, UPDATE, DELETE only their own records
- Auth user ID is used as the filtering criterion

## Key Features

### Dashboard Pages
1. **Overview** (`/dashboard`): Portfolio summary, recent activity, quick stats
2. **Portfolio** (`/dashboard/portfolio`): Detailed portfolio breakdown and analytics
3. **Investments** (`/dashboard/investments`): Active investments and investment history
4. **Transactions** (`/dashboard/transactions`): Complete transaction history
5. **Withdrawals** (`/dashboard/withdrawals`): Withdraw earnings and manage withdrawals
6. **Support** (`/dashboard/support`): Contact support and view support tickets
7. **Settings** (`/dashboard/settings`): Profile settings, security, preferences

### Components
- **DashboardHeader**: Navigation and user profile menu
- **DashboardSidebar**: Navigation menu with all dashboard sections
- **PortfolioAnalytics**: Portfolio summary cards and metrics
- **InvestmentForm**: Create new investments in trading plans

## Setup Steps

### 1. Database Setup
Execute the migration script to create all necessary tables:
```bash
# The SQL script has already been executed
scripts/setup-dashboard-db.sql
```

### 2. Environment Variables
Ensure these environment variables are set:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Authentication
- Sign up: `/signup` - New user registration
- Login: `/login` - Existing user login
- Forgot Password: `/forgot-password` - Password recovery

### 4. Dashboard Access
After successful authentication, users are automatically redirected to `/dashboard`

## Usage

### Sign Up
```
1. Navigate to /signup
2. Enter full name, username, email, and password
3. Accept terms and conditions
4. Click "Create Account"
```

### Login
```
1. Navigate to /login
2. Enter email and password
3. Click "Sign In"
```

### Make Investment
```
1. Go to /dashboard/investments
2. Click "New Investment"
3. Select investment plan
4. Enter amount
5. Confirm investment
```

### Withdraw Earnings
```
1. Go to /dashboard/withdrawals
2. Click "Request Withdrawal"
3. Enter withdrawal amount and bank details
4. Submit request
```

## File Structure
```
/app
  /dashboard
    /layout.tsx          # Dashboard layout with header and sidebar
    /page.tsx            # Dashboard overview
    /portfolio/page.tsx
    /investments/page.tsx
    /transactions/page.tsx
    /withdrawals/page.tsx
    /support/page.tsx
    /settings/page.tsx
  /login/page.tsx
  /signup/page.tsx
  /layout.tsx            # Root layout with AuthProvider

/components
  /dashboard
    /header.tsx          # Dashboard header
    /sidebar.tsx         # Dashboard sidebar navigation
    /portfolio-analytics.tsx
    /investment-form.tsx

/contexts
  /auth-context.tsx      # Auth state management

/lib
  /supabase.ts          # Supabase client setup
  /db-operations.ts     # Database operations

/types
  /auth.ts              # TypeScript interfaces
```

## Security Features
- Row Level Security (RLS) on all tables
- Supabase auth handles password hashing
- Session tokens stored securely
- Protected routes for authenticated users
- Input validation on all forms

## Next Steps
1. Test sign up flow
2. Test login flow
3. Test dashboard access
4. Test investment creation
5. Test withdrawal process
6. Monitor for any errors in browser console
