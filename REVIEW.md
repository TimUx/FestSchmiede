# FestSchmiede – Repository-Review

**Stand:** 2026-09-03  
**Scope:** `backend/`, `frontend/`, `installer/`, `plugins/`, `scripts/`, `tests/`, Docker-/Compose-Dateien, Workflows, Paketmanifeste, `SECURITY.md` und relevante ADRs.

## Zusammenfassung

Die Anwendung hat bereits mehrere wichtige Schutzmaßnahmen: Prisma-/Zod-Nutzung, tenant-scoped Repositories und Socket-Räume, serverseitige Session-Prüfung, Rate-Limits, Helmet, CORS-Allowlist, Upload-Re-Encoding und Stripe-Webhook-Signaturprüfung. Die vorhandenen Tenant- und Payment-Tests sind ein gutes Fundament.

Die größten Risiken liegen derzeit im **sicheren Standardbetrieb**: Die Standard-Compose-Datei startet bei fehlenden Umgebungsvariablen mit bekannten Secrets, der Installer führt ein ungeprüft heruntergeladenes Remote-Skript aus, und der Bootstrap-Installer prüft keine Dateiintegrität. Außerdem ist der produktive Image-/Dependency-Bezug nicht reproduzierbar genug. Diese Punkte sollten vor einem produktiven Rollout behoben werden.

## Findings (nach Schweregrad)

### Kritisch

#### K1 – Bekannte Default-Secrets in der Standard-Compose-Konfiguration

- **Ort:** `docker-compose.yml:7-9, 41-55`
- **Beschreibung:** `POSTGRES_PASSWORD`, `DATABASE_URL` und `JWT_SECRET` verwenden Fallbacks wie `change-me-in-production`; Multi-Tenant ist standardmäßig `false`. Wer die Datei ohne sorgfältig gesetzte `.env` startet, erhält bekannte Datenbank- und JWT-Credentials.
- **Risiko/Impact:** Vollständige Übernahme der Instanz bzw. Entschlüsselung/Manipulation von Sessions; zusätzlich hohes Risiko, dass eine lokale/dev-Konfiguration versehentlich produktiv eingesetzt wird.
- **Vorschlag:** Keine Secret-Fallbacks in produktionsnahen Compose-Dateien; mit `${VAR:?VAR muss gesetzt sein}` hart fehlschlagen oder Docker Secrets/`*_FILE` verwenden. `MULTI_TENANT_ENABLED` für den dokumentierten Produktionspfad explizit erzwingen. Startup-Guards müssen auch den Compose-Pfad abdecken.

#### K2 – Installer führt `curl | sh` ohne Integritätsprüfung aus

- **Ort:** `installer/lib/docker.sh:16-18`
- **Beschreibung:** `https://get.docker.com` wird direkt an `sh` weitergeleitet.
- **Risiko/Impact:** Ein kompromittierter Transport-/Upstream-Inhalt kann beliebigen Code mit Installationsrechten ausführen; der Installer hat keine reproduzierbare oder überprüfbare Lieferkette.
- **Vorschlag:** Distributionseigene Docker-Pakete bzw. das offizielle signierte Docker-Repository verwenden. Falls der Bootstrap beibehalten wird: herunterladen, Signatur/Checksumme verifizieren, erst danach ausführen, mit klarer Version und dokumentiertem Trust-Root.

### Hoch

#### H1 – Bootstrap-Dateien werden ohne Hash-/Signaturprüfung von GitHub Raw geladen

- **Ort:** `install.sh:206-234`
- **Beschreibung:** Manifest und alle darin aufgeführten Dateien werden per `curl -fsSL` geladen; die Quelle/Ref wird zwar geloggt, die Bytes werden aber nicht gegen Checksums oder eine Signatur geprüft.
- **Risiko/Impact:** Manipulierte Release-/Branch-Inhalte können Installer- und Deployment-Code ersetzen. HTTPS allein schützt nicht vor kompromittiertem Repository, falscher Ref oder Supply-Chain-Angriff.
- **Vorschlag:** Versionierte Release-Artefakte mit signiertem Manifest und SHA-256-Prüfung verwenden; Ref auf immutable Commit/Tag pinnen und bei Abweichung abbrechen. Keine frei veränderliche Branch-Quelle als Installationsbasis.

