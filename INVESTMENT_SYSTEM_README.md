# Investment System Setup and Maintenance

This document explains how to set up and maintain the investment system with ROI calculations and automatic completion.

## Features

- **Daily ROI Calculation**: Automatically calculates and credits daily returns on active investments
- **Investment Completion**: Automatically completes investments when they reach their end date
- **Capital Withdrawal**: Allows withdrawal of original investment capital only from completed plans
- **Profit Withdrawal**: Allows withdrawal of earned ROI profits at any time

## Database Schema

The system uses the following tables:
- `investments`: Stores investment records with ROI rates and completion status
- `daily_earnings`: Tracks daily ROI earnings credited to users
- `transactions`: Records all financial transactions
- `trading_plans`: Defines investment plans with ROI rates and durations

## API Endpoints

### User APIs
- `GET /api/investments/history`: Get user's investment history and summary
- `POST /api/investments/purchase`: Purchase a new investment plan
- `POST /api/withdrawals/request`: Request a withdrawal (capital or profit)

### Admin APIs
- `POST /api/admin/daily-earnings`: Calculate and credit daily ROI for all active investments
- `POST /api/admin/complete-investments`: Complete investments that have reached their end date
- `POST /api/admin/investments`: Approve/reject pending investments

## Daily Maintenance

Run the daily maintenance script to process earnings and complete investments:

```bash
# Set the admin token (get this from an admin user's session)
export ADMIN_AUTH_TOKEN="your-admin-auth-token"

# Run the maintenance script
./scripts/daily-investment-maintenance.sh
```

### Setting up Cron Job

To automate daily maintenance, add this to your crontab:

```bash
# Edit crontab
crontab -e

# Add this line to run daily at 2 AM
0 2 * * * cd /path/to/your/project && ADMIN_AUTH_TOKEN=your-token ./scripts/daily-investment-maintenance.sh >> /var/log/investment-maintenance.log 2>&1
```

## Investment Flow

1. **Purchase**: User buys an investment plan
2. **Approval**: Admin approves the investment (status: pending → active)
3. **Daily Earnings**: System credits daily ROI to user balance
4. **Completion**: When end_date is reached, investment completes and capital becomes available for withdrawal
5. **Withdrawal**: User can withdraw profits anytime, capital only from completed investments

## Key Rules

- **Active Investments**: Generate daily ROI until completion
- **Completed Investments**: ROI stops, capital becomes available for withdrawal
- **Capital Withdrawals**: Only allowed from completed investments
- **Profit Withdrawals**: Allowed anytime from current balance (includes earned ROI)

## Testing

Test the system with these scenarios:

1. Create an investment and approve it
2. Run daily earnings calculation
3. Verify earnings are credited to user balance
4. Wait for or manually set investment end_date
5. Run completion script
6. Verify capital is returned and available for withdrawal

## Monitoring

Monitor these metrics:
- Daily earnings processed
- Investments completed
- Capital returned to users
- Failed transactions (check logs)

## Security Notes

- Admin APIs require valid admin authentication
- All financial operations are logged in `admin_logs` table
- Balance operations use atomic transactions to prevent race conditions
- Withdrawal requests require admin approval