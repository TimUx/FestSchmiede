# FestSchmiede 2.2.2 – Produktionsreife, Sicherheit & Dokumentation

**Veröffentlichung:** 2026-07-10

## Highlights

### Produktionsmigrationen & Betrieb

- `prisma migrate deploy` statt `db push` in Produktion (ADR 039)
- Geführte Betriebsabläufe: `./install.sh --update`, `--repair`, `--backup`, `--validate` (ADR 044)
- Restore Dry-Run mit `DRY_RUN=1` für Backup-Integritätsprüfung

### Mandanten & Module

- Tenant Guardrails: CI blockiert ungescopte Prisma-Zugriffe (ADR 040)
- Module API v3 mit kanonischer Runtime in `platform/` (ADR 041)
- Rollenvorlagen für Küche, Abholung, Kasse, Speisenpflege, Finanzen, Rechtliches (ADR 043)

### Admin & Performance

- Volunteer-first Admin-Oberfläche: Dashboard und Navigation fokussiert Alltagsaufgaben (ADR 042)
- Order-Stats per DB-Aggregation, gebündelte `findByIds`, Realtime-Polling-Metriken

### Security Hardening

- CORS- und Secret-Guards, Helmet-Baseline, Upload Content-Length, Impersonation-Audit (ADR 045)

### Dokumentation

- Drei Ebenen: Ehrenamt / Admin / Maintainer
- README gekürzt, Phase-Reports archiviert, Linkcheck in CI

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/TimUx/FestSchmiede/v2.2.2/install.sh | bash
```

## Tests

```bash
bash installer/tests/bootstrap.test.sh
bash installer/tests/run-tests.sh
npm run qa:linkcheck
```

## ADRs

- [039 – Production Migrations](architecture/039-production-migrations.md)
- [040 – Tenant Access Policy](architecture/040-tenant-access-policy.md)
- [041 – Module API v3](architecture/041-module-api-v3.md)
- [042 – Volunteer-first Admin](architecture/042-volunteer-first-admin.md)
- [043 – Tenant Role Templates](architecture/043-tenant-role-templates.md)
- [044 – Guided Operations](architecture/044-guided-operations.md)
- [045 – Security Hardening Baseline](architecture/045-security-hardening-baseline.md)
