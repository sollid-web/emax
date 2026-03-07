#!/bin/bash

SUPABASE_URL="https://hhtdnihdjnlgyhnnvvly.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhodGRuaWhkam5sZ3lobm52dmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzOTk3NTUsImV4cCI6MjA4Nzk3NTc1NX0.33biRh9hwHOa6huyEo4w79JeR1Jcz59yAelphrcUvKk"

echo "🔍 Checking Supabase Database Schema"
echo "===================================="

# 1. Get all tables
echo -e "\n📋 All tables in public schema:"
curl -s -X POST "$SUPABASE_URL/rest/v1/rpc/query_schema" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"sql":"SELECT table_name FROM information_schema.tables WHERE table_schema = '\''public'\'' ORDER BY table_name;"}' 2>/dev/null || echo "Using direct query method..."

# Try direct SQL using Supabase SQL endpoint
echo -e "\n📊 Users table structure:"
curl -s "$SUPABASE_URL/rest/v1/users?limit=0" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" \
  -w "\n" -v 2>&1 | grep -i "< " | head -20

# Get table info via introspection
echo -e "\n🔎 Introspection query:"
curl -s -X GET "$SUPABASE_URL/rest/v1/?apiversion=1" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" 2>/dev/null | jq . | head -100 || echo "Could not fetch schema via introspection"

# Check if deposits table exists by trying to query it
echo -e "\n✅ Testing table access:"
echo "Deposits table (sample):"
curl -s "$SUPABASE_URL/rest/v1/deposits?limit=1" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" 2>/dev/null | jq . 

echo -e "\nKYC Submissions table (sample):"
curl -s "$SUPABASE_URL/rest/v1/kyc_submissions?limit=1" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" 2>/dev/null | jq .

echo -e "\nWithdrawals table (sample):"
curl -s "$SUPABASE_URL/rest/v1/withdrawals?limit=1" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" 2>/dev/null | jq .

echo -e "\nInvestments table (sample):"
curl -s "$SUPABASE_URL/rest/v1/investments?limit=1" \
  -H "Authorization: Bearer $SUPABASE_KEY" \
  -H "apikey: $SUPABASE_KEY" 2>/dev/null | jq .
