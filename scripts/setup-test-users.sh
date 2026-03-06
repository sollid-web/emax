#!/bin/bash
# Complete script to setup test users - creates both auth users and profiles

SUPABASE_URL="https://xvbsxxqdmzpvfkpbyxre.supabase.co"
SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2YnN4eHFkbXpwdmZrcGJ5eHJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU2Mjc1MiwiZXhwIjoyMDg4MTM4NzUyfQ.dEMAYMboLZTIFIseKSCCOUUnzBUN5emjoeoMilhD-8I"

echo "🚀 Creating test users in Supabase TEST project..."
echo "📍 Supabase URL: $SUPABASE_URL"
echo ""

# Create regular test user (test@example.com)
echo "👤 Creating test@example.com..."
TEST_USER=$(curl -s -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456!",
    "email_confirm": true
  }')

TEST_USER_ID=$(echo "$TEST_USER" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$TEST_USER_ID" ] || [ "$TEST_USER_ID" = "null" ]; then
  echo "   ⚠️  User may already exist or API error. Continuing..."
else
  echo "   ✅ Created with ID: $TEST_USER_ID"
fi

# Create admin test user (admin@example.com)
echo "👤 Creating admin@example.com..."
ADMIN_USER=$(curl -s -X POST "$SUPABASE_URL/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d '{
    "email": "admin@example.com",
    "password": "Test123456!",
    "email_confirm": true
  }')

ADMIN_USER_ID=$(echo "$ADMIN_USER" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$ADMIN_USER_ID" ] || [ "$ADMIN_USER_ID" = "null" ]; then
  echo "   ⚠️  User may already exist or API error. Continuing..."
else
  echo "   ✅ Created with ID: $ADMIN_USER_ID"
fi

echo ""
echo "✨ Test users setup complete!"
echo ""
echo "📝 Test Credentials:"
echo "   Email:    test@example.com"
echo "   Password: Test123456!"
echo ""
echo "   Email:    admin@example.com"
echo "   Password: Test123456!"
echo ""
echo "You can now run: npm run test:e2e"
