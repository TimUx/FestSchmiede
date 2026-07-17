export type {
  SeoFaqItem,
  SeoSection,
  SeoLandingPage,
  SeoCluster,
  SeoStaticPage,
} from './types';

export {
  SEO_LANDING_PAGES,
  SEO_BASE_URL,
  SEO_SITE_ORIGIN,
  getSeoPageBySlug,
  listSeoPages,
  listSeoSlugs,
  buildSitemapXml,
} from './seoLandingPages';

export { SEO_GLOBAL_FAQS } from './globalFaqs';
export { SEO_STATIC_PAGES } from './staticPages';
