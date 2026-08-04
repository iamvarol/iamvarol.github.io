/**
 * Asserts the compiled resume PDF actually contains what src/data/resume.yml says.
 *
 * The page and the PDF share one data file but are rendered by two independent
 * engines (Astro and Typst). The *data* therefore cannot drift — but the Typst
 * template could silently stop emitting a section, and a resume that quietly
 * loses a job is worse than a build that fails. This closes that gap.
 *
 *   node scripts/verify-pdf.mjs <path-to-pdf>
 */

import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { extractText, getDocumentProxy } from 'unpdf';

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('usage: node scripts/verify-pdf.mjs <path-to-pdf>');
  process.exit(2);
}

/** Collapse whitespace and case so line wrapping in the PDF can't cause a miss. */
const normalize = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

const resume = parseYaml(readFileSync('src/data/resume.yml', 'utf8'));

// pdf.js emits font-substitution warnings for Typst's subset-embedded fonts and
// a Math.sumPrecise polyfill notice. Neither affects text extraction, and both
// read as failures in a CI log, so they are muted for the duration of the parse.
const realWarn = console.warn;
console.warn = () => {};
let text, totalPages;
try {
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(pdfPath)));
  ({ text, totalPages } = await extractText(pdf, { mergePages: true }));
} finally {
  console.warn = realWarn;
}
const haystack = normalize(text);

/** Everything that must survive the trip from YAML to PDF. */
const expected = [
  ['name', resume.basics.name],
  ['email', resume.basics.email],
  ...resume.experience.flatMap((role) => [
    ['company', role.company],
    ['role', role.role],
  ]),
  ...resume.education.map((e) => ['institution', e.institution]),
  ...resume.publications.map((p) => ['publication', p.title]),
  ...resume.writing.map((w) => ['writing', w.title]),
];

const missing = expected.filter(([, value]) => !haystack.includes(normalize(value)));

// A resume that runs long reads as unedited. Two pages is the intent; three is
// a signal to trim, not something to discover after sending it to someone.
const PAGE_LIMIT = 2;
const tooLong = totalPages > PAGE_LIMIT;

if (missing.length > 0 || tooLong) {
  console.error(`\n✗ ${pdfPath} failed verification\n`);
  for (const [kind, value] of missing) {
    console.error(`  missing ${kind}: ${value}`);
  }
  if (tooLong) {
    console.error(`  ${totalPages} pages, expected at most ${PAGE_LIMIT}`);
    console.error('  → tighten resume/resume.typ or trim src/data/resume.yml');
  }
  console.error('');
  process.exit(1);
}

console.log(
  `✓ ${pdfPath}: ${totalPages} page(s), all ${expected.length} required strings present`,
);
