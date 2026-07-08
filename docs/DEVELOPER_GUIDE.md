# Entwicklerhandbuch (Developer Guide)

Technische Dokumentation für Entwickler, die an der Vereinsbestellplattform mitarbeiten oder sie erweitern.

## Inhaltsverzeichnis

1. [Architekturübersicht](#architekturübersicht)
2. [Projektstruktur](#projektstruktur)
3. [Lokale Entwicklung](#lokale-entwicklung)
4. [Datenbank & Prisma](#datenbank--prisma)
5. [API-Design](#api-design)
6. [Realtime (Socket.IO)](#realtime-socketio)
7. [Vorausbestellungen](#vorausbestellungen)
8. [Authentifizierung](#authentifizierung)
9. [Tests](#tests)
10. [Deployment](#deployment)
11. [Erweiterungspunkte](#erweiterungspunkte)

---

## Architekturübersicht

```
┌─────────────┐     REST/WS      ┌─────────────┐     Prisma     ┌────────────┐
│   Frontend  │ ◄──────────────► │   Backend   │ ◄────────────► │ PostgreSQL │
│ React + MUI │                  │ Express+TS  │                │            │
└─────────────┘                  └─────────────┘                └────────────┘
       │                                │
       └──────── Socket.IO ─────────────┘
```

### Schichten im Backend

| Schicht | Verzeichnis | Aufgabe |
|---------|-------------|---------|
| Routes | `src/routes/` | HTTP-Routing, Middleware-Kette |
| Controllers | `src/controllers/` | Request/Response-Handling |
| Services | `src/services/` | Geschäftslogik |
| Repositories | `src/repositories/` | Datenzugriff (Prisma) |
| Middleware | `src/middleware/` | Auth, Validierung, Fehler |
| Validation | `src/validation/` | Zod-Schemas |

---

## Projektstruktur

```
food-order/
├── backend/
│   ├── prisma/           # Schema, Migrationen, Seed
│   └── src/
├── frontend/
│   └── src/
│       ├── components/   # Wiederverwendbare UI
│       ├── contexts/     # Auth, Theme
│       ├── pages/        # Routen/Seiten
│       ├── services/     # API-Client, Socket
│       └── types/
├── docs/
│   ├── screenshots/      # UI-Screenshots
│   ├── DEVELOPER_GUIDE.md
│   ├── ADMIN_GUIDE.md
│   └── USER_GUIDE.md
├── scripts/
│   └── capture-screenshots.ts
└── docker-compose.yml
```

---

## Lokale Entwicklung

### Voraussetzungen

- Node.js 22+
- PostgreSQL 16+
- npm

### Backend starten

```bash
cd backend
cp ../.env.example .env
# DATABASE_URL in .env anpassen
npm install
npx prisma migrate deploy
npm run seed
npm run dev
```

Backend läuft auf `http://localhost:3001`.

### Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Frontend läuft auf `http://localhost:5173` mit Proxy zu `/api` und `/socket.io`.

### Mit Docker

```bash
cp .env.example .env
docker compose up --build -d
docker compose exec backend npm run seed
```

---

## Datenbank & Prisma

### Wichtige Modelle

- **Event** – Veranstaltung (Datum, Schalter für Online/Kasse)
- **FoodItem** – Gerichte pro Veranstaltung
- **Order** – Bestellung mit `orderNumber`, `orderDate`, `status`
- **DailyOrderCounter** – Atomarer Zähler für Tages-Bestellnummern
- **OrderStatus** – Status-Historie (Audit-Trail)

### Migrationen

```bash
# Neue Migration erstellen (nach Schema-Änderung)
npx prisma migrate dev --name beschreibung

# In Produktion
npx prisma migrate deploy
```

### Seed

```bash
npm run seed
```

Erstellt Admin, Küchen-Mitarbeiter, Demo-Veranstaltung (in 14 Tagen) und 5 Gerichte.

---

## API-Design

Basis-URL: `/api`

### Öffentliche Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| GET | `/public/event` | Aktive Veranstaltung |
| GET | `/public/menu` | Speisekarte + Event-Info |
| POST | `/public/orders` | Online-Bestellung |
| POST | `/public/orders/lookup` | Status per Nummer + Nachname |
| GET | `/public/orders/:id` | Bestellung per ID |
| GET | `/public/pickup-board` | Fertige Bestellungen |

### Mitarbeiter-Endpunkte (JWT)

| Methode | Pfad | Rolle |
|---------|------|-------|
| POST | `/auth/login` | – |
| GET | `/staff/events` | ADMIN, STAFF |
| POST | `/staff/orders/cashier` | ADMIN, STAFF |
| PATCH | `/staff/orders/:id/status` | ADMIN, STAFF |
| POST | `/staff/events` | ADMIN |

Vollständige Liste: siehe `backend/src/routes/index.ts`.

---

## Realtime (Socket.IO)

### Events (Server → Client)

| Event | Beschreibung |
|-------|-------------|
| `order:created` | Neue Bestellung |
| `order:updated` | Statusänderung |
| `event:updated` | Veranstaltung geändert |
| `fooditems:updated` | Speisekarte geändert |

### Rooms

- `event:{eventId}` – Alle Clients einer Veranstaltung
- `order:{orderId}` – Kundenstatusseite

### Client beitreten

```typescript
socket.emit('join:event', eventId);
socket.emit('join:order', orderId);
```

---

## Vorausbestellungen

**Wichtig:** `orderDate` und die Tages-Bestellnummer beziehen sich immer auf den **Veranstaltungstag**, nicht auf den Bestellzeitpunkt.

```
Kunde bestellt am 01.07. ──► Veranstaltung am 15.08.
                              orderDate = 15.08.
                              orderNumber = 001, 002, …
```

Implementierung in `backend/src/utils/helpers.ts`:

- `getEventOrderDate(event.date)` – normalisiertes Veranstaltungsdatum
- `formatEventDate()` – deutsche Datumsanzeige

Küche und Kasse sehen am Veranstaltungstag alle Bestellungen – auch solche, die Wochen vorher aufgegeben wurden.

---

## Authentifizierung

- JWT Bearer Token im Header `Authorization: Bearer <token>`
- Rollen: `ADMIN`, `STAFF`
- Öffentlicher Bereich: kein Token erforderlich
- Token-Gültigkeit: konfigurierbar via `JWT_EXPIRES_IN` (Standard: 8h)

---

## Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Screenshots generieren

```bash
cd frontend && npm run build
cd .. && npx tsx scripts/capture-screenshots.ts
```

---

## Deployment

### Umgebungsvariablen (Produktion)

| Variable | Beschreibung |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL-Verbindung |
| `JWT_SECRET` | Langer zufälliger String |
| `CORS_ORIGIN` | Frontend-URL |
| `SMTP_*` | Optional für E-Mail-Bestätigungen |

### Docker Compose

```bash
docker compose up --build -d
docker compose exec backend npm run seed
```

---

## Erweiterungspunkte

Die Architektur ist vorbereitet für:

| Feature | Ansatz |
|---------|--------|
| QR-Codes | Neuer Service + Route, QR mit `orderId` oder `displayNumber` |
| Bondruck | Service-Interface `PrintService`, Implementierung pro Drucker |
| Zahlungen | Payment-Provider als Plugin in `services/payment/` |
| Mehrere Küchen | `kitchenId` an Order/FoodItem |
| Push-Benachrichtigungen | Web Push API + Service Worker |
| CSV-Export | Neuer Endpoint in `orderController` |
| Mehrsprachigkeit | i18n (z. B. react-i18next) |

Neue Features sollten der Schichtenarchitektur folgen: Route → Controller → Service → Repository.
