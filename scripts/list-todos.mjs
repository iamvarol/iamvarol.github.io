/**
 * Lists everything still waiting on Emre.
 *
 *   npm run todo
 *
 * Finds the TODO(emre) marker across src/ and reports it grouped by file, so the
 * outstanding items live in the repo rather than scrolling out of a chat window.
 * Exits 0 always — this is a report, not a gate. The gate is that no page renders
 * a file while it still contains a marker.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const MARKER = 'TODO(emre)';
const ROOT = 'src';
const SKIP = new Set(['node_modules', 'dist', '.astro', '.git']);
// Defines the marker rather than carrying one.
const SKIP_FILES = new Set(['src/lib/gate.ts']);

/** What each file is for, so the report explains itself. */
const CONTEXT = {
  'src/data/landing.yml': 'Landing — a hero field stays hidden until its marker is replaced',
  'src/data/bio.md': 'About narrative — the page is hidden while a marker remains',
  'src/data/work.yml':
    'Selected work — a case study stays unpublished (no route, no nav, no sitemap) until its markers are gone',
  'src/data/contact.yml': 'Contact — pending fields are hidden one by one; the page itself is live',
  'src/data/resume.yml':
    'Resume — comment-only markers (URLs, languages); nothing here is gated, so never leave a marker in a rendered field',
  'src/data/decisions.yml': 'Open decisions — none of these block anything; each has a default',
};

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}

const findings = new Map();

for (const path of walk(ROOT)) {
  if (SKIP_FILES.has(relative('.', path))) continue;
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    continue; // binary or unreadable — nothing to scan
  }
  if (!text.includes(MARKER)) continue;

  const hits = text
    .split('\n')
    .map((line, i) => ({ line: i + 1, text: line.trim() }))
    .filter((l) => l.text.includes(MARKER));

  findings.set(relative('.', path), hits);
}

if (findings.size === 0) {
  console.log('\n✓ Nothing outstanding — no TODO(emre) markers in src/.\n');
  process.exit(0);
}

const total = [...findings.values()].reduce((n, hits) => n + hits.length, 0);
console.log(`\n${total} item(s) waiting on you, in ${findings.size} file(s):\n`);

for (const [path, hits] of findings) {
  console.log(`  ${path}`);
  if (CONTEXT[path]) console.log(`  ${'─'.repeat(path.length)}  ${CONTEXT[path]}`);
  for (const hit of hits) {
    const shown = hit.text.length > 96 ? `${hit.text.slice(0, 93)}…` : hit.text;
    console.log(`    ${String(hit.line).padStart(4)}  ${shown}`);
  }
  console.log('');
}

console.log('Replace the values, then re-run `npm run todo`.\n');
