import { getEntry } from 'astro:content';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** '2025-08' → 'Aug 2025'. */
export function formatMonth(value: string): string {
  const [y, m] = value.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/**
 * '2023-02' + null → 'Feb 2023 — Present'.
 *
 * The `end: null` means present convention is honoured identically here and in
 * resume/lib.typ, so the page and the PDF can never disagree about which role
 * is current.
 */
export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : 'Present'}`;
}

/** '2014' + '2022' → '2014 — 2022'; end alone → '2022'. */
export function formatYears(start: string | undefined, end: string): string {
  return start ? `${start} — ${end}` : end;
}

/**
 * A publication or writing date, at whatever precision the entry carries:
 * '2013' → '2013'; '2022-04' → 'Apr 2022'; '2021-11-03' → '3 Nov 2021'.
 *
 * The day form matches FormattedDate's `short` output, so the same date reads
 * identically on /resume and on a blog post. Mirrored by fmt-ref-date() in
 * resume/lib.typ — change one and you must change the other.
 */
export function formatRefDate(value: string): string {
  const [y, m, d] = value.split('-');
  if (!m) return y;
  if (!d) return formatMonth(`${y}-${m}`);
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}

export async function getResume() {
  const entry = await getEntry('resume', 'main');
  if (!entry) {
    // Only reachable if src/data/resume.yml is deleted or renamed; failing here
    // is better than rendering an empty resume page.
    throw new Error('resume entry "main" not found — check src/data/resume.yml');
  }
  return entry.data;
}

/** One stop on the landing page's career timeline. */
export interface CareerStage {
  /** Anchor target. Index-based, not year-based, so two roles starting in the
   *  same year could never collide on one id. */
  id: string;
  /** The rail marker. Years rather than 01–0n: the landing "What I work on"
   *  list and the /resume section headings already own the ordinal register,
   *  and ExperienceEntry explains why roles are not numbered. */
  year: string;
  /** Rail label — `short` where the company name is too wide for a stop. */
  label: string;
  company: string;
  role: string;
  range: string;
  blurb: string;
  stack: string[];
}

/**
 * The experience list as timeline stops, newest first.
 *
 * Order is resume.yml's own, deliberately not reversed: the first stop is the
 * current role, which is both what a hiring manager should read first and —
 * because index 0 is also the scroll origin — what lets the carousel render its
 * correct initial state on the server and never scroll on load.
 */
export async function getCareerStages(idBase = 'career'): Promise<CareerStage[]> {
  const { experience } = await getResume();

  return experience.map((role, i) => ({
    id: `${idBase}-${i}`,
    year: role.start.slice(0, 4),
    label: role.short ?? role.company,
    company: role.company,
    role: role.role,
    range: formatRange(role.start, role.end),
    blurb: role.blurb,
    // Capped so a card cannot grow a second line of chips and break the row
    // height the coverflow scaling depends on.
    stack: role.stack.slice(0, 4),
  }));
}

export async function getLanding() {
  const entry = await getEntry('landing', 'main');
  if (!entry) {
    throw new Error('landing entry "main" not found — check src/data/landing.yml');
  }
  return entry.data;
}
