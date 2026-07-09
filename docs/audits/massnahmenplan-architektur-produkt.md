# Maßnahmenplan — Architektur- & Produktreview

**Basis:** [independent-architecture-product-review.md](./independent-architecture-product-review.md) (2026-07-09)  
**Leitprinzip:** *Wenn ein Vereinshelfer es am Veranstaltungstag unter Stress nicht versteht, gehört es nicht in die Hauptoberfläche.*

Die Plattform ist technisch überdurchschnittlich — aber für die Zielgruppe noch zu „Plattform“ und zu wenig „boring reliable“. Dieser Plan ordnet Maßnahmen nach Dringlichkeit und hält **Einfachheit** über Feature-Tiefe.

---

## Kurzfassung der Bewertung

| Bereich | Score | Kernbotschaft |
|--------|------:|---------------|
| Architektur | 6/10 | Modularer Monolith passt — zu viele Plattform-Abstraktionen für v1 |
| Produkt | 7/10 | Bestell-/Küchen-/Abhol-Flows stark — Admin driftet Richtung Entwickler-UI |
| UX | 6/10 | Touch-Mitarbeiter-UI gut — Admin braucht geführte Presets |
| Sicherheit | 6/10 | Grundlagen + Runbook; Session-Revocation & Status-Token offen |
| Release | 8/10 | 1.0 mit Migrationen, Backup/Restore, OSS-Vorlagen |

**Empfehlung des Reviews:** Kein stabiles öffentliches 1.0 ohne Migration, Auth-Härtung, Status-Privacy und Admin-Vereinfachung.

---

## Leitentscheidungen (vor Einzelmaßnahmen)

1. **Extern „Funktionen“, intern „Module“** — Nutzer sehen keine Lifecycle-Begriffe (installieren, aktivieren, Health).
2. **Geführte Einrichtung statt Schema-Explorer** — Setup-Assistent wird Haupteinstieg; generische Settings nur für Fortgeschrittene.
3. **Presets statt Provider-Metadaten** — z. B. „Nur Bar“, „Bar + Karte vor Ort“, „Online-Zahlung“.
4. **Offizielle Module im Image, keine Drittanbieter-Plugins in v1** — SDK/Trust-Modell explizit verschieben.
5. **Produktion langweilig machen** — Migrationen, Backup, Wiederherstellung vor neuen Features.

---

## MUSS — vor stabilem öffentlichem Release

Diese Punkte sind **Release-Blocker** oder **hohes Risiko** (laut Review + Ist-Stand im Repo).

### M1 — Produktions-Migrationen statt `prisma db push` ✅

| | |
|---|---|
| **Problem** | README, ADMIN_GUIDE und Docker-Start nutzen `db push` — kein kontrolliertes Upgrade/Rollback. |
| **Maßnahme** | Prisma Migrate für Core-Schema; Docker-CMD auf `prisma migrate deploy`; Backup **vor** Migration dokumentieren und automatisieren. |
| **Einfachheit** | Für Vereine: ein Befehl „Update mit Backup“ statt Schema-Jargon in der Doku. |
| **Status** | **Umgesetzt** — `backend/prisma/migrations/`, Dockerfile, CI, README/Guides |
| **Referenz** | `docs/OPERATIONS.md`, `docker-compose.yml`, Backend-Dockerfile |

### M2 — Öffentlicher Bestellstatus nicht erratbar machen

| | |
|---|---|
| **Problem** | Status-URLs mit Order-ID sind enumerierbar → Datenschutzrisiko. |
| **Maßnahme** | Zufälliges Lookup-Token (getrennt von Anzeigenummer); Status-Abfrage nur mit Token + Nachname (oder vergleichbarer zweiter Faktor). |
| **Einfachheit** | Kunde bekommt Link wie heute — Technik im Hintergrund, keine Extra-Schritte. |
| **Aufwand** | Niedrig–mittel |

### M3 — Session-Lebenszyklus & Widerruf

| | |
|---|---|
| **Problem** | JWT ohne Refresh/Revocation — deaktivierte Nutzer behalten Zugriff bis Ablauf. |
| **Maßnahme** | Refresh-Tokens oder Session-Tabelle; Logout invalidiert serverseitig; optional „Alle Geräte abmelden“ für Admins. |
| **Einfachheit** | Für Nutzer unsichtbar; für Vorstand: „Zugang sofort sperren“ nach Rücktritt. |
| **Aufwand** | Mittel |

### M4 — Upload-Härtung (Logo & Dateien)

