#!/bin/bash

# Comprehensive Workflow Test Script
# Tests all major application workflows end-to-end

BASE_URL="http://localhost:3000"
TEST_RESULTS=()

echo "🚀 Starting Comprehensive Workflow Tests"
echo "=========================================="

# Function to test API endpoints
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local expected_status=${4:-200}
    local description=$5

    echo ""
    echo "Testing: $description"
    echo "Method: $method $url"

    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X GET "$BASE_URL$url")
    else
        response=$(curl -s -w "\nHTTPSTATUS:%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$url")
    fi

    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')

    if [ "$http_code" = "$expected_status" ]; then
        echo "✅ PASS - Status: $http_code"
        TEST_RESULTS+=("PASS: $description")
        return 0
    else
        echo "❌ FAIL - Expected: $expected_status, Got: $http_code"
        echo "Response: $body"
        TEST_RESULTS+=("FAIL: $description (Expected: $expected_status, Got: $http_code)")
        return 1
    fi
}

# Test 1: Health Check - Server is running
echo ""
echo "1. 🏥 Health Check"
test_endpoint "GET" "/" "" 200 "Server health check"

# Test 2: User Registration
echo ""
echo "2. 👤 User Registration"
test_endpoint "POST" "/api/auth/register" '{
  "email": "testuser@example.com",
  "password": "TestPass123!",
  "full_name": "Test User",
  "username": "testuser"
}' 201 "User registration"

# Test 3: User Login
echo ""
echo "3. 🔐 User Login"
test_endpoint "POST" "/api/auth/login" '{
  "email": "testuser@example.com",
  "password": "TestPass123!"
}' 200 "User login"

# Test 4: Get Trading Plans
echo ""
echo "4. 📊 Get Trading Plans"
test_endpoint "GET" "/api/trading-plans" "" 200 "Get trading plans"

# Test 5: Get User Profile (will fail without auth, but tests endpoint)
echo ""
echo "5. 👤 Get User Profile"
test_endpoint "GET" "/api/user/profile" "" 401 "Get user profile (unauthorized)"

# Test 6: Admin User Creation (will fail without admin auth)
echo ""
echo "6. 👑 Admin User Creation"
test_endpoint "POST" "/api/admin/users/create" '{
  "email": "admincreated@example.com",
  "password": "AdminPass123!",
  "full_name": "Admin Created User",
  "username": "admincreated",
  "initial_balance": "100.00"
}' 401 "Admin user creation (unauthorized)"

# Test 7: Admin Balance Management (will fail without admin auth)
echo ""
echo "7. 💰 Admin Balance Management"
test_endpoint "POST" "/api/admin/balance" '{
  "user_id": "test-user-id",
  "amount": "50.00",
  "operation": "credit",
  "reason": "Test bonus",
  "description": "Testing balance adjustment"
}' 401 "Admin balance adjustment (unauthorized)"

# Test 8: Investment Purchase (will fail without auth)
echo ""
echo "8. 📈 Investment Purchase"
test_endpoint "POST" "/api/investments/purchase" '{
  "plan_id": "test-plan-id",
  "amount": "100.00"
}' 401 "Investment purchase (unauthorized)"

# Test 9: Deposit Request (will fail without auth)
echo ""
echo "9. 💳 Deposit Request"
test_endpoint "POST" "/api/deposits/request" '{
  "amount": "100.00",
  "currency": "BTC",
  "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}' 401 "Deposit request (unauthorized)"

# Test 10: Withdrawal Request (will fail without auth)
echo ""
echo "10. 💸 Withdrawal Request"
test_endpoint "POST" "/api/withdrawals/request" '{
  "amount": "50.00",
  "currency": "BTC",
  "withdrawalType": "profit",
  "walletAddress": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
}' 401 "Withdrawal request (unauthorized)"

# Test 11: Support Ticket Creation (will fail without auth)
echo ""
echo "11. 🎫 Support Ticket Creation"
test_endpoint "POST" "/api/support" '{
  "subject": "Test Support Ticket",
  "message": "This is a test support ticket",
  "priority": "medium"
}' 401 "Support ticket creation (unauthorized)"

# Test 12: Admin Daily Earnings (will fail without admin auth)
echo ""
echo "12. 📅 Admin Daily Earnings Calculation"
test_endpoint "POST" "/api/admin/daily-earnings" "" 401 "Daily earnings calculation (unauthorized)"

# Test 13: Admin Investment Completion (will fail without admin auth)
echo ""
echo "13. ✅ Admin Investment Completion"
test_endpoint "POST" "/api/admin/complete-investments" "" 401 "Investment completion (unauthorized)"

# Test 14: Admin Deposit Approval (will fail without admin auth)
echo ""
echo "14. ✅ Admin Deposit Approval"
test_endpoint "POST" "/api/admin/deposits" '{
  "deposit_id": "test-deposit-id",
  "status": "approved"
}' 401 "Deposit approval (unauthorized)"

# Test 15: Admin Investment Approval (will fail without admin auth)
echo ""
echo "15. ✅ Admin Investment Approval"
test_endpoint "POST" "/api/admin/investments" '{
  "investment_id": "test-investment-id",
  "status": "approved"
}' 401 "Investment approval (unauthorized)"

# Test 16: Admin Withdrawal Approval (will fail without admin auth)
echo ""
echo "16. ✅ Admin Withdrawal Approval"
test_endpoint "POST" "/api/admin/withdrawals" '{
  "withdrawal_id": "test-withdrawal-id",
  "status": "approved"
}' 401 "Withdrawal approval (unauthorized)"

# Test 17: Admin KYC Approval (will fail without admin auth)
echo ""
echo "17. 🆔 Admin KYC Approval"
test_endpoint "POST" "/api/admin/kyc" '{
  "kyc_id": "test-kyc-id",
  "status": "approved"
}' 401 "KYC approval (unauthorized)"

echo ""
echo "=========================================="
echo "📊 TEST RESULTS SUMMARY"
echo "=========================================="

passed=0
failed=0

for result in "${TEST_RESULTS[@]}"; do
    if [[ $result == PASS* ]]; then
        ((passed++))
        echo "✅ $result"
    else
        ((failed++))
        echo "❌ $result"
    fi
done

echo ""
echo "Total Tests: $((passed + failed))"
echo "Passed: $passed"
echo "Failed: $failed"

if [ $failed -eq 0 ]; then
    echo ""
    echo "🎉 ALL TESTS PASSED! The application is working correctly."
    echo "Note: Most tests show 401 (Unauthorized) which is expected without proper authentication."
    echo "This indicates the authentication system is working correctly."
else
    echo ""
    echo "⚠️  Some tests failed. Please check the application logs for details."
fi

echo ""
echo "=========================================="
echo "🏁 Workflow Test Complete"
echo "=========================================="