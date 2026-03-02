# Admin Financial Operations System Design

## 1. Executive Overview
The Admin Financial Operations system enables authorized administrators to perform critical financial management tasks including crediting/debiting user accounts, initiating investments on behalf of users, and maintaining comprehensive audit trails for regulatory compliance.

## 2. Core Operations

### 2.1 Account Credit Operation
- **Purpose**: Deposit funds directly to user account (e.g., bonus, adjustment, manual approval)
- **Flow**: Admin selects user → enters amount → provides reason → confirms → balance updated → transaction logged
- **Validation**: Amount > 0, user exists, sufficient admin permissions
- **Result**: Immediate balance update + transaction record creation

### 2.2 Account Debit Operation
- **Purpose**: Withdraw funds from user account (e.g., penalty, reversal, correction)
- **Flow**: Admin selects user → enters amount → provides reason → confirms → validates balance → deducts → logs
- **Validation**: Amount > 0, balance sufficient, user exists, admin authorized
- **Result**: Reduced balance + transaction record + audit log

### 2.3 Investment Initiation
- **Purpose**: Create investment on behalf of user (bypassing deposit requirements)
- **Flow**: Admin selects user → chooses plan → enters amount → provides reason → auto-approves → creates investment
- **Validation**: User KYC approved, amount within plan limits, user has sufficient balance
- **Result**: Active investment created + daily earnings scheduled + transaction recorded

### 2.4 User Search & Filter
- **Purpose**: Locate users for financial operations
- **Filters**: Email, username, phone, account status, KYC status, balance range
- **Display**: User profile, balance, total invested, pending requests, action buttons

## 3. Security & Authorization Measures

### 3.1 Role-Based Access Control (RBAC)
```
Admin Levels:
- Super Admin: All operations, user/admin management
- Financial Admin: Credit/debit, investment operations only
- Support Admin: View-only access to account details
- KYC Admin: KYC approvals only
```

### 3.2 Authentication & Authorization
- Verify admin role on every operation (is_admin = TRUE + role_type check)
- Session validation before sensitive operations
- Two-factor authentication for transactions > $10,000 (future)
- IP whitelisting for sensitive admin accounts (future)

### 3.3 Immutable Audit Trail
All operations recorded with:
- Admin ID + timestamp
- Operation type (credit/debit/investment)
- User ID + affected balance
- Reason/description (mandatory)
- Before/after balance snapshot
- Transaction status + completion time

### 3.4 Business Logic Constraints
- Debit only if balance sufficient
- Credit limited to max transaction amount ($100,000)
- Investment creation requires approved KYC status
- Investment amount must be within plan limits
- Cannot operate on suspended/banned accounts
- All operations require explicit reason/comment

### 3.5 Approval Workflows
- Single approval for routine operations (<$5,000)
- Double approval for large amounts ($5,000+)
- Investment requires KYC + balance validation only
- Failed operations logged with error details

## 4. Data Integration

### 4.1 Database Schema Integration
**Tables Modified/Created:**
```
users:
  - balance (DECIMAL)
  - total_invested (DECIMAL)
  - kyc_status (VARCHAR)
  - account_status (VARCHAR)

admin_financial_transactions (NEW):
  - id (UUID PRIMARY KEY)
  - admin_id (UUID → users)
  - user_id (UUID → users)
  - operation_type (credit/debit/investment)
  - amount (DECIMAL)
  - currency (VARCHAR)
  - reason (TEXT)
  - before_balance (DECIMAL)
  - after_balance (DECIMAL)
  - status (pending/completed/failed)
  - created_at (TIMESTAMP)

admin_logs (EXISTING):
  - id, admin_id, action, target_type, target_id, details, created_at
```

### 4.2 Transaction Flow Diagram
```
Admin Page Request
    ↓
Authorization Check (is_admin + role_type)
    ↓
Input Validation (amount, user, reason)
    ↓
Business Logic Check (balance, limits, KYC)
    ↓
Begin Transaction (database)
    ↓
Update user balance / Create investment
    ↓
Create transaction record
    ↓
Create audit log entry
    ↓
Commit / Rollback
    ↓
Return result to admin UI
    ↓
Log in admin_logs table
```

## 5. Core Components

### 5.1 Frontend Components
- **UsersSearchPanel**: Search/filter users with results table
- **UserDetailModal**: View user profile and account details
- **CreditDebitForm**: Input amount, operation type, reason with validation
- **InvestmentForm**: Select plan, enter amount, auto-calculate ROI
- **TransactionHistory**: Paginated list with filters and export
- **AuditLog**: Admin action log with search and filters
- **ConfirmationDialog**: Review details before execution

