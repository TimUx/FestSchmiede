# Architektur-Dokumentation

Architecture Decision Records (ADRs) und technische Referenz für Maintainer.

> **Stand:** Plattform v2.2 — Multi-Tenant produktionsbereit.

## Einstieg

| Dokument | Inhalt |
|----------|--------|
| [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md) | Ist-Analyse (Codebase-Überblick) |
| [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) | Phasenplan Multi-Tenant |
| [archive/](./archive/) | Phase- & Release-Reports (archiviert) |

## Architecture Decision Records

| Nr. | ADR | Kurzbeschreibung |
|-----|-----|------------------|
| 001 | [platform-overview.md](./001-platform-overview.md) | Gesamtplattform, Schichten |
| 002 | [core-architecture.md](./002-core-architecture.md) | Core-Prinzipien, Extension Points |
| 003 | [module-system.md](./003-module-system.md) | ModuleManager, Lifecycle |
| 004–014 | [004](./004-settings-platform.md) … [014](./014-legal-module.md) | Settings, Permissions, Module |
| 020–030 | [020](./020-multi-tenant-platform.md) … [030](./030-performance-scalability.md) | Multi-Tenant, Security, Performance |
| 031–038 | [031](./031-central-mail-service.md) … [038](./038-rollback-strategy.md) | Mail, Installer, Rollback |
| 039 | [039-production-migrations.md](./039-production-migrations.md) | Prisma Migrate in Produktion |
| 040 | [tenant-access-policy.md](./040-tenant-access-policy.md) | Tenant-scoped Prisma-Zugriff |
| 041 | [module-api-v3.md](./041-module-api-v3.md) | Konsolidierte Modul-Runtime API |
| 042 | [042-volunteer-first-administration.md](./042-volunteer-first-administration.md) | Volunteer-first Admin |
| 043 | [043-tenant-role-templates.md](./043-tenant-role-templates.md) | Rollenvorlagen |
| 044 | [044-guided-operations.md](./044-guided-operations.md) | Geführte Betriebsabläufe |
| 045 | [045-security-hardening-baseline.md](./045-security-hardening-baseline.md) | Security Hardening |

Vollständige Tabelle mit Status: siehe Dateien `0*.md` in diesem Ordner.

## Verwandte Handbücher

- [docs/README.md](../README.md) — Zielgruppen-Index
- [MODULE_ARCHITECTURE.md](../MODULE_ARCHITECTURE.md) — Modul-Doku
- [DEVELOPER_GUIDE.md](../DEVELOPER_GUIDE.md) — Entwicklung
- [PERFORMANCE_GUIDE.md](../PERFORMANCE_GUIDE.md) · [NOTIFICATION_GUIDE.md](../NOTIFICATION_GUIDE.md)

## Prinzip

```
Core kennt keine Plugins.
Plugins kennen den Core.
```