| | |
|---|---|
| **Problem** | Statische Uploads ohne strikte Pipeline — XSS/Malware-Risiko. |
| **Maßnahme** | MIME-Check, Größenlimit, sichere Dateinamen, Bild-Re-Encoding, restriktive Static-Headers, keine Ausführung aus Upload-Verzeichnis. |
| **Einfachheit** | Upload-UI unverändert einfach („Logo hochladen“). |
| **Aufwand** | Mittel |

### M5 — Produktions-Checkliste & Recovery-Runbook ✅

| | |
|---|---|
| **Problem** | Backup-Skript existiert, aber kein getesteter Restore-Pfad für Laien. |
| **Maßnahme** | `docs/OPERATIONS.md`: Secrets, HTTPS, Backup, Restore-Übung, Upgrade-Schritte, Health-Checks. Restore-Test in CI. |
| **Einfachheit** | Eine nummerierte Liste: „Vor dem Sommerfest“, „Am Veranstaltungstag“, „Nach dem Event“. |
| **Status** | **Umgesetzt** — `docs/OPERATIONS.md`, `scripts/backup/postgres-restore.sh`, CI smoke test |
| **Hinweis** | `SECURITY.md` um Betreiber-Hinweise erweitert. |

### M6 — Produktkommunikation README ⏭️ übersprungen

| | |
|---|---|
| **Ursprüngliche Idee** | README mit Vorab-Release-Kennzeichnung. |
| **Produktentscheidung** | **Übersprungen** — Release 1.0; Demo-Credentials nur im Developer Guide. |

---

## SOLL — Produkt & UX vereinfachen (höchster Produkt-Hebel)

Hier liegt der größte Gewinn für Vereine — **weniger sichtbare Komplexität**, gleiche Kernfunktion.

### S1 — Einrichtungsassistent zur Hauptschnittstelle ausbauen

| | |
|---|---|
| **Ist** | `SetupWizardPage`: Verein → Veranstaltung → Fertig (3 Schritte). |
| **Soll** | Assistent als Default nach erstem Login: Verein → Event → Speisekarte → **Zahlungsart-Preset** → Mitarbeiter anlegen → Testbestellung. Technische Seiten erst danach sichtbar. |
| **Einfachheit** | „In 10 Minuten startklar“ statt 12 Admin-Menüpunkte erkunden. |
| **Aufwand** | Mittel |

### S2 — „Modulverwaltung“ → „Funktionen“

| | |
|---|---|
| **Ist** | `FeatureModulesPage` mit Install/Aktivieren/Health/Upgrade. |
| **Soll** | Umbenennung und UI-Umbau: große Karten mit Klartext — *Online bezahlen*, *E-Mail-Benachrichtigungen*, *Küchendruck* — jeweils An/Aus + Kurzerklärung. Lifecycle-Aktionen nur im Entwickler-/Support-Modus. |
| **Einfachheit** | Entspricht mentalen Modellen von Vorständen, nicht von npm. |
| **Aufwand** | Mittel |

### S3 — Zahlungs-Presets statt Provider-Administration

| | |
|---|---|
| **Ist** | Payment-Admin mit Tabs (Provider, Methoden, Webhooks, Logs, …). |
| **Soll** | **Ebene 1 (Standard):** drei Presets (nur Bar / Bar+Karte vor Ort / Online). **Ebene 2 (optional):** „Erweiterte Zahlungseinstellungen“ für Stripe-Schlüssel & Testmodus. Logs/Webhooks/Health nur für Support oder versteckt. |
| **Einfachheit** | Kassierer und Vorstand sehen Zahlungs**zustand**, nicht Zahlungs**architektur**. |
| **Aufwand** | Mittel |

### S4 — Admin-Navigation auf Workflows reduzieren

| | |
|---|---|
| **Ist** | Metadaten-getriebene Sidebar (Payment, Notifications, viele Kacheln). |
| **Soll** | Primär: **Übersicht · Veranstaltung · Speisen · Team · Funktionen · Einstellungen**. Sekundär (ausklappbar): erweiterte Einstellungen, Systemstatus. |
| **Einfachheit** | Weniger parallele Wege zum gleichen Ziel. |
| **Aufwand** | Mittel |

### S5 — Kuratierte Settings-Seiten für häufige Fälle

| | |
|---|---|
| **Ist** | `GenericSettingsPage` / Schema-Renderer für Core & Module. |
| **Soll** | Verein, Bestellung, Zahlung, Benachrichtigung: **feste Formulare** mit Hilfetexten in Alltagssprache. Schema-Renderer nur für seltene Modul-Settings. |
| **Einfachheit** | Labels wie „Kunden müssen E-Mail angeben?“ statt technischer Feldkeys. |
| **Aufwand** | Mittel (teilweise schon begonnen) |

