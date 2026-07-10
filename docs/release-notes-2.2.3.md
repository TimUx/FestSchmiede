# FestSchmiede 2.2.3 – CI-Stabilisierung & QA-Fixes

**Veröffentlichung:** 2026-07-10

Patch-Release nach v2.2.2: behebt alle blockierenden CI-/QA-Fehler und stellt eine grüne Release-Validation sicher.

## Behoben

### CI & Docker

- `docker-compose.ci.yml`: Multi-Tenant-Modus, API über Nginx same-origin, `FESTSCHMIEDE_CI`-Guards
- Idempotente Migration `tenant_role_templates`, DB-Passwort-Alignment in Workflows
- QA-Seed (`staffHash`), Tenant-Prisma-Guard, Linkcheck (ADR 044/045)

### API- & Routing-Tests

- Supertest-Host-Helper, `routing-config` ohne `req.path`-Mutation
- Localhost-Resolver-Cache mit Pfadsegment, `platform` als reservierte Subdomain
- `PlatformDomainService`: lokale www/app-URLs mit CORS-Port (`:5173`)

### E2E (Playwright)

- Mandanten-Tests auf `default.localhost`, Plattform-Homepage auf `localhost` (Multi-Tenant)
- Admin-Navigation: Drawer-Locators (Strict-Mode)
- Nginx: SPA-Route `/screenshots` trotz Static-Asset-Ordner
- Performance-Baseline: Tenant-Host für API-Probes

### Lint & TypeScript

- Unused imports, `RoleName.ADMIN`, `InputJsonValue`-Casts, optionales Chaining in Tenant-Services

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/TimUx/FestSchmiede/v2.2.3/install.sh | bash
```

## Tests

```bash
npm run qa:docker:up && npm run qa:wait && npm run qa:seed && npm run qa:e2e
```

## Docker Images

```bash
ghcr.io/timux/festschmiede/backend:2.2.3
ghcr.io/timux/festschmiede/frontend:2.2.3
```