#### H2 – Produktive Images sind mit `latest` und `pull_policy: always` nicht reproduzierbar

- **Ort:** `docker-compose.yml:31-34, 80-83`; `.env.example:8-10`
- **Beschreibung:** Backend und Frontend verwenden standardmäßig `IMAGE_TAG=latest` und ziehen bei jedem Start neu.
- **Risiko/Impact:** Ungeprüfte Änderungen oder rückwärts inkompatible/vulnerable Images können ohne Freigabe ausgerollt werden; Rollback und forensische Zuordnung des laufenden Codes werden erschwert.
- **Vorschlag:** Standardmäßig immutable Release-Tags oder Digests verwenden; `latest` nur ausdrücklich für Entwicklung erlauben. Release-/Installer-Manifest soll Image-Digests und Herkunft protokollieren.

#### H3 – Plugin-Code läuft als vertrauenswürdiger Backend-Code ohne Sandbox

- **Ort:** `backend/src/platform/ModuleLoader.ts:14-45`; `backend/src/platform/ModuleDiscovery.ts`
- **Beschreibung:** Plugins werden aus `PLUGINS_DIR` entdeckt und per `import()`/`createRequire()` in demselben Node-Prozess geladen. Es gibt keine Prozess-, Rechte-, Netzwerk- oder Dateisystem-Isolation.
- **Risiko/Impact:** Ein manipuliertes oder fehlerhaftes Plugin kann Datenbank, Secrets, Tenant-Daten und Host-Dateisystem des Backends lesen oder verändern; ein Plugin-Fehler kann die gesamte Instanz ausfallen lassen.
- **Vorschlag:** Nur signierte, allowlistete Plugin-Artefakte laden, Manifest/API-Version und Berechtigungen prüfen und Plugins in separaten, unprivilegierten Prozessen/Containern mit minimalen Mounts und Netzwerkregeln ausführen. Wenn nur vertrauenswürdige Built-ins unterstützt werden, `PLUGINS_DIR` im Produktionsimage deaktivieren.

#### H4 – Statische CI-Credentials sind in Workflow-Dateien versioniert

- **Ort:** `.github/workflows/quality-assurance.yml:14-25` sowie `nightly.yml` und `release-validation.yml`
- **Beschreibung:** QA-JWT-, Encryption- und Plattformpasswörter stehen als feste Klartextwerte im Repository.
- **Risiko/Impact:** Diese Werte sind öffentlich bzw. für jeden Repository-Leser verfügbar und können bei falscher Wiederverwendung außerhalb isolierter CI-Container zur Authentisierung dienen. Sie sind keine GitHub-Secrets und werden nicht rotiert.
- **Vorschlag:** Pro Lauf zufällige Testwerte erzeugen oder GitHub Actions Secrets/Environment verwenden; eindeutig dokumentieren, dass sie niemals produktiv sind. Artefakte und Logs auf Secret-Leaks prüfen.

### Mittel

#### M1 – Dependency-/Container-Pinning und Audit-Gates sind unvollständig

- **Ort:** `backend/package.json:20-36`, `frontend/package.json:13-22`, `backend/Dockerfile:1,16`, `frontend/Dockerfile:1,19`, `docker-compose*.yml`; `.github/workflows/dependency-review.yml:20-33`
- **Beschreibung:** Direkte npm-Abhängigkeiten nutzen Caret-Ranges, Base-Images und Redis/Postgres/Traefik sind nur bis zu Major/Minor gepinnt; CI bricht erst bei `high` ab. Ein Lockfile ist vorhanden, aber Docker-Builds verwenden `npm install` statt `npm ci`.
- **Risiko/Impact:** Nicht reproduzierbare Builds und verzögerte Reaktion auf moderate Schwachstellen; ein Build kann unerwartet neue Transitivabhängigkeiten aufnehmen.
- **Vorschlag:** Docker mit `npm ci --omit=dev`/`npm ci` bauen, Images auf Patch-Version oder Digest pinnen, regelmäßige Updates automatisieren (Dependabot/Renovate) und Audit-Schwelle/Exceptions bewusst festlegen. Die konkrete CVE-Lage muss beim Release mit `npm audit` gegen die aktuellen Lockfiles geprüft werden.

