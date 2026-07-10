# FestSchmiede

Open-Source-Plattform für Veranstaltungs-Bestellungen: Vorausbestellung, Küche, Abholung, Admin — mandantenfähig, Docker-basiert, PWA-fähig.

![Bestellseite](docs/screenshots/01-bestellseite-monitor.png)

## Schnellstart

```bash
curl -fsSL https://raw.githubusercontent.com/TimUx/FestSchmiede/v2.2.2/install.sh | bash
```

Oder nach Git-Clone: `./install.sh` · Details: [Installation](docs/INSTALLATION.md)

| Dienst | URL (lokal) |
|--------|-------------|
| Bestellseite | http://localhost:5173/ |
| Admin | http://localhost:5173/admin/login |
| Plattform | http://localhost:5173/platform/login |

## Dokumentation — drei Ebenen

| Ich bin… | Start hier |
|----------|------------|
| **Ehrenamt** (Vorstand, Helfer ohne IT) | [Volunteer Guide](docs/VOLUNTEER_GUIDE.md) |
| **Admin** (Installation & Betrieb) | [Dokumentation — Admin-Pfad](docs/README.md#administratoren--in-drei-klicks) |
| **Maintainer** (Entwicklung) | [Developer Guide](docs/DEVELOPER_GUIDE.md) |

**Admin in drei Schritten:** [Installation](docs/INSTALLATION.md) → [Ersteinrichtung](docs/ADMIN_GUIDE.md#erste-schritte-nach-der-installation) → [Checkliste vor dem Fest](docs/OPERATIONS.md#vor-dem-sommerfest-checkliste)

Vollständiger Index: [docs/README.md](docs/README.md) · Struktur: [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)

## Funktionen (Kurz)

Bestellseite · Live-Status · Abholboard · Küchen-Tablet · Kasse vor Ort · Admin (Events, Speisen, Team) · optionale Module (Zahlung, Benachrichtigungen, Rechtliches)

Screenshots: [docs/screenshots/](docs/screenshots/README.md)

## Technik & Sicherheit

React · TypeScript · Node.js · PostgreSQL · Docker · Socket.IO

[Sicherheit](SECURITY.md) · [Architektur (ADRs)](docs/architecture/README.md) · [Roadmap](docs/ROADMAP.md)

## Lizenz & Mitwirkung

Siehe Repository-Lizenz. Sicherheitsmeldungen: [SECURITY.md](SECURITY.md).
