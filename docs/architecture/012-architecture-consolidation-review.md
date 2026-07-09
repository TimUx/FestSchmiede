# ADR-012: Architektur-Konsolidierungsreview

| Feld | Wert |
|------|------|
| **Status** | Accepted |
| **Datum** | 2026-07-09 |
| **Bezug** | `docs/audits/architecture-consolidation-report.md` |

## Kontext

Nach der Platform-Erweiterung (Module System, Settings Platform, Admin-UI-Metadaten) lag eine externe Architektur- und Produktkritik vor. Dieses ADR dokumentiert die **bewussten Entscheidungen** des Reviews — nicht jede theoretische Vereinfachung wurde übernommen.

Leitprinzip: *Komplexität gehört in die Implementierung, nicht in die Benutzeroberfläche.*

## Entscheidungen

### 1. Plattformkomplexität vs. Funktionsumfang

**Bewertung: Trifft teilweise zu**

Die Backend-Architektur (EventBus, Registry, ModuleManager, SettingsService, Permission Platform, HealthService) ist für den aktuellen Funktionsumfang technisch umfangreicher als nötig — **bewusst**, weil alle offiziellen Module gemeinsam ausgeliefert werden und die Plattform wachsen soll.

**Entscheidung:** Keine Entfernung von Plattformkomponenten. Nutzen dokumentiert; ungenutzte Teile bleiben als Erweiterungspunkte.

### 2. Modularchitektur

**Bewertung: Trifft nicht zu (für Zielgruppe)**

Der Lifecycle (install, enable, initialize, shutdown, upgrade, migration) ist für Administratoren **nicht** sichtbar. Die Admin-UI zeigt nur *Aktiv / Deaktiviert*, Version und *Konfigurieren*.

**Entscheidung:** Modularchitektur unverändert. UX vereinfacht (`FeatureModulesPage` als Tabelle).

### 3. Metadata First + optionale Custom Settings Pages

**Bewertung: Trifft teilweise zu**

Generische Formulare (`GenericSettingsPage` + `DynamicSettingsForm`) sind für einfache Namespaces (Verein, Bestellung, E-Mail) ausreichend. Zahlung benötigt Presets, Provider-Tests und Tab-Navigation.

**Entscheidung:**

```
Standard:  Metadata → GenericSettingsPage
Optional:  SETTINGS_PAGE_COMPONENTS[namespace] → eigene Seite
```

Implementierung: `frontend/src/admin/settingsPages.tsx`  
Erweiterungen (Logo, SMTP-Test, Drucker-Test): `settingsExtensions.tsx`

Payment nutzt Custom Page; Notifications und Printer nutzen generische Formulare + Extensions.

### 4. Platzhalter-Module

**Bewertung: Trifft zu**

Inventory, Analytics, Voucher, Loyalty, Check-In, Cash Register, Discount sind Stubs ohne Mehrwert.

**Entscheidung:** `productionReady: false` in `module.json`; Filter in `ModuleRegistry.getAllModuleInfo()` und Frontend (`PRODUCTION_MODULE_IDS`). Stubs bleiben im Image für Entwicklung, sind aber unsichtbar.

### 5. Core vs. Module Kopplung

**Bewertung: Trifft teilweise zu**

Module importieren Core/Platform per relativem Pfad (`../../src/platform/...`). Das ist für gemeinsam ausgelieferte Module **akzeptabel und wartbar**.

**Entscheidung:** Keine Plugin-Isolation. Kopplung dokumentiert in ADR-003 und Konsolidierungsbericht. Keine unnötige Entkopplung.

### 6. Admin-Bereich & Lifecycle-Begriffe

**Bewertung: Trifft teilweise zu**

Technische Begriffe (install, initialize, migration) waren in früheren UI-Versionen sichtbar. Nach Phase B/C: Navigation *Team / Funktionen / Einstellungen*, Dashboard *Funktionsstatus* statt *Modul-Gesundheit*.

**Entscheidung:** Weitere Klartext-Labels; Health-Chips auf Deutsch.

### 7. Konfiguration & Defaults

**Bewertung: Trifft teilweise zu**

Setup-Assistent, Zahlungs-Presets und Rollen-Presets reduzieren Entscheidungslast. Weitere Automatisierung (z. B. Drucker-Erkennung) über Settings-Extensions.

**Entscheidung:** Bestehende Presets beibehalten; keine zusätzlichen Optionen ohne Nutzen.

## Nicht geändert (bewusst)

| Komponente | Begründung |
|------------|------------|
| ModuleManager / Lifecycle-API | Intern nötig für Upgrades und Fehlerbehandlung |
| SettingsService | Zentrale Konfiguration, bereits produktiv |
| EventBus | Payment-Events, zukünftige Module |
| Permission Platform | Rollen-Presets bauen darauf auf |
| HealthService | Dashboard-Funktionsstatus für Admins |
| Vollständige Plugin-Isolation | Offizielle Module werden mit Core ausgeliefert |

## Auswirkungen

- `FeatureModulesPage`: Tabellen-UI (Funktion, Status, Version, Konfigurieren)
- `settingsPages.tsx`: Registry für modul-eigene Settings-Seiten
- `AdminDashboardPage`: „Funktionsstatus“ mit deutschen Labels
- ADR-003, ADR-004, ADR-006: Review-Abschnitte ergänzt

## Alternativen verworfen

| Alternative | Warum verworfen |
|-------------|-----------------|
| Platform-Komponenten entfernen | Verliert Erweiterbarkeit ohne UX-Gewinn |
| Alle Settings hardcodieren | Skaliert nicht; Metadata First bleibt Standard |
| Stubs aus Image löschen | Entwicklungs-Overhead; Filter reicht |
| npm-Plugins pro Modul | Overkill für Vereins-Self-Hosting |
