#!/bin/bash

# Test script to verify user requests reach admin dashboard

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="admin@emax.test"
ADMIN_PASSWORD="Admin@123456"
USER_EMAIL="testuser@emax.test"
USER_PASSWORD="User@123456"

echo "🧪 Testing Data Flow: User → Admin Dashboard"
echo "============================================="

# 1. Register User
echo -e "\n1️⃣ Registering test user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$USER_EMAIL'",
    "password": "'$USER_PASSWORD'",
    "full_name": "Test User"
  }')

USER_ID=$(echo $USER_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ User registered: $USER_ID"

# 2. Register Admin
echo -e "\n2️⃣ Registering admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'",
    "full_name": "Admin User"
  }')

ADMIN_ID=$(echo $ADMIN_RESPONSE | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo "✅ Admin registered: $ADMIN_ID"

# 3. User Login
echo -e "\n3️⃣ User login..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$USER_EMAIL'",
    "password": "'$USER_PASSWORD'"
  }')

USER_TOKEN=$(echo $USER_LOGIN | grep -o '"session":"[^"]*' | cut -d'"' -f4 | awk '{print $1}')
if [ -z "$USER_TOKEN" ]; then
  USER_TOKEN=$(echo $USER_LOGIN | grep -o '"access_token":"[^"]*' | head -1 | cut -d'"' -f4)
fi
echo "✅ User token obtained: ${USER_TOKEN:0:20}..."

# 4. User submits deposit request
echo -e "\n4️⃣ User submitting deposit request..."
DEPOSIT_RESPONSE=$(curl -s -X POST "$BASE_URL/api/deposits/request" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "amount": "1000",
    "currency": "USDT",
    "wallet_address_used": "0x123456789abcdef123456789abcdef123456789a",
    "transaction_hash": "0xaabbccddeeff112233445566778899aabbccddeeff112233445566778899"
  }')

DEPOSIT_STATUS=$(echo $DEPOSIT_RESPONSE | grep -o '"status":"[^"]*' | cut -d'"' -f4)
echo "✅ Deposit request created with status: $DEPOSIT_STATUS"
echo "Response: $DEPOSIT_RESPONSE"

# 5. Admin Login
echo -e "\n5️⃣ Admin login..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$ADMIN_EMAIL'",
    "password": "'$ADMIN_PASSWORD'"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"session":"[^"]*' | cut -d'"' -f4 | awk '{print $1}')
if [ -z "$ADMIN_TOKEN" ]; then
  ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"access_token":"[^"]*' | head -1 | cut -d'"' -f4)
fi
echo "✅ Admin token obtained: ${ADMIN_TOKEN:0:20}..."

# 6. Admin fetch pending deposits
echo -e "\n6️⃣ Admin fetching pending deposits..."
ADMIN_DEPOSITS=$(curl -s -X GET "$BASE_URL/api/admin/deposits?status=pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

DEPOSIT_COUNT=$(echo $ADMIN_DEPOSITS | grep -o '"id":"[^"]*' | wc -l)
echo "✅ Admin sees $DEPOSIT_COUNT pending deposits"
echo "Response: $ADMIN_DEPOSITS"

if [ "$DEPOSIT_COUNT" -gt 0 ]; then
  echo -e "\n✨ SUCCESS! Data flow is working:"
  echo "   • User created deposit request ✅"
  echo "   • Deposit saved to database ✅"
  echo "   • Admin can see pending deposit ✅"
else
  echo -e "\n❌ FAILED! Deposit not visible to admin"
fi
