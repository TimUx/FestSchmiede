#!/usr/bin/env bash
# Gemeinsame Postgres-Container-Erkennung (Compose + Swarm)

resolve_postgres_container() {
  if [[ -n "${POSTGRES_CONTAINER:-}" ]]; then
    printf '%s' "$POSTGRES_CONTAINER"
    return 0
  fi

  local stack="${STACK_NAME:-festschmiede}"
  local name

  name=$(docker ps --format '{{.Names}}' | grep -E "^${stack}_postgres\\.[0-9]+" | head -1) || true
  if [[ -n "$name" ]]; then
    printf '%s' "$name"
    return 0
  fi

  if docker ps --format '{{.Names}}' | grep -qx 'festschmiede-postgres'; then
    printf '%s' 'festschmiede-postgres'
    return 0
  fi

  printf '%s' 'festschmiede-postgres'
}

postgres_container_running() {
  local container="$1"
  docker ps --format '{{.Names}}' | grep -qx "$container"
}

wait_for_postgres_ready() {
  local timeout="${1:-90}"
  local container="" i

  for ((i=1; i<=timeout; i++)); do
    container="$(resolve_postgres_container)"
    if postgres_container_running "$container"; then
      if docker exec "$container" pg_isready -U "${POSTGRES_USER:-festschmiede}" -d "${POSTGRES_DB:-festschmiede}" >/dev/null 2>&1; then
        printf '%s' "$container"
        return 0
      fi
    fi
    sleep 1
  done

  return 1
}

pause_app_services_for_db_restore() {
  local stack="${STACK_NAME:-festschmiede}"

  if [[ "${DEPLOYMENT_MODE:-}" == "swarm" ]]; then
    docker service scale "${stack}_backend=0" "${stack}_frontend=0" >>/dev/null 2>&1 || true
    sleep 3
    return 0
  fi

  docker compose -f docker-compose.yml stop backend frontend >>/dev/null 2>&1 || true
  sleep 2
}

terminate_db_connections() {
  local container="$1"
  local db="${POSTGRES_DB:-festschmiede}"
  local user="${POSTGRES_USER:-festschmiede}"

  docker exec "$container" psql -U "$user" -d postgres -v ON_ERROR_STOP=0 -c \
    "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${db}' AND pid <> pg_backend_pid();" \
    >/dev/null 2>&1 || true
}

recreate_target_database() {
  local container="$1"
  local db="${POSTGRES_DB:-festschmiede}"
  local user="${POSTGRES_USER:-festschmiede}"

  terminate_db_connections "$container"

  docker exec "$container" psql -U "$user" -d postgres -v ON_ERROR_STOP=1 <<-SQL
DROP DATABASE IF EXISTS "${db}";
CREATE DATABASE "${db}" OWNER "${user}";
SQL
}