#### M2 – Installer-Download ist zwar TLS-geschützt, aber Ref- und Host-Trust sind nicht stark gebunden

- **Ort:** `install.sh:210-234`
- **Beschreibung:** Die URL wird aus einer konfigurierten GitHub-Ref zusammengesetzt; ohne signiertes Release-Metadaten ist nicht nachweisbar, dass alle Dateien aus demselben geprüften Release stammen.
- **Risiko/Impact:** Verwechslung von Branch/Tag oder nachträgliche Änderung einzelner Dateien kann zu gemischten, nicht getesteten Installationen führen.
- **Vorschlag:** Release-Manifest atomar laden, Ref/Repository allowlisten und Inhalt vor Installation vollständig verifizieren; partielle Installationen aufräumen.

#### M3 – Rechtstext-HTML wird im Frontend als HTML-Sink gerendert

- **Ort:** `frontend/src/pages/LegalPage.tsx:50-52`, `frontend/src/pages/PlatformDynamicLegalPage.tsx` und `frontend/src/pages/admin/LegalAdminPage.tsx`
- **Beschreibung:** `dangerouslySetInnerHTML` ist ein XSS-Sink. Der Backend-Service `backend/modules/legal/services/HtmlSanitizer.ts:81-107` sanitisiert den vorgesehenen Schreibpfad bereits mit Allowlist, aber das Frontend erzwingt diese Vertrauensgrenze nicht und verlässt sich auf jede API-/Cache-/zukünftige Importquelle.
- **Risiko/Impact:** Bei Umgehung oder späterem neuen Schreibpfad kann administrativ gespeichertes HTML in öffentlichen Seiten Script-/Markup-Injection ermöglichen.
- **Vorschlag:** Sanitization serverseitig als unverzichtbare Invariante für Create/Update **und** Read/Publish sicherstellen; zusätzlich im Frontend nur sanitisiertes, versioniertes Rich-Text-Format akzeptieren. Regressionstests sollten `javascript:`/Event-Attribute und alle drei Renderpfade abdecken.

#### M4 – Refresh-Token-Rotation und Replay-Erkennung sind als Review-Lücke zu verifizieren

- **Ort:** `backend/src/services/sessionService.ts` und Auth-Controller
- **Beschreibung:** Sessions werden serverseitig validiert und widerrufbar gespeichert. Für einen kompromittierten Refresh-Token ist im Review jedoch keine explizite Single-use-Rotation mit Reuse-Erkennung als Sicherheitsinvariante dokumentiert.
- **Risiko/Impact:** Ein gestohlener, noch gültiger Refresh-Token kann bis zum Ablauf wiederverwendet werden.
- **Vorschlag:** Bei jedem Refresh Token rotieren, den alten Hash atomar widerrufen und Wiederverwendung als Session-Familienkompromittierung behandeln; Tests für parallele Refreshes und `revoke-all` ergänzen.

### Niedrig

#### N1 – Security-Dokumentation ist gegenüber der Release-/Support-Realität nicht versioniert

- **Ort:** `SECURITY.md:3-16, 68-80`
- **Beschreibung:** Unterstützte Versionen sind `2.0.x`/`1.5.x`, während die Paketversionen `2.5.6` sind; Statusangaben wie „Phase 8“ enthalten keine Release-/Commit-Zuordnung. Der Meldeweg verweist nur auf das GitHub-Profil.
- **Risiko/Impact:** Sicherheitsfixes können für Nutzer schwer einzuordnen sein; Support- und Disclosure-Erwartungen bleiben unklar.
- **Vorschlag:** Unterstützte Releases und EOL-Daten pflegen, Security-Contact (z. B. private Advisory-Adresse) angeben und Behauptungen mit Release/ADR verknüpfen.

#### N2 – Accessibility-/UX-Nachbesserungen