### S6 — Platzhalter-Module aus Produkt-UI entfernen

| | |
|---|---|
| **Ist** | Inventory, Loyalty, Voucher, Analytics, … in Modulliste sichtbar. |
| **Soll** | Nur **lieferbare** Funktionen anzeigen (`preview: false` / Filter). Roadmap-Docs für Geplantes. |
| **Einfachheit** | Kein Eindruck halbfertiger Breite. |
| **Aufwand** | Niedrig |

### S7 — Rollen-Presets für Veranstaltungen

| | |
|---|---|
| **Ist** | ADMIN + STAFF, Permissions teilweise deklarativ. |
| **Soll** | Vordefinierte Rollen: **Vorstand · Event-Leitung · Küche · Kasse · Abholung · Nur-Lesen** — beim Anlegen auswählbar, Permissions im Hintergrund. |
| **Einfachheit** | Kein Rechte-Bingo für ehrenamtliche Admins. |
| **Aufwand** | Mittel |

### S8 — Mitarbeiter-UX: Offline & Fehlertoleranz

| | |
|---|---|
| **Ist** | Küche/Abholung touch-optimiert, Reconnect wenig sichtbar. |
| **Soll** | Deutlicher Banner „Verbindung weg — Bestellungen können verzögert sein“; große Abholnummer; Undo/Bestätigung bei kritischen Aktionen. |
| **Einfachheit** | Weniger Panik bei schlechtem WLAN auf dem Festplatz. |
| **Aufwand** | Niedrig–mittel |

### S9 — Kunden-Fehlermeldungen in Klartext

| | |
|---|---|
| **Soll** | Statt technischer API-Fehler: „Online-Bestellung ist geschlossen — bitte an der Theke bestellen.“ Stornierungsfrist beim Bestellen sichtbar erklären. |
| **Aufwand** | Niedrig |

### S10 — Zahlungs- und Bestellstatus trennen (sichtbar)

| | |
|---|---|
| **Problem** | Ein linearer Order-Status vermischt Küche, Zahlung, Abholung. |
| **Soll** | Für Kasse/Abholung klare Anzeige: *Bezahlt (online/bar)* · *Küche: in Arbeit* · *Abholbereit*. |
| **Einfachheit** | Keine Rückfragen an den Vorstand wegen „Status unklar“. |
| **Aufwand** | Mittel |

---

## KANN — Architektur-Reife & langfristige Qualität

Wichtig für Wartbarkeit und Skalierung — **nicht** vor Vereins-UX priorisieren.

### K1 — `platform/` und `module-system/` zusammenführen

Doppelte Pfade (`backend/src/platform` + Compatibility-Re-Exports) bis 1.0 bereinigen. **Intern**, Nutzer merken nichts.

### K2 — Route-Unmount bei deaktivierten Modulen

Deaktiviert = keine erreichbaren Routes (ADR 003, `MIGRATION_PLAN` 2.1).

### K3 — Lifecycle-Begriffe vereinheitlichen

Nur noch **aktiv/inaktiv** nach außen; `enable/disable` vs. `activate/deactivate` intern konsolidieren.

### K4 — Modul-SDK & Plugin-Grenze

Relative Imports aus Modulen in Core abbauen; öffentliches Plugin-Ökosystem erst nach stabilem 1.0.

### K5 — API-Versionierung `/api/v1`

Vor externen Integrationen festlegen oder Pre-1.0-Disclaimer schärfen.

### K6 — Last- & Reconnect-Tests ✅ (Grundlage)

k6-Skript `scripts/qa/load-test.k6.js`: Health, Menü, Bestellburst (ohne Turnstile). WebSocket-Reconnect und Budgets für Tablets: weiter offen.

### K7 — QA-Evidenz ✅ (teilweise)

Negative Authorization-Tests: `tests/api/auth-negative.test.ts` (401 ohne Token, 403 falsche Rolle). Session-Revocation-Test vorbereitet (`it.skip` bis M3). Coverage/a11y: offen.

### K8 — Open-Source-Reife ✅

Issue-Templates, `docs/RELEASE_NOTES_TEMPLATE.md`, `.github/release.yml`, `docs/ROADMAP.md`, `docs/VOLUNTEER_GUIDE.md`.

### K9 — Skalierung (Redis Socket.IO) ✅ (dokumentiert)

