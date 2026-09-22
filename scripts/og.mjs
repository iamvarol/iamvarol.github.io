/**
 * Compiles a share card per blog post and per published case study.
 *
 *   npm run og:pages        (after `npm run og:png`, which creates dist/og/)
 *
 * Reads the same sources the pages do — blog frontmatter, series.yml,
 * work.yml — applies the same gates (drafts and pending case studies get no
 * card, because they get no page), and shells out to the pinned Typst with
 * SOURCE_DATE_EPOCH so a given commit yields identical bytes. The forecast
 * geometry is passed in from src/lib/forecast.mjs, the module the hero's
 * band draws from, so the motif is the same on the page and on the card.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { forecastGeometry, typstPoints } from '../src/lib/forecast.mjs';

const OUT = 'dist/og';
const MARKER = 'TODO(emre)';

const epoch = (() => {
  try {
    return execFileSync('git', ['log', '-1', '--format=%ct'], { encoding: 'utf8' }).trim();
  } catch {
    return '0';
  }
})();

const { hist, mid, hi, lo } = forecastGeometry();
const band = typstPoints([...hi, ...[...lo].reverse()]);
const geometry = { hist: typstPoints(hist), fcst: typstPoints(mid), band };

/** @type {{ slug: string; title: string; eyebrow: string }[]} */
const cards = [];

// Blog posts. Frontmatter is the block between the first two `---` lines.
const series = new Map(
  (parseYaml(readFileSync('src/data/series.yml', 'utf8')) ?? []).map((s) => [s.id, s.title]),
);
for (const file of readdirSync('src/content/blog')) {
  if (!file.endsWith('.md') || file.startsWith('_')) continue;
  const text = readFileSync(join('src/content/blog', file), 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) continue;
  const fm = parseYaml(m[1]);
  if (fm.draft) continue;
  const slug = basename(file, '.md');
  const eyebrow =
    fm.series && series.has(fm.series)
      ? `${series.get(fm.series)} · Part ${fm.part}`
      : `Blog · ${new Date(fm.date).getFullYear()}`;
  cards.push({ slug, title: fm.title, eyebrow });
}

// Case studies — only those that have cleared their markers.
if (existsSync('src/data/work.yml')) {
  const work = parseYaml(readFileSync('src/data/work.yml', 'utf8')) ?? [];
  for (const entry of work) {
    if (JSON.stringify(entry).includes(MARKER)) continue;
    cards.push({ slug: entry.id, title: entry.title, eyebrow: `Selected work · ${entry.company}` });
  }
}

mkdirSync(OUT, { recursive: true });

let failed = 0;
for (const card of cards) {
  const args = [
    'compile',
    '--root',
    '.',
    '--ignore-system-fonts',
    '--format',
    'png',
    '--ppi',
    '72',
    '--input',
    `title=${card.title}`,
    '--input',
    `eyebrow=${card.eyebrow}`,
    '--input',
    `hist=${geometry.hist}`,
    '--input',
    `fcst=${geometry.fcst}`,
    '--input',
    `band=${geometry.band}`,
    'og/page.typ',
    join(OUT, `${card.slug}.png`),
  ];
  const result = spawnSync('typst', args, {
    stdio: ['ignore', 'ignore', 'pipe'],
    env: { ...process.env, SOURCE_DATE_EPOCH: epoch },
  });
  if (result.status !== 0) {
    failed++;
    console.error(`✗ ${card.slug}: ${result.stderr?.toString().trim() || result.error?.message}`);
  }
}

if (failed > 0) {
  console.error(`\n✗ ${failed} of ${cards.length} share card(s) failed`);
  process.exit(1);
}
console.log(`✓ ${cards.length} share card(s) written to ${OUT}/`);
