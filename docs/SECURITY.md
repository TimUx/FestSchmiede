# Sicherheitsrichtlinie

Dieses Dokument beschreibt die Sicherheitsanforderungen für den Betrieb von
FestSchmiede. Produktionszugänge und Schlüssel gehören ausschließlich in einen
Passwort-Manager oder einen dedizierten Secret-Store, niemals in Git, Tickets
oder Chat-Nachrichten.

## Unterstützte Versionen

| Version | Sicherheitsupdates |
|---------|--------------------|
| 2.5.x   | Ja (aktuelle Hauptversion) |
| 2.4.x   | Ja (kritische Fehler) |
| < 2.4   | Nein |

Immer den neuesten Patch-Release der unterstützten Reihe einsetzen. Für nicht
mehr unterstützte Versionen zuerst ein Upgrade planen und danach die Secrets
rotieren.

## Sicherheitslücke melden

Sicherheitslücken bitte **nicht** öffentlich als Issue melden. Eine Meldung an
den Maintainer (siehe GitHub-Profil des Repository-Besitzers) sollte eine
Beschreibung, Schritte zur Reproduktion und die erwarteten Auswirkungen
enthalten. Eine erste Antwort erfolgt innerhalb von sieben Werktagen. Keine
Produktionsdaten, Passwörter oder Schlüssel mitsenden.

## Sicherheitsmodell (Multi-Tenant)

- Datenzugriffe laufen über `tenantWhere()` / `requireTenantId()`.
- Der Mandanten-Kontext kommt aus Host (Subdomain/Pfadpräfix); auf dem
  Plattform-Host gibt es keinen Fallback-Mandanten.
- JWTs enthalten `tenantId`; Cross-Tenant-Tokens werden abgewiesen.
- Uploads und WebSocket-Räume sind mandantenisoliert
  (`tenant:{id}:…`).
- `X-Forwarded-Host` wird nur bei `TRUSTED_PROXY_HOPS > 0` akzeptiert und muss
  vom Reverse Proxy aus `$host` gesetzt werden. Ungültige Hosts ergeben HTTP
  400.

| Ebene | Authentifizierung | APIs |
|-------|-------------------|------|
| Plattformadmin | `scope: platform` | `/api/platform/*` |
| Mandant | `scope: tenant` | `/api/staff/*`, `/api/admin/*` |
| Öffentlich | Keine / Lookup-Token | `/api/public/*` |

## Produktions-Secrets und Rotation

Mindestens erforderlich sind `JWT_SECRET` (zufällig, mindestens 32 Zeichen),
`APP_ENCRYPTION_KEY` (mindestens 32 Zeichen), ein starkes
`PLATFORM_ADMIN_PASSWORD` (mindestens 16 Zeichen) und ein starkes
`POSTGRES_PASSWORD`. Keine Defaults verwenden; `.env` niemals committen oder
öffentlich teilen. `assertProductionSecrets()` blockiert den Start bei
ungültigen Werten.

Vor **jeder** Rotation ein Datenbank-Backup erstellen und den Vorgang in einem
Wartungsfenster durchführen:

| Secret | Vorgehen |
|--------|----------|
| `JWT_SECRET` | Neuen Wert setzen und Backend neu starten; alle Sessions/Tokens sind ungültig, Benutzer müssen sich neu anmelden. |
| `APP_ENCRYPTION_KEY` | Nur mit geplantem Re-Encrypt rotieren; verschlüsselte Modul-Settings mit `migrateLegacySecrets` migrieren und anschließend stichprobenartig prüfen. |
| `PLATFORM_ADMIN_PASSWORD` | Passwort im Secret-Store und in `.env` ändern, Backend/Stack neu starten, Login prüfen. |
| `POSTGRES_PASSWORD` | Passwort in Postgres und in `DATABASE_URL`/`.env` atomar ändern, Verbindungen prüfen und Stack neu starten. |
| Plugin-Schlüssel | Betroffene Plugins zunächst deaktivieren, neuen Schlüssel über den Secret-Store verteilen, testen und den alten Schlüssel widerrufen. |

