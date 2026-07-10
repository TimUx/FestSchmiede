# Dokumentationsstruktur (v2.2)

**Ziel:** Nutzer finden die richtige Anleitung ohne Umwege.

## Drei Ebenen

| Ebene | Datei | Inhalt |
|-------|-------|--------|
| Ehrenamt | `VOLUNTEER_GUIDE.md` | Plain Language, Festtag, keine Docker-Befehle |
| Admin | `INSTALLATION.md`, `ADMIN_GUIDE.md`, `OPERATIONS.md` | Install → Setup → Betrieb |
| Maintainer | `DEVELOPER_GUIDE.md`, `architecture/` | Code, ADRs, Deployment |

Einstieg für alle: [`docs/README.md`](README.md) mit Zielgruppenmatrix.

## Änderungen

- **README.md** gekürzt — Quickstart + Verweis auf `docs/README.md`
- **ADR-Reports** nach `docs/architecture/archive/` verschoben (Phase- und Payment-Reports)
- **Screenshots** in `docs/screenshots/README.md` gebündelt
- **Linkcheck** in CI (`npm run qa:linkcheck`)

## Akzeptanz

Neue Admins: Repository-`README` → `docs/README.md` → Installation / Setup / Checkliste = **max. 2 Klicks** (direkte Admin-Links in `docs/README.md` = **1 Klick**).
