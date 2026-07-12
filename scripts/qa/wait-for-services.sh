#!/usr/bin/env bash
set -euo pipefail

API_URL="${QA_PLATFORM_API_BASE:-http://localhost:3001/api}"
FRONTEND_URL="${QA_FRONTEND_BASE:-http://localhost:5173}"
TIMEOUT="${QA_WAIT_TIMEOUT:-180}"

echo "Warte auf Backend: $API_URL/health"
for ((i=1; i<=TIMEOUT; i++)); do
  if curl -sf "$API_URL/health" >/dev/null; then
    echo "Backend bereit nach ${i}s"
    break
  fi
  if [[ $i -eq $TIMEOUT ]]; then
    echo "Backend nicht erreichbar" >&2
    exit 1
  fi
  sleep 1
done

echo "Warte auf Frontend: $FRONTEND_URL"
for ((i=1; i<=TIMEOUT; i++)); do
  if curl -sf "$FRONTEND_URL" >/dev/null; then
    echo "Frontend bereit nach ${i}s"
    break
  fi
  if [[ $i -eq $TIMEOUT ]]; then
    echo "Frontend nicht erreichbar" >&2
    exit 1
  fi
  sleep 1
done

ROUTING_URL="${FRONTEND_URL}/api/public/routing-config?frontendPath=/"
echo "Prüfe Frontend→Backend-Proxy: $ROUTING_URL"
for ((i=1; i<=60; i++)); do
  if curl -sf "$ROUTING_URL" | grep -q '"scope"'; then
    echo "Routing-API über Frontend nach ${i}s erreichbar"
    exit 0
  fi
  sleep 1
done

echo "Routing-API über Frontend nicht erreichbar (nginx→backend)" >&2
exit 1