In `docs/OPERATIONS.md`: Single-Node für Vereine; Redis nur bei Multi-Instanz.

### K10 — Datenschutz & Aufbewahrung

Kunden-Daten: Löschfristen, Export, DSGVO-Hinweise in Admin (einfache Checkbox-Presets).

---

## Bewusst beibehalten (laut Review)

- Modularer Monolith, kein Microservice-Zoo  
- Single-Tenant pro Verein, Docker Compose  
- Keine Kunden-Registrierung  
- Touch-first Küche & Abholung  
- Screenshots & deutsche UI  
- ADR-/Architektur-Dokumentation  
- CI mit Unit, Integration, E2E, Modul-Szenarien  
- PostgreSQL + Prisma  

---

## Priorisierte Umsetzungsphasen

### Phase A — Vertrauen & Betrieb (4–6 Wochen)

| Prio | ID | Maßnahme | Status |
|-----|-----|----------|--------|
| 1 | M1 | Prisma Migrate + sicheres Upgrade | ✅ |
| 2 | M5 | Backup/Restore-Runbook + Restore-Test | ✅ |
| 3 | M2 | Status-Lookup-Token | offen |
| 4 | M4 | Upload-Härtung | offen |
| 5 | M3 | Session-Revocation | offen |
| 6 | M6 | README-Kommunikation | ⏭️ übersprungen (1.0) |
| — | K6–K8 | Lasttest-Basis, Auth-Negativtests, OSS-Vorlagen | ✅ (teilweise) |

**Ergebnis:** Produktion ist vorhersehbar — „boring“ im positiven Sinne.

### Phase B — Vereinfachung für Vereine (4–8 Wochen, parallel möglich)

| Prio | ID | Maßnahme |
|-----|-----|----------|
| 1 | S1 | Setup-Assistent ausbauen |
| 2 | S2 | Funktionen statt Modulverwaltung |
| 3 | S3 | Zahlungs-Presets |
| 4 | S6 | Platzhalter aus UI |
| 5 | S4 | Navigation straffen |
| 6 | S5 | Kuratierte Settings |
| 7 | S8, S9 | Mitarbeiter/Kunden-Klartext |

**Ergebnis:** Admin fühlt sich wie Vereinssoftware an, nicht wie eine Plattform-Konsole.

### Phase C — Tiefe & Skalierung (nach 1.0)

K1–K10, insbesondere SDK, API v1, Lasttests, Rollenmodell (S7, S10) vertiefen.

---

## Nicht-Ziele für v1.0 (bewusst verschieben)

- Drittanbieter-Plugin-Marketplace  
- 100+ Module im Registry-Sinne  
- Multi-Instanz-Horizontal-Scaling  
- Generische Schema-Settings als **einzige** Admin-Oberfläche  
- Vollständiges ERP (Lager, Loyalty, Analytics) in der Haupt-UI  

---

## Erfolgskriterien „einfach genug“

Die Plattform ist aus Sicht eines Vereins **einfach genug**, wenn:

1. Ein neuer Vorstand ohne Entwickler-Hilfe in **&lt; 30 Minuten** eine Testveranstaltung mit Speisekarte betreiben kann.  
2. Küchen- und Abhol-Helfer die Oberfläche **ohne Einweisung** am Veranstaltungstag nutzen können.  
3. Admins **keine Begriffe** wie Modul, Lifecycle, Provider, Webhook, Schema sehen müssen — außer sie öffnen bewusst „Erweitert“.  
4. Ein Update **mit dokumentiertem Backup** durchführbar ist, ohne Schema-Befehle zu kennen.  
5. Öffentliche Bestellstatus-Links **nicht erratbar** sind.

---

## Abgleich mit bestehendem `MIGRATION_PLAN.md`

| Review-Maßnahme | Bereits im Migrationsplan |
|-----------------|---------------------------|
| Route-Unmount | Phase 2.1 |
| Stub-Module filtern | Phase 2.8 ≈ S6 |
| Prisma Migrate | Phase 2.7 ≈ M1 |
| Settings Platform | Phase 4 — **für Vereine abschwächen** (S5: kuratiert vor generisch) |
| Permission System | Phase 3 — **als Rollen-Presets** umsetzen (S7) |

**Anpassung der Strategie:** Phasen 4–6 technisch weiterführen, aber **Produkt-Oberfläche** konsequent auf Presets und Assistenten trimmen — Plattform-Komplexität bleibt Implementierungsdetail.

---

*Erstellt: 2026-07-09 · Bezug: Independent Architecture & Product Review*
