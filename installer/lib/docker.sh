#!/usr/bin/env bash
# FestSchmiede Installer – Docker-Installation und -Betrieb

install_docker_if_missing() {
  [[ "${SYS_DETECT[docker_installed]}" == "yes" ]] && return 0

  log_info "Docker nicht gefunden – Installation anbieten"
  if ! tui_yesno "Docker installieren" "Docker ist nicht installiert.

Soll Docker jetzt installiert werden?
(Unterstützt: Debian/Ubuntu via get.docker.com)"; then
    log_error "Docker erforderlich – Installation abgebrochen"
    return 1
  fi

  log_info "Installiere Docker..."
  if curl -fsSL https://get.docker.com | sh >>"$LOG_FILE" 2>&1; then
    SYS_DETECT[docker_installed]="yes"
    SYS_DETECT[docker_version]="$(docker --version 2>/dev/null)"
    SYS_DETECT[compose_installed]="yes"
    log_info "Docker erfolgreich installiert"
    return 0
  fi

  log_error "Docker-Installation fehlgeschlagen"
  return 1
}

compose_pull() {
  log_info "Lade Docker-Images..."
  (cd "$INSTALL_DIR" && "${COMPOSE_CMD[@]}" "${COMPOSE_FILES[@]}" pull) >>"$LOG_FILE" 2>&1
}

compose_up() {
  local profiles=()
  if [[ "${CFG[USE_REDIS]:-no}" == "internal" || "${CFG[USE_REDIS]:-no}" == "yes" ]]; then
    profiles+=(--profile redis)
  fi

  log_info "Starte Container..."
  log_info "Compose: ${COMPOSE_CMD[*]} ${COMPOSE_FILES[*]} ${profiles[*]}"
  (cd "$INSTALL_DIR" && "${COMPOSE_CMD[@]}" "${COMPOSE_FILES[@]}" "${profiles[@]}" up -d) >>"$LOG_FILE" 2>&1
}

compose_down() {
  log_info "Stoppe Container..."
  (cd "$INSTALL_DIR" && "${COMPOSE_CMD[@]}" "${COMPOSE_FILES[@]}" down) >>"$LOG_FILE" 2>&1 || true
}

reset_postgres_volume_if_requested() {
  [[ "${CFG[RESET_POSTGRES_VOLUME]:-}" == "yes" ]] || return 0
  local vol="${CFG[POSTGRES_VOLUME_NAME]:-${SYS_DETECT[postgres_volume_name]:-}}"
  [[ -n "$vol" ]] || return 0

  log_info "Entferne PostgreSQL-Volume: ${vol}"
  compose_down
  if ! docker volume rm "$vol" >>"$LOG_FILE" 2>&1; then
    log_error "PostgreSQL-Volume konnte nicht entfernt werden: ${vol}"
    return 1
  fi
  SYS_DETECT[postgres_volume]="no"
  SYS_DETECT[postgres_volume_name]=""
  return 0
}

container_health_ok() {
  local name="$1"
  local status
  status=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$name" 2>/dev/null || echo "")
  [[ "$status" == "healthy" ]]
}

wait_for_health() {
  local timeout="${1:-180}"
  local backend_container="${CFG[BACKEND_CONTAINER]:-festschmiede-backend}"
  local frontend_container="${CFG[FRONTEND_CONTAINER]:-festschmiede-frontend}"
  log_info "Warte auf Container-Health (max. ${timeout}s)..."

  local i
  for ((i=1; i<=timeout; i++)); do
    tui_gauge "Installation" $((i * 50 / timeout)) "Warte auf Backend... (${i}s)"
    if container_health_ok "$backend_container"; then
      log_info "Backend bereit nach ${i}s (Container: ${backend_container})"
      break
    fi
    [[ $i -eq $timeout ]] && { log_error "Backend-Timeout (Container: ${backend_container})"; return 1; }
    sleep 1
  done

  for ((i=1; i<=60; i++)); do
    tui_gauge "Installation" $((50 + i * 50 / 60)) "Warte auf Frontend... (${i}s)"
    if container_health_ok "$frontend_container"; then
      log_info "Frontend bereit nach ${i}s (Container: ${frontend_container})"
      return 0
    fi
    sleep 1
  done

  log_warn "Frontend-Container nicht healthy (${frontend_container}) — prüfen Sie Traefik/DNS falls Reverse Proxy aktiv"
  return 0
}

run_installation() {
  local step=0
  local total=6

  tui_gauge "Installation" 0 "Vorbereitung..."
  install_docker_if_missing || return 1
  step=$((step+1))

  if [[ "$INSTALL_MODE" != "config" ]]; then
    tui_gauge "Installation" $((step*100/total)) "Generiere Konfiguration..."
    generate_compose_override
    generate_env_file
    build_compose_files
    step=$((step+1))

    tui_gauge "Installation" $((step*100/total)) "Lade Images..."
    compose_pull || return 1
    step=$((step+1))

    tui_gauge "Installation" $((step*100/total)) "Datenbank-Backup..."
    run_pre_migration_backup || return 1
    step=$((step+1))

    tui_gauge "Installation" $((step*100/total)) "Starte Container..."
    reset_postgres_volume_if_requested || return 1
    compose_up || return 1
    step=$((step+1))

    tui_gauge "Installation" $((step*100/total)) "Health-Check..."
    wait_for_health || return 1
  else
    generate_env_file
    build_compose_files
    compose_up || return 1
  fi

  tui_gauge "Installation" 100 "Abgeschlossen"
  log_info "Installation erfolgreich abgeschlossen"
  return 0
}

docker_status_report() {
  local s="" containers
  s+="Container:"
  containers=$(docker ps --format '  {{.Names}}: {{.Status}}' 2>/dev/null | grep -E 'vereins-|festschmiede' || echo '  (keine)')
  s+=$'\n'"${containers}"
  s+=$'\n\n'"Health:"
  if curl -fsS http://localhost:3001/api/health >/dev/null 2>&1; then
    s+=$'\n'"  Backend:  OK"
  else
    s+=$'\n'"  Backend:  nicht erreichbar"
  fi
  printf '%s' "$s"
}
