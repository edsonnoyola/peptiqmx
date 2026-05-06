#!/bin/bash
set -e

if [ -z "$1" ]; then echo "Uso: $0 <user_token>"; exit 1; fi
USER_TOKEN="$1"
source "$(dirname "$0")/../.peptiq-meta-creds"

echo "→ Step 1: Long-lived exchange..."
LONG_RESP=$(curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${USER_TOKEN}")
LONG_TOKEN=$(echo "$LONG_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))")
[ -z "$LONG_TOKEN" ] && { echo "FAIL: $LONG_RESP"; exit 1; }
echo "$LONG_TOKEN" > "$(dirname "$0")/../.peptiq-user-longlived"
chmod 600 "$(dirname "$0")/../.peptiq-user-longlived"
echo "   ✓ Long-lived saved"

echo ""
echo "→ Step 2a: Trying direct page query (fields=access_token)..."
DIRECT=$(curl -s "https://graph.facebook.com/v21.0/${META_PAGE_ID}?fields=access_token,name&access_token=${LONG_TOKEN}")
echo "$DIRECT" | python3 -m json.tool

PAGE_TOKEN=$(echo "$DIRECT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))")

if [ -n "$PAGE_TOKEN" ]; then
  echo "$PAGE_TOKEN" > "$(dirname "$0")/../.peptiq-page-token"
  chmod 600 "$(dirname "$0")/../.peptiq-page-token"
  echo "   ✓ Page Token guardado"
else
  echo ""
  echo "→ Step 2b: Listando businesses..."
  BIZ=$(curl -s "https://graph.facebook.com/v21.0/me/businesses?access_token=${LONG_TOKEN}")
  echo "$BIZ" | python3 -m json.tool

  echo ""
  echo "→ Step 2c: Listando todas las páginas del negocio..."
  BIZ_ID=$(echo "$BIZ" | python3 -c "import sys,json; d=json.load(sys.stdin); pages=d.get('data',[]); print(pages[0]['id'] if pages else '')")
  if [ -n "$BIZ_ID" ]; then
    OWNED=$(curl -s "https://graph.facebook.com/v21.0/${BIZ_ID}/owned_pages?fields=id,name,access_token&access_token=${LONG_TOKEN}")
    echo "$OWNED" | python3 -m json.tool

    PEPTIQ_TOKEN=$(echo "$OWNED" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for p in d.get('data', []):
    if 'peptiq' in p.get('name','').lower():
        print(p.get('access_token',''))
        break
")
    if [ -n "$PEPTIQ_TOKEN" ]; then
      echo "$PEPTIQ_TOKEN" > "$(dirname "$0")/../.peptiq-page-token"
      chmod 600 "$(dirname "$0")/../.peptiq-page-token"
      echo "   ✓ Page Token de Peptiq MX guardado vía business owned_pages"
    fi
  fi
fi

echo ""
if [ -f "$(dirname "$0")/../.peptiq-page-token" ]; then
  TOKEN=$(cat "$(dirname "$0")/../.peptiq-page-token")
  echo "→ Verificando con content_publishing_limit..."
  curl -s "https://graph.facebook.com/v21.0/${META_IG_USER_ID}/content_publishing_limit?fields=quota_usage,config&access_token=${TOKEN}" | python3 -m json.tool
  echo ""
  echo "✅ DONE. Token preview: ${TOKEN:0:25}... (${#TOKEN} chars)"
fi
