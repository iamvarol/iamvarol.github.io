// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Read directly rather than importing src/lib/about.ts: this config is loaded
// outside Vite, so the `?raw` import there would not resolve. Same file, same
// marker, so the two cannot disagree about whether About is publishable.
const aboutIsDraft = readFileSync('./src/data/bio.md', 'utf8').includes('TODO(emre)');

const excluded = ['/404/', ...(aboutIsDraft ? ['/about/'] : [])];

export default defineConfig({
  integrations: [
    sitemap({
      // Anything carrying `noindex` must not be advertised in the sitemap —
      // submitting a page for crawling while asking it not to be indexed is a
      // contradiction Search Console reports as an error.
      filter: (page) => !excluded.some((p) => page.endsWith(p)),
    }),
  ],

  // `iamvarol.github.io` is a GitHub *user* page, so it serves from the apex and
  // `base` is deliberately omitted. Adding a custom domain later is this one line
  // plus a `public/CNAME` file — no link in the codebase is base-prefixed.
  site: 'https://iamvarol.github.io',

  // Astro downloads these at build time and serves them from our own origin, so
  // there is no third-party request and nothing blocks render. It also emits the
  // preload links and generates size-adjusted local fallbacks, which is what
  // keeps the swap from shifting layout.
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
