#!/bin/bash
# Test Cloudflare API Token Permissions for FocusBro Deployment
# Run this script locally to verify your token works before updating GitHub

echo "🔍 Testing Cloudflare API Token Permissions"
echo "=========================================="

# Check if token is provided
if [ -z "$1" ]; then
    echo "❌ Usage: $0 <your-api-token>"
    echo ""
    echo "Get your token from: https://dash.cloudflare.com/profile/api-tokens"
    echo "Example: $0 eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
    exit 1
fi

TOKEN="$1"
echo "Testing token: ${TOKEN:0:20}..."

# Test 1: Token validity
echo ""
echo "1️⃣ Testing token validity..."
TOKEN_VALID=$(curl -s "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.success // false')

if [ "$TOKEN_VALID" = "true" ]; then
    echo "✅ Token is valid"
else
    echo "❌ Token is invalid or expired"
    exit 1
fi

# Test 2: Account access
echo ""
echo "2️⃣ Testing account access..."
ACCOUNT_ID=$(curl -s "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id // "NO_ACCESS"')

if [ "$ACCOUNT_ID" = "NO_ACCESS" ]; then
    echo "❌ No account access"
    exit 1
else
    echo "✅ Account access: $ACCOUNT_ID"
fi

# Test 3: Workers access
echo ""
echo "3️⃣ Testing Workers permissions..."
WORKERS_TEST=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/scripts" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.success // false')

if [ "$WORKERS_TEST" = "true" ]; then
    echo "✅ Workers access: OK"
else
    echo "❌ Workers access: FAILED"
    echo "   Token needs: Account > Cloudflare Workers > Edit"
fi

# Test 4: D1 access
echo ""
echo "4️⃣ Testing D1 permissions..."
D1_TEST=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/d1/database" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X GET | jq -r '.success // false')

if [ "$D1_TEST" = "true" ]; then
    echo "✅ D1 access: OK"
else
    echo "❌ D1 access: FAILED"
    echo "   Token needs: Account > D1 > Edit"
fi

# Test 5: KV access
echo ""
echo "5️⃣ Testing KV permissions..."
KV_TEST=$(curl -s "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/storage/kv/namespaces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.success // false')

if [ "$KV_TEST" = "true" ]; then
    echo "✅ KV access: OK"
else
    echo "❌ KV access: FAILED"
    echo "   Token needs: Account > KV Storage > Edit"
fi

# Test 6: Zone access (focusbro.net)
echo ""
echo "6️⃣ Testing zone permissions..."
# First find the zone ID for focusbro.net
ZONE_ID=$(curl -s "https://api.cloudflare.com/client/v4/zones?name=focusbro.net" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id // "NOT_FOUND"')

if [ "$ZONE_ID" = "NOT_FOUND" ]; then
    echo "⚠️  focusbro.net zone not found or no zone access"
    echo "   This is OK if you're not using custom domain routing"
else
    echo "✅ Zone access: focusbro.net ($ZONE_ID)"
fi

echo ""
echo "🎯 SUMMARY"
echo "========="
echo "If all tests above show ✅, your token is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Update CLOUDFLARE_API secret in GitHub Actions"
echo "2. Push any change to trigger deployment"
echo "3. Check: https://github.com/adrper79-dot/focusbro/actions"
echo ""
echo "Token tested: ${TOKEN:0:20}..."