Nach der Rotation Logs auf Authentifizierungs- und Datenbankfehler prüfen und
den Abschluss dokumentieren. Details: [OPERATIONS.md — Secret-Rotation](OPERATIONS.md#secret-rotation).

## Plugin-Schlüssel: Verteilung und Rotation

Plugins dürfen Schlüssel nur über die vom Betreiber konfigurierte Secret-
Verwaltung beziehen. Schlüssel gehören nicht in Plugin-Code, `package.json`,
Versionskontrolle, Images, Browser-Bundles oder Logs. Pro Plugin und Umgebung
einen eigenen Schlüssel mit minimalen Berechtigungen und einem eindeutigen
Namen verwenden; niemals einen Plattform- oder Datenbankschlüssel
wiederverwenden.

1. Schlüssel im Secret-Store erzeugen und Zugriff auf den Plugin-Service
   beschränken.
2. Über eine geschützte Laufzeitkonfiguration (z. B. Container-Secret oder
   Umgebungsreferenz) bereitstellen; beim Start nur auf Vorhandensein prüfen.
3. Keine Schlüssel aus Benutzer- oder Mandanteneingaben akzeptieren und
   Schlüsselwerte nie ausgeben.
4. Verteilung und Nutzung auditieren, ohne den Secret-Wert zu protokollieren.

Für die Rotation einen überlappenden Zeitraum einplanen: neuen Schlüssel
bereitstellen, Plugin-Verbindung testen, aktive Clients umstellen und erst
danach den alten Schlüssel widerrufen. Bei Verdacht auf Offenlegung den alten
Schlüssel sofort widerrufen, das Plugin deaktivieren, Logs sichern und einen
neuen Schlüssel ausstellen. Betroffene Mandanten und der Maintainer sind nach
der internen Incident-Bewertung zu informieren.

## Backups: Verschlüsselung, Aufbewahrung und Wiederherstellung

Backups vor jedem Update und mindestens nach jedem großen Event erstellen:

```bash
./scripts/backup/postgres-backup.sh
```

Backups enthalten personenbezogene und möglicherweise vertrauliche Daten.
Außerhalb des Servers verschlüsselt ablegen (z. B. mit einem verwalteten
KMS-Schlüssel oder einem dedizierten Backup-Schlüssel), während der Übertragung
TLS verwenden und Zugriff auf einen kleinen Administrationskreis beschränken.
Den Verschlüsselungsschlüssel getrennt vom Backup aufbewahren; ein Backup darf
nicht der einzige Schlüssel-Sicherungsort sein.

Als Mindeststandard gilt eine Aufbewahrung von 30 Tagen sowie mindestens drei
rotierende Kopien auf zwei Medien, davon eine physisch oder logisch getrennt.
Aufbewahrungsfristen an gesetzliche Anforderungen anpassen. Abgelaufene
Backups und lokale temporäre Kopien sicher löschen. Mindestens jährlich eine
Wiederherstellung in einer isolierten Umgebung testen und die Integrität
(z. B. `DRY_RUN=1`) prüfen.

## Incident Response

Bei einem Verdacht auf kompromittierte Zugangsdaten, Plugin-Schlüssel oder
Backup-Zugriff:

1. Betroffene Accounts, Plugins, Tokens und Schlüssel identifizieren und
   sofort sperren bzw. widerrufen; kompromittierte Systeme bei Bedarf vom
   Netz isolieren.
2. Logs, Audit-Einträge, Backup-Metadaten und Zeitstempel unverändert sichern.
   Keine Beweise durch vorschnelles Löschen oder Überschreiben vernichten.
3. Maintainer und zuständige Betreiber informieren, Umfang und betroffene
   Mandanten bewerten und erforderliche Datenschutzmeldungen prüfen.
4. Secrets aus einem vertrauenswürdigen System neu ausstellen, Sessions
   widerrufen, Images/Plugins aktualisieren und Backups vor der Wiederherstellung
   auf Integrität und Herkunft prüfen.
5. Wiederherstellung kontrolliert durchführen, Monitoring verstärken und
   Ursache, Maßnahmen sowie Verbesserungen nachbereiten.

## Weitere Dokumentation

- [Betriebshandbuch](OPERATIONS.md)
- [ADR-029](architecture/029-multi-tenant-security-hardening.md)
- [ADR-045](architecture/045-security-hardening-baseline.md)
