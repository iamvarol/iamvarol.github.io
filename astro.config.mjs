// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { parse as parseYaml } from 'yaml';

// Read directly rather than importing src/lib/about.ts or src/lib/gate.ts:
// this config is loaded outside Vite, so the `?raw` import there would not
// resolve. Same files, same marker, so the two cannot disagree about what is
// publishable.
const MARKER = 'TODO(emre)';
const aboutIsDraft = readFileSync('./src/data/bio.md', 'utf8').includes(MARKER);

// A case study still carrying a marker has no route in production (see
// src/lib/work.ts), but the sitemap filter runs on the page list, so the
// exclusion is repeated here; /work/ itself drops out when nothing is
// published, since the page then carries noindex.
/** @type {{ id: string }[]} */
const work = parseYaml(readFileSync('./src/data/work.yml', 'utf8')) ?? [];
const pendingWork = work.filter((entry) => JSON.stringify(entry).includes(MARKER));
const workUrls = [
  ...pendingWork.map((entry) => `/work/${entry.id}/`),
  ...(pendingWork.length === work.length ? ['/work/'] : []),
];

// Tag pages are navigation, not content, while 18 posts share one identical
// tag set — four near-identical pages would only dilute the series page. They
// carry noindex (src/pages/tags/[tag].astro) and stay out of the sitemap until
// the tags are distinct; see `blog-tags` in decisions.yml.
const excluded = ['/404/', ...(aboutIsDraft ? ['/about/'] : []), ...workUrls];
const excludedPrefixes = ['/tags/'];

export default defineConfig({
  integrations: [
    sitemap({
      // Anything carrying `noindex` must not be advertised in the sitemap —
      // submitting a page for crawling while asking it not to be indexed is a
      // contradiction Search Console reports as an error.
      filter: (page) =>
        !excluded.some((p) => page.endsWith(p)) &&
        !excludedPrefixes.some((p) => new URL(page).pathname.startsWith(p)),
    }),
  ],

  // `iamvarol.github.io` is a GitHub *user* page, so it serves from the apex and
  // `base` is deliberately omitted. Adding a custom domain later is this one line
  // plus a `public/CNAME` file — no link in the codebase is base-prefixed.
  site: 'https://iamvarol.github.io',

  // Every <Image> and Markdown image gets a srcset sized to its rendered
  // width, so a phone stops downloading the desktop-width post heroes.
  image: {
    layout: 'constrained',
  },

  // Astro downloads these at build time and serves them from our own origin, so
  // there is no third-party request and nothing blocks render. It also emits the
  // preload links and generates size-adjusted local fallbacks, which is what
  // keeps the swap from shifting layout.
  //
  // Three families, three jobs. Inter is the neutral body and UI face. Libertinus
  // Serif carries only display sizes — the hero name, page titles, the metric
  // figures — and is the same face the Typst resume PDF and the OG card already
  // use, so a LinkedIn preview, the CV and the site read as one document.
  // JetBrains Mono is the eyebrow and metadata voice.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['400 700'],
      styles: ['normal'],
      // `latin` already covers ı ç ö ü; latin-ext is what supplies ğ ş İ Ğ Ş.
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Libertinus Serif',
      cssVariable: '--font-display',
      // Static family (400 / 600 / 700). One weight is enough for display type;
      // semibold reads better than bold at 7rem.
      weights: ['600'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      display: 'swap',
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    },
  ],
});
