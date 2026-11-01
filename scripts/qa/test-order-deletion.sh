#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
CONTAINER_ID=""

cleanup() {
  if [[ -n "$CONTAINER_ID" ]]; then
    docker rm -f -v "$CONTAINER_ID" >/dev/null
  fi
}
trap cleanup EXIT

DB_PASSWORD="$(openssl rand -hex 24)"
CONTAINER_ID="$(docker run -d \
  -e POSTGRES_PASSWORD="$DB_PASSWORD" \
  -e POSTGRES_DB=order_deletion_test \
  -p 127.0.0.1::5432 \
  postgres:16-alpine)"

ready=false
for ((attempt = 0; attempt < 60; attempt++)); do
  if docker exec "$CONTAINER_ID" pg_isready -U postgres -d order_deletion_test >/dev/null 2>&1; then
    ready=true
    break
  fi
  sleep 1
done
if [[ "$ready" != true ]]; then
  echo "PostgreSQL test database did not become ready" >&2
  docker logs "$CONTAINER_ID" >&2
  exit 1
fi

DB_PORT="$(docker port "$CONTAINER_ID" 5432/tcp | cut -d: -f2)"
export ORDER_DELETE_TEST_DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@127.0.0.1:${DB_PORT}/order_deletion_test"
DATABASE_URL="$ORDER_DELETE_TEST_DATABASE_URL" npm run prisma:migrate:deploy --prefix backend
npm run prisma:generate --prefix backend

echo "Testing order deletion without the optional payment schema"
npm test --prefix backend -- src/controllers/orderDeletion.integration.test.ts src/services/orderService.test.ts

for migration in \
  backend/modules/payment/migrations/001_initial.sql \
  backend/modules/payment/migrations/002_payment_spec.sql \
  backend/modules/payment/migrations/003_tenant_id.sql \
  backend/modules/payment/migrations/004_tenant_events_audit.sql; do
  docker exec -i "$CONTAINER_ID" psql -U postgres -d order_deletion_test \
    -v ON_ERROR_STOP=1 -q < "$migration"
done

echo "Testing order deletion with payment evidence"
npm test --prefix backend -- src/controllers/orderDeletion.integration.test.ts src/services/orderService.test.ts
