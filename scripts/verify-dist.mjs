/**
 * Asserts the built site honours the publication gates.
 *
 *   npm run verify:dist        (after `npm run build`)
 *
 * The gates in src/lib/gate.ts keep unapproved copy off the live site by
 * convention; this makes it an invariant the deploy enforces. It fails when:
 *
 *   1. any built HTML or XML still contains the TODO(emre) marker;
 *   2. an internal link opens in a new tab (target="_blank" on an href="/…"),
 *      which breaks the back button and defeats view transitions;
 *   3. the sitemap advertises a page that carries noindex, or omits an
 *      indexable page — Search Console reports the first as an error;
 *   4. a case study whose data still carries a marker got a route anyway.
 *
 * Exits 1 on any failure, 2 if dist/ is missing.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

const DIST = 'dist';
const MARKER = 'TODO(emre)';

if (!existsSync(DIST)) {
  console.error(`✗ ${DIST}/ not found — run \`npm run build\` first`);
  process.exit(2);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const failures = [];
const pages = new Map(); // url path → { noindex }

for (const path of walk(DIST)) {
  if (!/\.(html|xml)$/.test(path)) continue;
  const text = readFileSync(path, 'utf8');
  const rel = relative(DIST, path);

  // 1. Unapproved copy.
  if (text.includes(MARKER)) failures.push(`marker leaked: ${rel}`);

  if (!path.endsWith('.html')) continue;

  // 2. Internal links in new tabs. Attribute order varies, so test each <a>.
  for (const [tag] of text.matchAll(/<a\s[^>]*>/g)) {
    const href = tag.match(/\bhref="([^"]*)"/)?.[1];
    if (href?.startsWith('/') && /\btarget="_blank"/.test(tag)) {
      failures.push(`internal link opens a new tab: ${rel} → ${href}`);
    }
  }

  // Collect for the sitemap check. dist/foo/index.html serves at /foo/.
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '/');
  pages.set(url, { noindex: /<meta name="robots" content="noindex/.test(text) });
}

// 3. Sitemap ↔ noindex parity.
const sitemapPath = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapPath)) {
  const listed = new Set(
    [...readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      ([, loc]) => new URL(loc).pathname,
    ),
  );
  for (const [url, { noindex }] of pages) {
    if (noindex && listed.has(url)) failures.push(`noindex page in sitemap: ${url}`);
    if (!noindex && !listed.has(url) && url !== '/404/') {
      failures.push(`indexable page missing from sitemap: ${url}`);
    }
  }
} else {
  failures.push('sitemap-0.xml not found in dist/');
}

// 4. Pending case studies must have no route.
const workPath = 'src/data/work.yml';
if (existsSync(workPath)) {
  const work = parseYaml(readFileSync(workPath, 'utf8')) ?? [];
  for (const entry of work) {
    if (JSON.stringify(entry).includes(MARKER) && pages.has(`/work/${entry.id}/`)) {
      failures.push(`pending case study has a route: /work/${entry.id}/`);
    }
  }
}

if (failures.length > 0) {
  console.error(`\n✗ ${DIST}/ failed verification\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('');
  process.exit(1);
}

console.log(`✓ ${DIST}/: ${pages.size} pages, no leaked markers, links and sitemap consistent`);
