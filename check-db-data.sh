#!/bin/bash

SUPABASE_URL="https://hhtdnihdjnlgyhnnvvly.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodGRuaWhkam5sZ3lobm52dmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTk3NTUsImV4cCI6MjA4Nzk3NTc1NX0.33biRh9hwHOa6huyEo4w79JeR1Jcz59yAelphrcUvKk"

echo "📊 Database Content Check"
echo "========================"

echo -e "\n✅ Users:"
curl -s "$SUPABASE_URL/rest/v1/users?select=id,email,full_name,is_admin&limit=5" \
  -H "apikey: $ANON_KEY" | jq '.' 2>/dev/null | head -40

echo -e "\n✅ Deposits:"
curl -s "$SUPABASE_URL/rest/v1/deposits?limit=5" \
  -H "apikey: $ANON_KEY" | jq '.' 2>/dev/null | head -40

echo -e "\n✅ KYC Submissions:"
curl -s "$SUPABASE_URL/rest/v1/kyc_submissions?limit=5" \
  -H "apikey: $ANON_KEY" | jq '.' 2>/dev/null | head -40

echo -e "\n✅ Withdrawals:"
curl -s "$SUPABASE_URL/rest/v1/withdrawals?limit=5" \
  -H "apikey: $ANON_KEY" | jq '.' 2>/dev/null | head -40

echo -e "\n✅ Investments:"
curl -s "$SUPABASE_URL/rest/v1/investments?limit=5" \
  -H "apikey: $ANON_KEY" | jq '.' 2>/dev/null | head -40
