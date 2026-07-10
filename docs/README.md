# FestSchmiede — Dokumentation

Drei Ebenen — wählen Sie Ihre Rolle:

| Ebene | Für wen | Ziel |
|-------|---------|------|
| **Ehrenamt** | Vorstand, Helfer:innen ohne IT | Fest vorbereiten und am Tag bedienen |
| **Admin** | Technische Ansprechpartner:innen | Installieren, einrichten, betreiben |
| **Maintainer** | Entwickler:innen, Hostinger | Code, Deployment, Architektur |

---

## Ehrenamt

| Thema | Anleitung |
|-------|-----------|
| Überblick & Festtag | [Volunteer Guide](VOLUNTEER_GUIDE.md) |
| Checkliste vor dem Fest | [OPERATIONS — Vor dem Sommerfest](OPERATIONS.md#vor-dem-sommerfest-checkliste) |
| Am Veranstaltungstag | [OPERATIONS — Am Veranstaltungstag](OPERATIONS.md#am-veranstaltungstag) |
| Küche & Abholung (Bedienung) | [User Guide](USER_GUIDE.md) |

---

## Administratoren — in drei Klicks

Vom Repository zur richtigen Anleitung:

1. **[Installation](INSTALLATION.md)** — `./install.sh`, Docker, erste Anmeldung
2. **[Ersteinrichtung](ADMIN_GUIDE.md#erste-schritte-nach-der-installation)** — Verein, Event, Speisekarte, Team
3. **[Checkliste Veranstaltungstag](OPERATIONS.md#vor-dem-sommerfest-checkliste)** — Backup, Health, Tablets testen

| Weitere Themen | Anleitung |
|----------------|-----------|
| Admin-Oberfläche (alle Bereiche) | [Admin Guide](ADMIN_GUIDE.md) |
| Backup, Update, Restore | [Operations](OPERATIONS.md) |
| HTTPS / Reverse Proxy | [Admin Guide — Reverse Proxy](ADMIN_GUIDE.md#reverse-proxy-https) |
| Plattform-Mandanten (`/platform`) | [Admin Guide — Plattform](ADMIN_GUIDE.md#plattform-administration-phase-3) |

---

## Maintainer

| Thema | Anleitung |
|-------|-----------|
| Entwicklung & Tests | [Developer Guide](DEVELOPER_GUIDE.md) |
| Docker & CI | [DOCKER.md](DOCKER.md) · [DEPLOYMENT.md](DEPLOYMENT.md) |
| Multi-Tenant Deployment | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Module & Architektur | [MODULE_ARCHITECTURE.md](MODULE_ARCHITECTURE.md) |
| ADRs (Entscheidungen) | [architecture/README.md](architecture/README.md) |
| Archiv (Phase-Reports) | [architecture/archive/](architecture/archive/) |
| Sicherheit | [SECURITY.md](../SECURITY.md) |
| Roadmap | [ROADMAP.md](ROADMAP.md) |

---

## Screenshots

Vorschau der Oberfläche: [screenshots/README.md](screenshots/README.md)

Aktualisieren: `npm run screenshots` (siehe [Developer Guide](DEVELOPER_GUIDE.md#screenshots-generieren)).
