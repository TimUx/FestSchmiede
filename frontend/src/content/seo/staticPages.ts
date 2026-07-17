import type { SeoStaticPage } from './types';

/** Bestehende öffentliche Marketing-Routen für Sitemap & interne Verlinkung. */
export const SEO_STATIC_PAGES: SeoStaticPage[] = [
  { path: '/', title: 'Startseite', priority: 1, changefreq: 'weekly' },
  { path: '/funktionen', title: 'Funktionen', priority: 0.9, changefreq: 'monthly' },
  { path: '/screenshots', title: 'Screenshots', priority: 0.7, changefreq: 'monthly' },
  { path: '/open-source', title: 'Open Source', priority: 0.8, changefreq: 'monthly' },
  { path: '/ueber-das-projekt', title: 'Über das Projekt', priority: 0.8, changefreq: 'monthly' },
  { path: '/ueber-den-entwickler', title: 'Über den Entwickler', priority: 0.6, changefreq: 'yearly' },
  { path: '/fuer-vereine', title: 'Für Vereine', priority: 0.9, changefreq: 'monthly' },
  { path: '/mandant-beantragen', title: 'Mandant beantragen', priority: 0.9, changefreq: 'monthly' },
  { path: '/faq', title: 'FAQ', priority: 0.8, changefreq: 'monthly' },
  { path: '/kontakt', title: 'Kontakt', priority: 0.7, changefreq: 'yearly' },
  { path: '/dokumentation', title: 'Dokumentation', priority: 0.6, changefreq: 'monthly' },
  { path: '/download', title: 'Download', priority: 0.6, changefreq: 'monthly' },
  { path: '/plattform-status', title: 'Plattform-Status', priority: 0.4, changefreq: 'daily' },
  { path: '/rechtliches/impressum', title: 'Impressum', priority: 0.3, changefreq: 'yearly' },
  { path: '/rechtliches/datenschutz', title: 'Datenschutz', priority: 0.3, changefreq: 'yearly' },
  { path: '/rechtliches/nutzungsbedingungen', title: 'Nutzungsbedingungen', priority: 0.3, changefreq: 'yearly' },
];
