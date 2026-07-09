# Roadmap — Vereinsbestellung

Überblick: Was **heute stabil** ist und was **geplant** ist. Keine versteckten Experimente in der Hauptoberfläche.

Stand: Release **1.0**

---

## Stabil (1.0)

| Bereich | Funktion |
|---------|----------|
| Öffentlich | Bestellseite, Vorausbestellung, Status, Kontakt, Abholboard |
| Mitarbeiter | Küche, Abholung, Kasse, Dashboard, Bestellübersicht |
| Admin | Verein, Veranstaltungen, Speisen, Benutzer, Bestell-Einstellungen |
| Betrieb | Docker Compose, Prisma-Migrationen, Backup & Restore-Skripte |
| Module (optional) | Online-Zahlung (Stripe), Benachrichtigungen (E-Mail, ntfy, Chat) |
| Qualität | CI (Lint, Tests, E2E), Nightly QA, Security-Audit |

---

## Geplant (nach 1.0)

| Thema | Beschreibung | Priorität |
|-------|--------------|-----------|
| Einrichtungsassistent | Geführter Setup nach erstem Login (Event → Karte → Zahlung) | Hoch |
| „Funktionen“ statt Modul-Jargon | Vereinfachte Admin-Oberfläche für optionale Features | Hoch |
| Zahlungs-Presets | Nur Bar / Bar+Karte / Online — ohne Provider-Details im Alltag | Hoch |
| Status-Privacy | Bestellstatus nur mit Lookup-Token, nicht erratbar | Hoch |
| Session-Widerruf | Logout und deaktivierte Nutzer sofort wirksam | Mittel |
| Upload-Härtung | Striktere Bild-Pipeline für Logos | Mittel |
| Lagerverwaltung | Bestand pro Gericht | Mittel |
| Küchendruck | Bondrucker-Anbindung | Mittel |
| Rollen-Presets | Küche, Kasse, Vorstand — ohne Rechte-Bingo | Mittel |
| API v1 | Versionierte öffentliche API für Integrationen | Niedrig |
| Multi-Instanz / Redis | Nur bei nachgewiesenem Bedarf | Niedrig |

---

## Bewusst nicht in 1.0

- Drittanbieter-Plugin-Marketplace
- Multi-Mandanten-SaaS
- Vollständiges ERP (Lager, Loyalty, Analytics in der Haupt-UI)

Details und Begründung: [Maßnahmenplan](audits/massnahmenplan-architektur-produkt.md).

---

## Versionen

| Version | Fokus |
|---------|--------|
| **1.0** | Produktionsreifer Kern für Vereinsfeste |
| 1.1+ | UX-Vereinfachung (Assistent, Presets) |
| 1.2+ | Erweiterte Module nach Bedarf der Community |

Release-Notizen-Vorlage: [RELEASE_NOTES_TEMPLATE.md](RELEASE_NOTES_TEMPLATE.md)
