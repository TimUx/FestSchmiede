# Release Notes — FestSchmiede 2.0.1

**Datum:** 2026-07-10  
**Typ:** Patch (Rebranding)

---

## Geändert

- **Produktname:** Die Plattform heisst jetzt **FestSchmiede** (vorher FestManager).
- **Repository:** `github.com/TimUx/FestSchmiede`
- **Docker-Images:** `ghcr.io/timux/festschmiede/backend` und `ghcr.io/timux/festschmiede/frontend`
- **Paketnamen:** `festschmiede`, `festschmiede-backend`, `festschmiede-frontend`
- UI, Dokumentation, E-Mails, OpenAPI, Marketing-Seiten und Modul-Metadaten aktualisiert.

## Produktfamilie

FestSchmiede ergänzt die bestehende App **KochSchmiede** als mandantenfähige Veranstaltungsplattform.

## Breaking Changes

Keine funktionalen Breaking Changes. APIs, Datenbankschema und Mandanten-Routing bleiben unverändert.

## Upgrade

1. `.env` anpassen: `GHCR_IMAGE_PREFIX=ghcr.io/timux/festschmiede`
2. Images pullen und Stack neu starten:

```bash
docker compose pull
docker compose up -d
```

## Docker Images

- `ghcr.io/timux/festschmiede/backend:2.0.1`
- `ghcr.io/timux/festschmiede/frontend:2.0.1`
