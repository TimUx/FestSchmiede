#!/usr/bin/env node
/**
 * Generates frontend/public/sitemap.xml from the SEO content registry.
 * Run: npx tsx scripts/seo/generate-sitemap.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

async function main() {
  const { buildSitemapXml } = await import('../../frontend/src/content/seo/index.ts');
  const xml = buildSitemapXml();
  const out = path.join(root, 'frontend/public/sitemap.xml');
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, xml, 'utf8');
  console.log(`Wrote ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