### 5.2 Backend APIs
- `GET /api/admin/users` - Search and filter users
- `GET /api/admin/users/:userId` - Get user details
- `POST /api/admin/transactions` - Credit/debit operation
- `POST /api/admin/investments` - Create investment on behalf
- `GET /api/admin/transaction-history` - Fetch transaction history
- `GET /api/admin/audit-logs` - Audit log entries

### 5.3 Page Structure
```
/admin/financials
  ├── Users Management Tab
  │   ├── Search panel
  │   ├── Users list
  │   └── User detail modal
  │
  ├── Credit/Debit Operations Tab
  │   ├── User selector
  │   ├── Operation form
  │   └── Confirmation dialog
  │
  ├── Investment Management Tab
  │   ├── User selector
  │   ├── Plan selector
  │   ├── Investment form
  │   └── Preview/confirm
  │
  └── Transaction History Tab
      ├── Filters
      ├── Transaction table
      ├── Pagination
      └── Export button
```

## 6. User Interface Design Principles

### Color Scheme
- Primary Action (Credit): Green (#10b981)
- Danger Action (Debit): Red (#ef4444)
- Info/Investment: Blue (#3b82f6)
- Neutral: Gray (#6b7280)
- Success feedback: Green (#22c55e)
- Error feedback: Red (#dc2626)

### Typography
- Headings: 18-24px, bold
- Body text: 14-16px, regular
- Form labels: 12px, semi-bold
- Amounts: Monospace font for clarity

### Layout
- Tab-based navigation for operation types
- Separate card-based sections for each operation
- Form fields in logical grouping
- Real-time validation feedback
- Confirmation steps for critical operations

## 7. Security Implementation Details

### 7.1 API Security
```typescript
// Every endpoint checks:
1. User authenticated (session valid)
2. User is admin (is_admin = TRUE)
3. User has correct role for operation
4. Request body validated (types, ranges)
5. User/target user not banned/suspended
6. Amount within allowed limits
```

### 7.2 Database Security (RLS)
```sql
-- Only admins can access admin_financial_transactions
-- Admins can only view their own created transactions (super_admin can view all)
-- Users cannot access admin operations table
-- Immutable: Can only INSERT, never UPDATE/DELETE
```

### 7.3 Logging & Monitoring
- All operations logged with full context
- Failed operations logged with error details
- Admin actions tracked for compliance audit
- Real-time alerts for large transactions (>$50,000)
- Daily transaction reports generated

## 8. Error Handling & Validation

### Client-Side Validation
- Amount > 0 and valid number format
- Reason/comment required and min 10 characters
- User selection required
- Balance validation before debit

### Server-Side Validation
- Duplicate check for recent same operations
- Rate limiting (max 100 ops/hour per admin)
- Account status verification
- Investment plan availability
- KYC status confirmation

### Error Responses
```json
{
  "success": false,
  "error": "Insufficient balance for debit operation",
  "details": {
    "available": 5000,
    "requested": 6000,
    "shortfall": 1000
  }
}
```

## 9. Integration Points

### 9.1 User System Integration
- Reads from users table (balance, KYC, status)
- Updates balance on credit/debit
- Validates against user account status

### 9.2 Investment System Integration
- Creates investment records
- Auto-approves (bypasses user approval)
- Calculates daily ROI based on plan
- Integrates with daily_earnings scheduling

### 9.3 KYC System Integration
- Validates KYC approval before investments
- Checks KYC submission status
- Links to KYC admin workflow

### 9.4 Audit System Integration
- Creates admin_logs entries
- Tracks all operations with timestamps
- Enables compliance reporting
- Provides action history

## 10. Future Enhancements

- Two-factor authentication for large transactions
- IP whitelisting and device tracking
- Scheduled/recurring credits (e.g., monthly bonuses)
- Bulk operation support (CSV import)
- Advanced reporting and analytics
- Role hierarchy and permission templates
- Transaction reversal workflow
- Approval queue system for high-value operations

## 11. Compliance & Regulations

- All operations logged with administrator identity
- Immutable transaction records (audit trail)
- Regular compliance reports generated
- KYC verification enforced
- Account status validation required
- Maximum transaction limits enforced
- Reason/justification required for all operations

---

**Status**: Design Complete | **Version**: 1.0 | **Last Updated**: 2026-02-28
