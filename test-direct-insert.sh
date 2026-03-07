#!/bin/bash

SUPABASE_URL="https://hhtdnihdjnlgyhnnvvly.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodGRuaWhkam5sZ3lobm52dmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTk3NTUsImV4cCI6MjA4Nzk3NTc1NX0.33biRh9hwHOa6huyEo4w79JeR1Jcz59yAelphrcUvKk"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodGRuaWhkam5sZ3lobm52dmx5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjM5OTc1NSwiZXhwIjoyMDg3OTc1NzU1fQ.MN4qViAhSGK6Wkn6B2TtawP1QB7JZG3uN6XnaMVvRcQ"

TEST_ID="direct-test-$(date +%s)"
echo "🧪 Testing direct insert to users table with SERVICE ROLE KEY..."
echo ""

curl -s -X POST "$SUPABASE_URL/rest/v1/users" \
  -H "apikey: $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "'$TEST_ID'",
    "email": "direct-test-'$(date +%s)'@test.com",
    "full_name": "Direct Test",
    "username": "'$TEST_ID'",
    "balance": 1000,
    "kyc_status": "not_started"
  }' | jq '.'

echo ""
echo "Verifying insert worked:"
curl -s "$SUPABASE_URL/rest/v1/users?id=eq.$TEST_ID" \
  -H "apikey: $ANON_KEY" | jq '.'
