import { useEffect } from 'react';
import { useRouting } from '@/contexts/RoutingProvider';
import { isPlatformSurfaceScope } from '@/types/routing';
import { useTenant } from '@/contexts/TenantProvider';
import { usePlatform } from '@/contexts/PlatformProvider';
import { FESTSCHMIEDE_LOGO_URL } from '@/components/FestSchmiedeLogo';
import { getImageUrl } from '@/services/api';

const DEFAULT_DESCRIPTION =
  'FestSchmiede ist eine moderne Open-Source-Plattform zur Organisation von Veranstaltungen – für Vereine, Schulen und gemeinnützige Organisationen.';

export interface BrandingHeadBreadcrumb {
  name: string;
  path: string;
}

export interface BrandingHeadFaq {
  q: string;
  a: string;
}

interface BrandingHeadProps {
  titleSuffix?: string;
  description?: string;
  path?: string;
  /** Indexierungssteuerung, Standard: index,follow für www */
  robots?: string;
  /** Zusätzliche JSON-LD-Graph-Knoten (werden mit Basisdaten gemerged) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: BrandingHeadBreadcrumb[];
  faqs?: BrandingHeadFaq[];
  ogType?: string;
  ogImagePath?: string;
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function absoluteUrl(origin: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = origin.replace(/\/$/, '');
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

export function BrandingHead({
  titleSuffix,
  description,
  path,
  robots,
  jsonLd,
  breadcrumbs,
  faqs,
  ogType = 'website',
  ogImagePath,
}: BrandingHeadProps) {
  const { routing } = useRouting();
  const { tenant } = useTenant();
  const { platform } = usePlatform();

  useEffect(() => {
    let title: string;
    let favicon: string | undefined;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const origin =
      routing.scope === 'www'
        ? routing.wwwUrl
        : routing.scope === 'app'
          ? routing.appUrl
          : (routing.tenantUrl || routing.appUrl || (typeof window !== 'undefined' ? window.location.origin : ''));
    const pagePath = path ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
    const canonical = absoluteUrl(origin, pagePath);

    if (isPlatformSurfaceScope(routing.scope)) {
      title = platform.name;
      favicon = undefined;
    } else if (routing.scope === 'tenant') {
      title = tenant.name;
      favicon = tenant.logoUrl ? getImageUrl(tenant.logoUrl) : undefined;
    } else {
      title = 'FestSchmiede';
    }

    document.title = titleSuffix ? `${titleSuffix} · ${title}` : title;

    const link =
      document.querySelector<HTMLLinkElement>("link[rel='icon']") ??
      (() => {
        const el = document.createElement('link');
        el.rel = 'icon';
        document.head.appendChild(el);
        return el;
      })();
    link.href = favicon ?? '/favicon.svg';

    document.documentElement.lang = (
      routing.scope === 'tenant' ? tenant.locale : platform.defaultLocale ?? 'de-DE'
    ).split('-')[0];

    const defaultRobots = routing.scope === 'www' ? 'index, follow, max-image-preview:large' : undefined;
    if (robots ?? defaultRobots) {
      upsertMeta('robots', robots ?? defaultRobots!);
    }
    upsertMeta('description', desc);
    upsertMeta('og:title', document.title, 'property');
    upsertMeta('og:description', desc, 'property');
    upsertMeta('og:type', ogType, 'property');
    upsertMeta('og:url', canonical, 'property');
    upsertMeta('og:site_name', platform.name, 'property');
    upsertMeta('og:locale', 'de_DE', 'property');

    const defaultOgImage = absoluteUrl(origin, ogImagePath ?? FESTSCHMIEDE_LOGO_URL);
    const ogImage = isPlatformSurfaceScope(routing.scope)
      ? defaultOgImage
      : (getImageUrl(tenant.logoUrl ?? undefined) ?? defaultOgImage);
    upsertMeta('og:image', ogImage, 'property');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:image', ogImage);
    upsertMeta('twitter:title', document.title);
    upsertMeta('twitter:description', desc);

    let canonicalEl = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    const graph: Record<string, unknown>[] = [];

    if (routing.scope === 'www') {
      const orgId = `${origin.replace(/\/$/, '')}/#organization`;
      const websiteId = `${origin.replace(/\/$/, '')}/#website`;
      const appId = `${origin.replace(/\/$/, '')}/#software`;

      graph.push({
        '@type': 'Organization',
        '@id': orgId,
        name: platform.name,
        url: origin.replace(/\/$/, ''),
        logo: absoluteUrl(origin, FESTSCHMIEDE_LOGO_URL),
        sameAs: ['https://github.com/TimUx/FestSchmiede'],
      });

      graph.push({
        '@type': 'WebSite',
        '@id': websiteId,
        name: platform.name,
        url: origin.replace(/\/$/, ''),
        inLanguage: 'de-DE',
        publisher: { '@id': orgId },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${origin.replace(/\/$/, '')}/faq?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      });

      graph.push({
        '@type': ['SoftwareApplication', 'Product'],
        '@id': appId,
        name: platform.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: desc,
        url: canonical,
        image: ogImage,
        brand: { '@id': orgId },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl(origin, '/mandant-beantragen'),
        },
      });

      if (breadcrumbs && breadcrumbs.length > 0) {
        graph.push({
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: absoluteUrl(origin, crumb.path),
          })),
        });
      }

      if (faqs && faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        });
      }
    } else {
      graph.push({
        '@type': 'SoftwareApplication',
        name: platform.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: desc,
        url: canonical,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      });
    }

    if (jsonLd) {
      const extra = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      graph.push(...extra);
    }

    const existing = document.getElementById('fm-structured-data');
    existing?.remove();
    const script = document.createElement('script');
    script.id = 'fm-structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
    document.head.appendChild(script);
  }, [
    routing.scope,
    routing.wwwUrl,
    routing.appUrl,
    tenant.name,
    tenant.logoUrl,
    tenant.locale,
    platform.name,
    platform.defaultLocale,
    titleSuffix,
    description,
    path,
    robots,
    jsonLd,
    breadcrumbs,
    faqs,
    ogType,
    ogImagePath,
  ]);

  return null;
}