- **Ort:** `frontend/src/components/AdminLayout.tsx` (Logo-Alttext), `frontend/src/components/PaymentQrCode.tsx` (ARIA-Beschreibung), `frontend/src/contexts/ThemeContext.tsx` (Reduced Motion)
- **Beschreibung:** Die meisten Touch-Ziele, Lade-/Reconnect-Zustände und Lazy-Routen sind gut umgesetzt. Einzelne interaktive bzw. informative Elemente benötigen jedoch bessere Screenreader-Beschriftungen; `prefers-reduced-motion` ist nicht erkennbar berücksichtigt.
- **Risiko/Impact:** Erschwerte Bedienung für Screenreader-Nutzer und Nutzer mit vestibulären Einschränkungen, insbesondere im Admin-/Kassenbetrieb.
- **Vorschlag:** Logo kontextabhängig beschriften, QR-Code mit verständlichem `aria-label`/Alternativaktion versehen und Animationen bei `prefers-reduced-motion: reduce` deaktivieren. Öffentliche Bestellseite mit Tastatur/Screenreader und kleinen Viewports manuell prüfen.

#### N3 – Realtime-Skalierung über mehrere Backend-Instanzen ist konfigurationsabhängig

- **Ort:** `backend/src/socket/index.ts:93-101`; `docker-compose.prod.yml:100-115`
- **Beschreibung:** Es gibt Redis-Konfiguration und tenant-scoped Räume, aber Redis ist ein optionales Profil; ein Redis-Adapter ist im Socket-Setup nicht sichtbar.
- **Risiko/Impact:** Bei mehreren Backend-Replikas können Events nur an Clients derselben Instanz gelangen; Küchen-/Abholanzeigen werden inkonsistent.
- **Vorschlag:** Für Multi-Instance-Betrieb den Socket.IO Redis-Adapter verpflichtend konfigurieren, Health-/Failover-Tests ergänzen und Deployment-Dokumentation klar zwischen Single- und Multi-Instance unterscheiden.

## Explizit geprüfte Bereiche ohne bestätigten kritischen Befund

- **Tenant-Isolation:** Auth-Middleware weist Cross-Tenant-JWTs zurück; Repositories/Schema enthalten umfangreiche Tenant-Indizes und Guard-/Tenant-Tests. Impersonation und jedes neue Repository bleiben besonders regressionsgefährdet.
- **SQL-Injection:** Die gefundenen Raw-Queries nutzen Prisma-Tagged-Templates; daraus wurde kein bestätigter Injection-Befund abgeleitet.
- **Zahlungen:** Stripe ist vorhanden; die Review-Stellen zeigen Webhook-Signaturprüfung und eine Provider-Abstraktion. Es wurde kein Karten-Speicher im eigenen Schema bestätigt. PCI-/Provider-Vertrag und Produktions-Webhooks müssen dennoch organisatorisch geprüft werden.
- **Upload-Schutz:** MIME-Allowlist, Größenlimit, Tenant-Pfad, Re-Encoding und Zugriffsmiddleware sind vorhanden.
- **DB-Indizes:** Für häufige Order-Abfragen existieren zusammengesetzte Indizes in `backend/prisma/schema.prisma:360-369`; ein N+1-Befund muss mit Produktionsprofiling statt nur statischer Suche bewertet werden.
- **Realtime/Offline:** Frontend-Reconnect, Offline-/Degraded-Status und HTTP-Fallback sind vorhanden; echte Offline-Bestellung und Konfliktauflösung sind nicht vollständig ersichtlich.
- **Tests/CI:** Auth-, Authorization-Matrix-, Tenant-Guard-, Payment-Tenant-Guard-, E2E- und Installer-Tests existieren. Explizite Tests für Refresh-Replay, Plugin-Sandbox, Compose-Default-Secret-Fehler und signierte Installer-Artefakte fehlen.

## Priorisierte Maßnahmen

1. K1: Compose ohne gesetzte Produktionssecrets hart fehlschlagen lassen und Defaults entfernen.
2. K2/H1: Installer-Lieferkette auf signierte, immutable Release-Artefakte mit Hashprüfung umstellen.
3. H2: Images auf Digests/immutable Tags pinnen und Docker-Builds reproduzierbar machen.
4. H3: Plugin-Vertrauensmodell festlegen; untrusted Plugins nicht im Backend-Prozess ausführen.
5. H4/M1: CI-Testwerte entkoppeln und Dependency-/Container-Scanning mit dokumentierten Schwellen etablieren.

Die fünf priorisierten Punkte sind sicherheits- und lieferkettenrelevant; sie sollten als separate, reviewbare PRs mit Deployment-/Rollback-Tests umgesetzt werden. In diesem Audit wurden bewusst keine riskanten Produktionsänderungen direkt vorgenommen.
