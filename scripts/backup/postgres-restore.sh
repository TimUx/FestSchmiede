#!/usr/bin/env bash
# Postgres-Wiederherstellung aus .sql.gz-Backup (M5)
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Verwendung: $0 <backup.sql.gz>" >&2
  echo "Automatisierung: CONFIRM=1 $0 <backup.sql.gz>" >&2
  echo "Dry-Run:       DRY_RUN=1 $0 <backup.sql.gz>" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -f "${ROOT_DIR}/scripts/lib/dotenv.sh" ]]; then
  # shellcheck source=scripts/lib/dotenv.sh
  source "${ROOT_DIR}/scripts/lib/dotenv.sh"
else
  dotenv_unquote_value() {
    local value="$1"
    value="${value%$'\r'}"
    if [[ ${#value} -ge 2 && "$value" == \'*\' ]]; then
      value="${value:1:${#value}-2}"
    elif [[ ${#value} -ge 2 && "$value" == \"*\" ]]; then
      value="${value:1:${#value}-2}"
    fi
    printf '%s' "$value"
  }

  dotenv_export_file() {
    local env_file="$1"
    shift
    local filter_keys=("$@")
    local line key value match k

    [[ -f "$env_file" ]] || return 0

    while IFS= read -r line || [[ -n "$line" ]]; do
      [[ "$line" =~ ^[[:space:]]*# ]] && continue
      [[ "$line" =~ ^[A-Z_][A-Z0-9_]*= ]] || continue
      key="${line%%=*}"
      value="$(dotenv_unquote_value "${line#*=}")"

      if [[ ${#filter_keys[@]} -gt 0 ]]; then
        match=0
        for k in "${filter_keys[@]}"; do
          if [[ "$key" == "$k" ]]; then
            match=1
            break
          fi
        done
        [[ $match -eq 1 ]] || continue
      fi

      printf -v "$key" '%s' "$value"
      export "$key"
    done <"$env_file"
  }
fi

# shellcheck source=scripts/lib/postgres-docker.sh
source "${ROOT_DIR}/scripts/lib/postgres-docker.sh"

dotenv_export_file "${ROOT_DIR}/.env" \
  POSTGRES_USER POSTGRES_DB POSTGRES_CONTAINER STACK_NAME DEPLOYMENT_MODE

BACKUP_FILE="$1"
POSTGRES_USER="${POSTGRES_USER:-festschmiede}"
POSTGRES_DB="${POSTGRES_DB:-festschmiede}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Fehler: Backup-Datei nicht gefunden: $BACKUP_FILE" >&2
  exit 1
fi

CONTAINER="$(resolve_postgres_container)"

if [[ "${DRY_RUN:-}" == "1" ]]; then
  if ! gzip -t "$BACKUP_FILE" 2>/dev/null; then
    echo "Fehler: Backup-Datei ist kein gültiges gzip-Archiv: $BACKUP_FILE" >&2
    exit 1
  fi
  local_size=$(wc -c <"$BACKUP_FILE" | tr -d ' ')
  if [[ "$local_size" -lt 100 ]]; then
    echo "Fehler: Backup-Datei ist zu klein (${local_size} Bytes)" >&2
    exit 1
  fi
  echo "DRY_RUN OK: $BACKUP_FILE (${local_size} Bytes, gzip gültig)"
  echo "Ziel: Container=$CONTAINER DB=$POSTGRES_DB User=$POSTGRES_USER"
  exit 0
fi

if [[ "${CONFIRM:-}" != "1" ]]; then
  echo "WARNUNG: Dies überschreibt die Datenbank '${POSTGRES_DB}' im Container '${CONTAINER}'."
  echo "Backup: ${BACKUP_FILE}"
  read -r -p "Fortfahren? (ja/nein): " answer
  if [[ "$answer" != "ja" ]]; then
    echo "Abgebrochen."
    exit 1
  fi
fi

CONTAINER="$(wait_for_postgres_ready 90 || true)"
if [[ -z "$CONTAINER" ]]; then
  CONTAINER="$(resolve_postgres_container)"
fi

if ! postgres_container_running "$CONTAINER"; then
  echo "Fehler: Postgres-Container '$CONTAINER' läuft nicht." >&2
  echo "→ Prüfen Sie: docker service ps ${STACK_NAME:-festschmiede}_postgres" >&2
  exit 1
fi

cd "$ROOT_DIR"
pause_app_services_for_db_restore

terminate_db_connections "$CONTAINER"

echo "Stelle Datenbank wieder her aus: $BACKUP_FILE"

if ! gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1; then
  echo "Fehler: psql-Restore fehlgeschlagen." >&2
  exit 1
fi

echo "Wiederherstellung abgeschlossen. App-Services neu starten: ./install.sh --repair"
