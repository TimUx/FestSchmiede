import type { SeoLandingPage } from './types';
import {
  SOFTWARE_CLUSTER_PAGES,
  ORGANISATION_CLUSTER_PAGES,
  VERANSTALTUNGEN_CLUSTER_PAGES,
} from './pages';
import { SEO_STATIC_PAGES } from './staticPages';

export type {
  SeoFaqItem,
  SeoSection,
  SeoLandingPage,
  SeoCluster,
  SeoStaticPage,
} from './types';
export { SEO_GLOBAL_FAQS } from './globalFaqs';
export { SEO_STATIC_PAGES } from './staticPages';

export const SEO_BASE_URL = 'https://www.festschmiede.de';
export const SEO_SITE_ORIGIN = SEO_BASE_URL;

/** Alle SEO-/LLMO-Landingpages (18). */
export const SEO_LANDING_PAGES: SeoLandingPage[] = [
  ...SOFTWARE_CLUSTER_PAGES,
  ...ORGANISATION_CLUSTER_PAGES,
  ...VERANSTALTUNGEN_CLUSTER_PAGES,
];

const bySlug = new Map(SEO_LANDING_PAGES.map((page) => [page.slug, page]));

export function getSeoPageBySlug(slug: string): SeoLandingPage | undefined {
  const normalized = slug.replace(/^\//, '');
  return bySlug.get(normalized);
}

export function listSeoPages(): SeoLandingPage[] {
  return SEO_LANDING_PAGES;
}

export function listSeoSlugs(): string[] {
  return SEO_LANDING_PAGES.map((page) => page.slug);
}

export function buildSitemapXml(lastmod = new Date().toISOString().slice(0, 10)): string {
  const staticEntries = SEO_STATIC_PAGES.map((page) => ({
    loc: `${SEO_SITE_ORIGIN}${page.path === '/' ? '/' : page.path}`,
    changefreq: page.changefreq ?? 'monthly',
    priority: page.priority ?? 0.5,
  }));

  const landingEntries = SEO_LANDING_PAGES.map((page) => ({
    loc: `${SEO_SITE_ORIGIN}/${page.slug}`,
    changefreq: 'monthly' as const,
    priority: 0.8,
  }));

  const themen = {
    loc: `${SEO_SITE_ORIGIN}/themen`,
    changefreq: 'weekly' as const,
    priority: 0.9,
  };

  const urls = [themen, ...staticEntries, ...landingEntries];
  const body = urls
    .map(
      (entry) => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${Number(entry.priority).toFixed(1)}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
