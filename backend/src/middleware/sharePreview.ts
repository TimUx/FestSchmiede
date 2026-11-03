import type { Request, Response, NextFunction } from 'express';
import { tenantResolver, tenantContext } from '../platform/bootstrap';
import { eventService } from '../services/eventService';
import { clubService } from '../services/clubService';
import { config } from '../config';
import type { TenantContextData } from '../platform/tenant/types';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]!);
}

interface Preview {
  title: string;
  description: string;
  siteName: string;
  image: string;
  url: string;
}

export function renderSharePreview(preview: Preview): string {
  const meta = (key: string, value: string, attribute = 'property') =>
    `<meta ${attribute}="${key}" content="${escapeHtml(value)}">`;
  return [
    `<title>${escapeHtml(preview.title)}</title>`,
    meta('description', preview.description, 'name'),
    `<link rel="canonical" href="${escapeHtml(preview.url)}">`,
    meta('og:type', 'website'),
    meta('og:locale', 'de_DE'),
    meta('og:title', preview.title),
    meta('og:description', preview.description),
    meta('og:site_name', preview.siteName),
    meta('og:url', preview.url),
    meta('og:image', preview.image),
    meta('og:image:alt', preview.siteName),
    meta('twitter:card', 'summary_large_image', 'name'),
    meta('twitter:title', preview.title, 'name'),
    meta('twitter:description', preview.description, 'name'),
    meta('twitter:image', preview.image, 'name'),
  ].join('\n');
}

export async function sharePreview(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await tenantResolver.resolve(req, req.path);
    const host = tenantResolver.extractHost(req)!;
    const protocol = config.nodeEnv === 'production' ? 'https' : req.protocol;
    const authority = config.multiTenant.trustProxyHops > 0
      ? req.get('x-forwarded-host')?.split(',')[0]?.trim() || req.get('host')
      : req.get('host');
    const parsedHost = new URL(`http://${authority || host}`);
    const port = parsedHost.hostname === host && parsedHost.port ? `:${parsedHost.port}` : '';
    const origin = `${protocol}://${host}${port}`;
    const prefix = result.pathPrefix ?? '';
    const pagePath = prefix ? req.path.slice(prefix.length) || '/' : req.path;
    const publicPage = pagePath === '/' || pagePath === '/public' || pagePath === '/public/';
    const requestedEvent = typeof req.query.eventId === 'string' ? req.query.eventId : undefined;
    const url = new URL(req.path, origin);
    const preview: Preview = {
      title: 'FestSchmiede – Software für Vereinsfeste',
      description: 'Open-Source-Plattform für Vereine: Bestellung, Küche, Abholung und Veranstaltungsorganisation.',
      siteName: 'FestSchmiede',
      image: new URL('/logo-512.png', origin).href,
      url: url.href,
    };

    if (result.tenant) {
      const tenant: TenantContextData = result.tenant;
      // Der Resolver cached den Tenant; frisch hochgeladene Logos dürfen nicht in Linkvorschauen fehlen.
      const branding = await tenantContext.runAsync(tenant, () => clubService.getPublic());
      const name = branding.clubName || tenant.name;
      preview.title = name;
      preview.siteName = name;
      preview.description = branding.description?.trim() || `Speisen und Getränke bei ${name} online bestellen.`;
      if (branding.logoUrl) {
        const logoPath = branding.logoUrl.startsWith('/uploads/') ? `${prefix}${branding.logoUrl}` : branding.logoUrl;
        const logo = new URL(logoPath, origin);
        if (logo.protocol === 'https:' || logo.protocol === 'http:') preview.image = logo.href;
      }
      if (publicPage) {
        const events = await tenantContext.runAsync(tenant, () => eventService.getPublicOnlineEvents());
        const event = requestedEvent
          ? events.find((entry) => entry.id === requestedEvent)
          : events.length === 1 ? events[0] : undefined;
        if (event) {
          preview.title = `${event.name} · ${name}`;
          preview.description = [
            `${event.eventDateLabel}, ${event.startTime}–${event.endTime} Uhr.`,
            event.description?.trim() || `Speisen und Getränke bei ${name} online bestellen.`,
          ].join(' ');
          if (requestedEvent) url.searchParams.set('eventId', event.id);
          preview.url = url.href;
        }
      }
    }

    res.setHeader('Cache-Control', 'no-store');
    res.type('text/plain').send(renderSharePreview(preview));
  } catch (error) {
    next(error);
  }
}
