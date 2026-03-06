#!/bin/bash

# Daily Investment Maintenance Script
# This script should be run daily (e.g., via cron job) to:
# 1. Calculate and credit daily ROI earnings for active investments
# 2. Complete investments that have reached their end date

echo "Starting daily investment maintenance..."

# Get the base URL - adjust this for your environment
BASE_URL="http://localhost:3000"

# Admin authentication token - this should be obtained securely
# For production, use environment variables or secure token storage
ADMIN_TOKEN="${ADMIN_AUTH_TOKEN}"

if [ -z "$ADMIN_TOKEN" ]; then
    echo "Error: ADMIN_AUTH_TOKEN environment variable not set"
    echo "Please set ADMIN_AUTH_TOKEN with a valid admin authentication token"
    exit 1
fi

# Function to make authenticated API calls
call_api() {
    local endpoint=$1
    local method=${2:-POST}

    curl -s -X $method \
         -H "Content-Type: application/json" \
         -H "Cookie: sb-auth-token=$ADMIN_TOKEN" \
         "$BASE_URL$endpoint"
}

echo "1. Calculating daily ROI earnings..."
earnings_response=$(call_api "/api/admin/daily-earnings")

if echo "$earnings_response" | grep -q '"success":true'; then
    processed=$(echo "$earnings_response" | grep -o '"processed":[0-9]*' | cut -d':' -f2)
    total_earnings=$(echo "$earnings_response" | grep -o '"totalEarnings":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Processed $processed investments, credited \$$total_earnings in earnings"
else
    echo "❌ Failed to calculate daily earnings"
    echo "Response: $earnings_response"
fi

echo ""
echo "2. Completing expired investments..."
completion_response=$(call_api "/api/admin/complete-investments")

if echo "$completion_response" | grep -q '"success":true'; then
    completed=$(echo "$completion_response" | grep -o '"completed":[0-9]*' | cut -d':' -f2)
    total_capital=$(echo "$completion_response" | grep -o '"totalCapitalReturned":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Completed $completed investments, returned \$$total_capital in capital"
else
    echo "❌ Failed to complete investments"
    echo "Response: $completion_response"
fi

echo ""
echo "Daily maintenance completed!"

# Optional: Send notification or log to monitoring system
# You can add email notifications, Slack messages, or logging here