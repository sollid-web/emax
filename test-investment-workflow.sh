#!/bin/bash
set -e
BASE=http://localhost:3000

# create user & login
EMAIL=testinvest$(date +%s)@example.com
PASSWORD=Invest123
FULL="Invest User"

REG=$(curl -s -X POST $BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\",\"password\": \"$PASSWORD\",\"fullname\": \"$FULL\"}")
echo "registered: $REG"
TOKEN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\",\"password\": \"$PASSWORD\"}" | grep -o '"access_token":"[^\"]*' | head -1 | cut -d'"' -f4)
echo "token start ${TOKEN:0:20}..."

# give user some balance via deposit request (cookie auth)
RESP=$(curl -s -X POST $BASE/api/deposits/request \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-auth-token=$TOKEN" \
  -d '{"amount":1000,"currency":"BTC","wallet_address_used":"fake"}')
echo "user deposit request: $RESP"
DEPOSIT_ID=$(echo $RESP | jq -r '.deposit.id')
echo "deposit id $DEPOSIT_ID"

# admin approve deposit
ADMIN=$(curl -s -X POST $BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin-workflow@test.com","password":"Admin@123456"}')
ADMIN_TOKEN=$(echo $ADMIN | grep -o '"access_token":"[^\"]*' | head -1 | cut -d'"' -f4)
echo "admin token start ${ADMIN_TOKEN:0:20}..."

APP=$(curl -s -X POST $BASE/api/admin/deposit-approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"deposit_id\": \"$DEPOSIT_ID\", \"status\": \"approved\"}")
echo "approve resp: $APP"

# KYC approve (so user can invest)
KYC1=$(curl -s -X POST $BASE/api/kyc/submit \
  -H "Authorization: Bearer $TOKEN" \
  -F firstName=Foo -F lastName=Bar -F dateOfBirth=1990-01-01 -F country=USA \
  -F city=NY -F postalCode=10001 -F address=123 -F idType=passport -F idNumber=P1)
echo "kyc submit: $KYC1"

KYC_LIST=$(curl -s -X GET $BASE/api/admin/kyc-list -H "Authorization: Bearer $ADMIN_TOKEN")
KYC_ID=$(echo $KYC_LIST | jq -r '.submissions[0].id')
echo "kyc id $KYC_ID"

KYC_APP=$(curl -s -X POST $BASE/api/admin/kyc-approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d "{\"kyc_id\": \"$KYC_ID\", \"status\": \"approved\"}")
echo "kyc approved: $KYC_APP"

# find a plan id
PLAN=$(curl -s $BASE/api/trading-plans | jq -r '.plans[0].id')
echo "plan $PLAN"

# purchase investment
echo "purchasing investment"
INV=$(curl -s -X POST $BASE/api/investments/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"plan_id\": \"$PLAN\", \"amount\": 500}")
echo "investment resp: $INV"
