/** Minimale OpenAPI-Beschreibung der Kern-API (M6). */
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'FestSchmiede API',
    version: '2.2.0',
    description: 'REST-API für Online-Bestellungen, Mitarbeiter- und Admin-Bereich.',
  },
  servers: [{ url: '/api', description: 'API-Basis' }],
  paths: {
    '/health': {
      get: { summary: 'Health Check', responses: { '200': { description: 'OK' } } },
    },
    '/auth/login': {
      post: { summary: 'Anmeldung', responses: { '200': { description: 'Token' }, '401': { description: 'Ungültig' } } },
    },
    '/public/menu': {
      get: { summary: 'Öffentliche Speisekarte' },
    },
    '/public/orders': {
      post: { summary: 'Online-Bestellung erstellen' },
    },
    '/public/orders/lookup': {
      post: { summary: 'Bestellung per Abholnummer + Nachname suchen' },
    },
    '/staff/events': {
      get: { summary: 'Veranstaltungen (Mitarbeiter)' },
    },
    '/staff/orders/{id}': {
      delete: {
        summary: 'Bestellung endgültig löschen (nur Mandanten-Administratoren)',
        description: 'Entfernt Bestellung, Positionen und Statusverlauf. Zahlungsnachweise bleiben erhalten; keine automatische Rückerstattung oder Abbruch laufender Onlinezahlungen.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '204': { description: 'Endgültig gelöscht' },
          '400': { description: 'Ungültige Bestell-ID' },
          '401': { description: 'Nicht authentifiziert' },
          '403': { description: 'Keine Administratorberechtigung' },
          '404': { description: 'Bestellung nicht gefunden' },
        },
      },
    },
    '/admin/settings': {
      get: { summary: 'Settings-Namespaces' },
    },
    '/admin/modules': {
      get: { summary: 'Modulübersicht' },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
  },
} as const;
