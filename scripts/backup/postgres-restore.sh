#!/usr/bin/env bash
# Postgres-Wiederherstellung aus .sql.gz-Backup (M5)
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Verwendung: $0 <backup.sql.gz>" >&2
  echo "Automatisierung: CONFIRM=1 $0 <backup.sql.gz>" >&2
  exit 1
fi

BACKUP_FILE="$1"
POSTGRES_USER="${POSTGRES_USER:-verein}"
POSTGRES_DB="${POSTGRES_DB:-vereinsbestellung}"
CONTAINER="${POSTGRES_CONTAINER:-vereins-postgres}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Fehler: Backup-Datei nicht gefunden: $BACKUP_FILE" >&2
  exit 1
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

echo "Stelle Datenbank wieder her aus: $BACKUP_FILE"

gunzip -c "$BACKUP_FILE" | docker exec -i "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1

echo "Wiederherstellung abgeschlossen. Backend neu starten: docker compose restart backend"
