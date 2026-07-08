/**
 * Erstellt Screenshots aller Ansichten für die Dokumentation.
 * Verwendet API-Mocking, damit kein laufendes Backend nötig ist.
 *
 * Ausführen: npx tsx scripts/capture-screenshots.ts
 */
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const PORT = 4173;
const OUT_DIR = join(process.cwd(), 'docs', 'screenshots');
const DIST = join(process.cwd(), 'frontend', 'dist');

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
};

const mockEvent = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Sommerfest 2026',
  description: 'Jährliches Vereins-Sommerfest',
  date: '2026-08-15T00:00:00.000Z',
  startTime: '11:00',
  endTime: '22:00',
  onlineOrdersActive: true,
  cashierActive: true,
  ordersClosed: false,
  isActive: true,
  eventDateLabel: 'Samstag, 15. August 2026',
};

const mockFoodItems = [
  { id: '1', eventId: mockEvent.id, name: 'Bratwurst mit Brötchen', description: 'Frische Bratwurst vom Grill', price: 4.5, sortOrder: 1, active: true, soldOut: false },
  { id: '2', eventId: mockEvent.id, name: 'Currywurst', description: 'Mit Pommes und Soße', price: 6.0, sortOrder: 2, active: true, soldOut: false },
  { id: '3', eventId: mockEvent.id, name: 'Schnitzel mit Pommes', description: 'Paniertes Schnitzel', price: 8.5, sortOrder: 3, active: true, soldOut: false },
  { id: '4', eventId: mockEvent.id, name: 'Vegetarischer Burger', description: 'Gemüseburger mit Salat', price: 7.0, sortOrder: 4, active: true, soldOut: false },
];

const mockOrder = {
  id: 'order-1',
  orderNumber: 42,
  displayNumber: '042',
  orderDate: '2026-08-15T00:00:00.000Z',
  eventDateLabel: 'Samstag, 15. August 2026',
  source: 'ONLINE',
  sourceLabel: 'Online',
  status: 'READY',
  statusLabel: 'Fertig',
  totalPrice: 14.5,
  createdAt: new Date().toISOString(),
  customer: { firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com' },
  items: [
    { id: 'i1', foodItemId: '1', name: 'Bratwurst mit Brötchen', quantity: 2, unitPrice: 4.5, lineTotal: 9 },
    { id: 'i2', foodItemId: '2', name: 'Currywurst', quantity: 1, unitPrice: 6, lineTotal: 6 },
  ],
};

const mockStats = {
  totalOrders: 87,
  openOrders: 12,
  readyOrders: 5,
  pickedUpOrders: 68,
  revenue: 1243.5,
  popularDishes: [
    { name: 'Bratwurst mit Brötchen', count: 45 },
    { name: 'Currywurst', count: 32 },
    { name: 'Schnitzel mit Pommes', count: 28 },
  ],
  avgProcessingMinutes: 8,
};

const mockOrders = [
  { ...mockOrder, id: 'o1', orderNumber: 41, displayNumber: '041', status: 'NEW', statusLabel: 'Neu' },
  { ...mockOrder, id: 'o2', orderNumber: 42, displayNumber: '042', status: 'IN_PROGRESS', statusLabel: 'In Bearbeitung' },
  { ...mockOrder, id: 'o3', orderNumber: 43, displayNumber: '043', status: 'READY', statusLabel: 'Fertig' },
];

function mockApi(path: string, method: string) {
  if (path === '/api/public/menu') {
    return { event: mockEvent, items: mockFoodItems, preOrderInfo: 'Vorbestellung möglich' };
  }
  if (path === '/api/public/event') return mockEvent;
  if (path.startsWith('/api/public/orders/order-1')) return { ...mockOrder, status: 'IN_PROGRESS', statusLabel: 'In Bearbeitung' };
  if (path === '/api/public/pickup-board') {
    return [
      { id: 'o3', orderNumber: 43, displayNumber: '043' },
      { id: 'o4', orderNumber: 44, displayNumber: '044' },
      { id: 'o5', orderNumber: 45, displayNumber: '045' },
    ];
  }
  if (path === '/api/auth/login') {
    return { token: 'mock-token', user: { id: 'u1', email: 'admin@verein.local', firstName: 'Admin', lastName: 'Verein', role: 'ADMIN' } };
  }
  if (path === '/api/auth/me') {
    return { id: 'u1', email: 'admin@verein.local', firstName: 'Admin', lastName: 'Verein', role: 'ADMIN' };
  }
  if (path === '/api/staff/events/active' || path === '/api/staff/events') return [mockEvent];
  if (path.includes('/food-items')) return mockFoodItems;
  if (path.includes('/stats')) return mockStats;
  if (path.includes('/orders') && method === 'GET') return mockOrders;
  if (path === '/api/health') return { status: 'ok' };
  return {};
}

function startStaticServer(): Promise<void> {
  return new Promise((resolve) => {
    createServer((req, res) => {
      let filePath = join(DIST, (req.url || '/').split('?')[0]);
      if (filePath.endsWith('/')) filePath += 'index.html';
      if (!existsSync(filePath)) filePath = join(DIST, 'index.html');
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    }).listen(PORT, () => resolve());
  });
}

async function main() {
  if (!existsSync(DIST)) {
    console.error('Frontend nicht gebaut. Bitte zuerst: cd frontend && npm run build');
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  await startStaticServer();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'de-DE',
  });

  const pages: { name: string; url: string; viewport?: { width: number; height: number }; setup?: boolean }[] = [
    { name: '01-bestellseite', url: '/' },
    { name: '02-kundenstatus', url: '/status/order-1' },
    { name: '03-status-abfrage', url: '/status' },
    { name: '04-abholboard-monitor', url: '/abholboard', viewport: { width: 1920, height: 1080 } },
    { name: '05-mitarbeiter-login', url: '/mitarbeiter/login' },
    { name: '06-dashboard', url: '/mitarbeiter', setup: true },
    { name: '07-kuechenansicht-tablet', url: '/mitarbeiter/kueche', viewport: { width: 1024, height: 768 }, setup: true },
    { name: '08-kassenansicht', url: '/mitarbeiter/kasse', setup: true },
    { name: '09-lokale-kasse', url: '/mitarbeiter/lokale-kasse', setup: true },
    { name: '10-bestellungen', url: '/mitarbeiter/bestellungen', setup: true },
    { name: '11-speisenverwaltung', url: '/mitarbeiter/speisen', setup: true },
    { name: '12-veranstaltungen', url: '/mitarbeiter/veranstaltungen', setup: true },
  ];

  for (const spec of pages) {
    const page = await context.newPage();
    await page.route('**/api/**', async (route) => {
      const url = new URL(route.request().url());
      const body = mockApi(url.pathname, route.request().method());
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });

    if (spec.setup) {
      await page.addInitScript(() => {
        localStorage.setItem('verein_token', 'mock-token');
      });
    }

    if (spec.viewport) await page.setViewportSize(spec.viewport);
    await page.goto(`http://localhost:${PORT}${spec.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: join(OUT_DIR, `${spec.name}.png`), fullPage: spec.name !== '04-abholboard-monitor' });
    console.log(`✓ ${spec.name}.png`);
    await page.close();
  }

  await browser.close();
  console.log(`\nScreenshots gespeichert in ${OUT_DIR}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
