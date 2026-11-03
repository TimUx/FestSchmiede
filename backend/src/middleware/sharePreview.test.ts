import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sharePreview, renderSharePreview } from './sharePreview';
import { DEFAULT_TENANT_SETTINGS } from '../platform/tenant/types';

const mocks = vi.hoisted(() => ({ resolve: vi.fn(), events: vi.fn(), club: vi.fn() }));
vi.mock('../platform/bootstrap', () => ({
  tenantResolver: { resolve: mocks.resolve, extractHost: () => 'app.festschmiede.de' },
  tenantContext: { runAsync: (_tenant: unknown, fn: () => unknown) => fn() },
}));
vi.mock('../services/eventService', () => ({ eventService: { getPublicOnlineEvents: mocks.events } }));
vi.mock('../services/clubService', () => ({ clubService: { getPublic: mocks.club } }));
vi.mock('../config', () => ({ config: { nodeEnv: 'production', multiTenant: { trustProxyHops: 1 } } }));

const tenant = {
  id: 'tenant-1', name: 'ASV Libelle', slug: 'asv-libelle', description: 'Unser Vereinsfest',
  logoUrl: '/uploads/tenant-1/logo.png', settings: DEFAULT_TENANT_SETTINGS,
};
const event = {
  id: 'event-1', name: 'Sommerfest', description: 'Grill und Getränke',
  eventDateLabel: '01.07.2030', startTime: '11:00', endTime: '22:00',
};
const app = express();
app.use('/__share-head', sharePreview);
app.use((_error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(503).send('Vorschau nicht verfügbar');
});

describe('server-rendered sharing metadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resolve.mockResolvedValue({ type: 'tenant', tenant, pathPrefix: '/asv-libelle' });
    mocks.events.mockResolvedValue([]);
    mocks.club.mockResolvedValue({ clubName: tenant.name, description: tenant.description, logoUrl: tenant.logoUrl });
  });

  it('returns tenant metadata and an absolute, tenant-scoped logo without JavaScript', async () => {
    const res = await request(app).get('/__share-head/asv-libelle/public');
    expect(res.status).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.text).toContain('<title>ASV Libelle</title>');
    expect(res.text).toContain('content="Unser Vereinsfest"');
    expect(res.text).toContain('https://app.festschmiede.de/asv-libelle/uploads/tenant-1/logo.png');
    expect(res.text).toContain('href="https://app.festschmiede.de/asv-libelle/public"');
    expect(mocks.resolve).toHaveBeenCalledWith(expect.anything(), '/asv-libelle/public');
  });

  it('uses the selected public event, date, time and description in a shared event link', async () => {
    mocks.events.mockResolvedValue([event, { ...event, id: 'event-2', name: 'Herbstfest' }]);
    const res = await request(app).get('/__share-head/asv-libelle/public?eventId=event-1&utm_source=test');
    expect(res.text).toContain('<title>Sommerfest · ASV Libelle</title>');
    expect(res.text).toContain('01.07.2030, 11:00–22:00 Uhr. Grill und Getränke');
    expect(res.text).toContain('/asv-libelle/public?eventId=event-1');
    expect(res.text).not.toContain('utm_source');
    expect(res.text).not.toContain('Herbstfest');
  });

  it('automatically describes the only publicly orderable event', async () => {
    mocks.events.mockResolvedValue([event]);
    expect((await request(app).get('/__share-head/asv-libelle/public')).text)
      .toContain('<title>Sommerfest · ASV Libelle</title>');
  });

  it('never exposes a private, unavailable, or other tenant event from an arbitrary id', async () => {
    mocks.events.mockResolvedValue([event]);
    const res = await request(app).get('/__share-head/asv-libelle/public?eventId=private-event');
    expect(res.text).toContain('<title>ASV Libelle</title>');
    expect(res.text).not.toContain('private-event');
    expect(res.text).not.toContain('Sommerfest');
  });

  it('does not disclose event or order information on private pages', async () => {
    const res = await request(app).get('/__share-head/asv-libelle/status/secret-token?lastName=Mustermann');
    expect(mocks.events).not.toHaveBeenCalled();
    expect(res.text).not.toContain('Mustermann');
    expect(res.text).toContain('<title>ASV Libelle</title>');
  });

  it('supports subdomain tenant logos and external HTTPS logos', async () => {
    mocks.resolve.mockResolvedValue({ type: 'tenant', tenant });
    expect((await request(app).get('/__share-head/public')).text)
      .toContain('https://app.festschmiede.de/uploads/tenant-1/logo.png');
    mocks.resolve.mockResolvedValue({ type: 'tenant', tenant: { ...tenant, logoUrl: 'https://images.example.org/logo.png' } });
    mocks.club.mockResolvedValue({ clubName: tenant.name, logoUrl: 'https://images.example.org/logo.png' });
    expect((await request(app).get('/__share-head/public')).text).toContain('https://images.example.org/logo.png');
  });

  it('uses the platform image only when there is no tenant logo', async () => {
    mocks.resolve.mockResolvedValue({ type: 'tenant', tenant: { ...tenant, logoUrl: null, description: null } });
    mocks.club.mockResolvedValue({ clubName: tenant.name, logoUrl: null, description: null });
    const res = await request(app).get('/__share-head/public');
    expect(res.text).toContain('https://app.festschmiede.de/logo-512.png');
    expect(res.text).toContain('Speisen und Getränke bei ASV Libelle online bestellen.');
  });

  it('preserves a nonstandard port for local preview and logo URLs', async () => {
    const res = await request(app).get('/__share-head/asv-libelle/public')
      .set('X-Forwarded-Host', 'app.festschmiede.de:18573');
    expect(res.text).toContain('https://app.festschmiede.de:18573/asv-libelle/uploads/tenant-1/logo.png');
  });

  it('uses current branding after uploading or removing a logo despite a cached tenant', async () => {
    mocks.club.mockResolvedValue({ clubName: 'Neuer Vereinsname', logoUrl: '/uploads/tenant-1/new-logo.webp' });
    const updated = await request(app).get('/__share-head/asv-libelle/public');
    expect(updated.text).toContain('<title>Neuer Vereinsname</title>');
    expect(updated.text).toContain('/uploads/tenant-1/new-logo.webp');
    expect(updated.text).not.toContain('/uploads/tenant-1/logo.png');
    mocks.club.mockResolvedValue({ clubName: tenant.name, logoUrl: null });
    const removed = await request(app).get('/__share-head/asv-libelle/public');
    expect(removed.text).toContain('/logo-512.png');
    expect(removed.text).not.toContain('/uploads/tenant-1/logo.png');
  });

  it('keeps platform pages generic and surfaces resolver errors', async () => {
    mocks.resolve.mockResolvedValue({ type: 'platform', scope: 'www' });
    expect((await request(app).get('/__share-head/')).text).toContain('FestSchmiede – Software für Vereinsfeste');
    expect(mocks.events).not.toHaveBeenCalled();
    mocks.resolve.mockRejectedValue(new Error('Unknown tenant'));
    expect((await request(app).get('/__share-head/unknown/public')).status).toBe(503);
  });

  it('escapes user-maintained content and prevents HTML and SSI injection', () => {
    const html = renderSharePreview({
      title: '<script>alert("x")</script>', description: '<!--#include virtual="/secret" --> & text',
      siteName: '" onload="bad', url: 'https://example.org/?a=1&b=2', image: 'https://example.org/logo.png',
    });
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<!--#');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&quot;');
    expect(html).toContain('&amp;');
  });
});
