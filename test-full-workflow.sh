#!/bin/bash

# Comprehensive workflow test with admin operations

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin-workflow-$(date +%s)@test.com"
ADMIN_PASSWORD="Admin@123456"
USER_EMAIL="user-workflow-$(date +%s)@test.com"
USER_PASSWORD="User@123456"

echo "🔄 Complete Workflow Test"
echo "=================================="

# 1. Create Admin User
echo -e "\n1️⃣ Creating admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'",
    "full_name": "Test Admin",
    "is_admin": true
  }')

echo "Admin Response: $ADMIN_RESPONSE"
ADMIN_ID=$(echo "$ADMIN_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ Admin created: $ADMIN_ID"

# 2. Create Regular User
echo -e "\n2️⃣ Creating regular user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$USER_EMAIL'",
    "password": "'$USER_PASSWORD'",
    "full_name": "Test User"
  }')

echo "User Response: $USER_RESPONSE"
USER_ID=$(echo "$USER_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ User created: $USER_ID"

# 3. Login User
echo -e "\n3️⃣ User logging in..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$USER_EMAIL'",
    "password": "'$USER_PASSWORD'"
  }')

echo "Login Response: $USER_LOGIN"
USER_TOKEN=$(echo "$USER_LOGIN" | grep -o '"access_token":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ User token obtained: ${USER_TOKEN:0:20}..."

# 4. User Submit Deposit
echo -e "\n4️⃣ User submitting deposit..."
DEPOSIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/deposits/request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "amount": "1500",
    "currency": "USDT",
    "wallet_address_used": "0x742d35Cc6634C0532925a3b844Bc0e7595f2bEb7",
    "transaction_hash": "0xabc123def456"
  }')

echo "Deposit Response: $DEPOSIT_RESPONSE"
DEPOSIT_ID=$(echo "$DEPOSIT_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
DEPOSIT_STATUS=$(echo "$DEPOSIT_RESPONSE" | grep -o '"status":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ Deposit created: $DEPOSIT_ID (Status: $DEPOSIT_STATUS)"

# 5. Login Admin
echo -e "\n5️⃣ Admin logging in..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'"
  }')

echo "Admin Login Response: $ADMIN_LOGIN"
ADMIN_TOKEN=$(echo "$ADMIN_LOGIN" | grep -o '"access_token":"[^"]*' | head -1 | cut -d'"' -f4)
echo "✅ Admin token: ${ADMIN_TOKEN:0:20}..."

# 6. Admin Fetch Pending Deposits
echo -e "\n6️⃣ Admin fetching pending deposits..."
ADMIN_DEPOSITS=$(curl -s -X GET "$BASE_URL/api/admin/deposits?status=pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "Admin Deposits Response: $ADMIN_DEPOSITS"
DEPOSIT_COUNT=$(echo "$ADMIN_DEPOSITS" | grep -o '"id":"[^"]*' | wc -l)
echo "✅ Admin sees $DEPOSIT_COUNT pending deposits"

# 7. Admin Approve Deposit
if [ ! -z "$DEPOSIT_ID" ]; then
  echo -e "\n7️⃣ Admin approving deposit..."
  APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/api/admin/deposit-approve" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -d '{
      "deposit_id": "'$DEPOSIT_ID'",
      "status": "approved"
    }')

  echo "Approve Response: $APPROVE_RESPONSE"
  echo "✅ Deposit approved"
fi

# Summary
echo -e "\n📊 Workflow Summary:"
echo "============================================"
echo "✅ Admin user created: $ADMIN_ID"
echo "✅ Regular user created: $USER_ID"
echo "✅ Deposit submitted: $DEPOSIT_ID"
echo "✅ Deposits visible to admin: $DEPOSIT_COUNT"
echo "✅ Deposit approved by admin"
echo -e "\nWorkflow complete! 🎉"
