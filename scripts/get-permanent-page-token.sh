#!/bin/bash
# Usage: ./get-permanent-page-token.sh "EAAuserTokenHere..."
set -e

if [ -z "$1" ]; then
  echo "ERROR: Pasa el user token como argumento"
  echo "Uso: $0 \"EAA...\""
  exit 1
fi

USER_TOKEN="$1"
source "$(dirname "$0")/../.peptiq-meta-creds"

echo "→ Step 1: Intercambiando short-lived por long-lived (60 días)..."
LONG_RESP=$(curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${USER_TOKEN}")

LONG_TOKEN=$(echo "$LONG_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token','ERROR: '+json.dumps(d)))")

if [[ "$LONG_TOKEN" == ERROR* ]]; then
  echo "$LONG_TOKEN"
  exit 1
fi
echo "   ✓ Long-lived token obtenido"

echo "→ Step 2: Buscando Page Token de Peptiq MX (este NUNCA expira)..."
PAGES=$(curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=${LONG_TOKEN}")

PAGE_TOKEN=$(echo "$PAGES" | python3 -c "
import sys, json
d = json.load(sys.stdin)
pages = d.get('data', [])
peptiq = next((p for p in pages if 'peptiq' in p.get('name','').lower()), None)
if not peptiq:
    print('ERROR: No Peptiq page. Pages:', [p['name'] for p in pages])
else:
    print(peptiq['access_token'])
")

if [[ "$PAGE_TOKEN" == ERROR* ]]; then
  echo "$PAGE_TOKEN"
  exit 1
fi

echo "$PAGE_TOKEN" > "$(dirname "$0")/../.peptiq-page-token"
chmod 600 "$(dirname "$0")/../.peptiq-page-token"

echo "   ✓ Page Token PERMANENTE guardado en .peptiq-page-token"
echo ""
echo "✅ LISTO. Nunca más popups de Facebook."
echo "   Token preview: ${PAGE_TOKEN:0:30}... (${#PAGE_TOKEN} chars)"

# Verify it works
echo ""
echo "→ Verificando con content_publishing_limit..."
VERIFY=$(curl -s "https://graph.facebook.com/v21.0/${META_IG_USER_ID}/content_publishing_limit?fields=quota_usage,config&access_token=${PAGE_TOKEN}")
echo "$VERIFY" | python3 -m json.tool
