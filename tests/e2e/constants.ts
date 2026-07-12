/** Plattform-Marketing (www) – auf localhost ohne Mandanten-Pfad. */
export const PLATFORM_BASE = process.env.QA_FRONTEND_BASE || 'http://localhost:5173';

export const QA_TENANT_SLUG = process.env.QA_TENANT_SLUG || 'default';

function withTrailingSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`;
}

/** Default-Mandant aus Seed – Pfad-basiert unter localhost (Trailing-Slash für Playwright baseURL). */
export const TENANT_BASE = withTrailingSlash(
  process.env.QA_TENANT_FRONTEND_BASE || `http://localhost:5173/${QA_TENANT_SLUG}`
);

/** Relative Navigation unter TENANT_BASE (Playwright merged /foo sonst ohne Mandanten-Prefix). */
export function tenantPath(route: string): string {
  const path = route.startsWith('/') ? route.slice(1) : route;
  return `./${path}`;
}

export const TENANT_HOST = process.env.QA_TENANT_HOST || 'localhost';
