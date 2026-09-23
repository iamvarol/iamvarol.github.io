/**
 * Every name, URL and handle used anywhere on the site.
 *
 * This is one of two load-bearing files (the other is src/data/resume.yml).
 * Moving to a custom domain is `url` here plus `site` in astro.config.mjs plus
 * a public/CNAME — nothing else, because no link in the codebase is prefixed
 * with a base path.
 */
import type { IconName } from './icons';

export const site = {
  url: 'https://iamvarol.github.io',

  /** Full legal name — used in JSON-LD, the resume, and copyright. */
  name: 'Ali Emre Varol',
  /** How he is addressed day to day — used in the header wordmark. */
  shortName: 'Emre Varol',

  /** The plain job title — <title>, JSON-LD jobTitle, og:image:alt. Mirrors
   *  `basics.label` in resume.yml; change both together (see `positioning` in
   *  decisions.yml). */
  role: 'Senior Data Scientist',

  title: 'Ali Emre Varol — Senior Data Scientist',
  /** Third person, assembled from his positioning copy (2026-09-23), not written anew. */
  description:
    'Senior Data Scientist building AI systems for real-world operations — across data, ' +
    'machine learning and engineering, from ambiguous customer problems to production ' +
    'systems. Istanbul, Türkiye.',

  /** The landing-page h1: his positioning sentence, verbatim (2026-09-23). The name
   *  sits in the eyebrow above it, the header wordmark, <title> and JSON-LD. */
  tagline: 'Senior Data Scientist building AI systems for real-world operations.',

  /** Two sentences, first person. Used for the landing intro and JSON-LD.
   *  The longer narrative belongs on /about; the full professional summary
   *  lives in src/data/resume.yml under `basics.summary`. */
  bio:
    'Industrial engineer turned data scientist — twenty years in engineering and ' +
    'analytics, seven of them shipping production machine learning. I build ' +
    'forecasting, optimization and data-quality systems for enterprise retail, and ' +
    'I own the problem end to end: the framing, the pipeline, the model, and the ' +
    'conversation with the executive who has to trust the output.',

  locale: 'en',
  location: 'Istanbul, Türkiye',
  /** Türkiye has had no daylight saving since 2016, so the offset is a constant. */
  timezone: 'Europe/Istanbul',
  utcOffset: 'UTC+3',
  email: 'a.emrevarol@gmail.com',

  /** The compiled resume, dropped into dist/ by `npm run assets`. Stable so a
   *  recruiter's saved copy keeps a sensible name, and named once so the
   *  download links and the CI parity check cannot disagree about the path. */
  resumePdf: '/emre-varol-resume.pdf',
} as const;

export type SocialLink = {
  label: string;
  href: string;
  icon: IconName;
  /** Shown in the footer; the contact page lists all of them. */
  primary?: boolean;
};

export const socials: SocialLink[] = [
  { label: 'Email', href: `mailto:${site.email}`, icon: 'mail', primary: true },
  { label: 'GitHub', href: 'https://github.com/iamvarol', icon: 'github', primary: true },
  // The archived Hugo site had this URL without the `/in/` segment, which 404s.
  // Now the vanity handle from the 2026 resume, so the site and the PDF agree —
  // the older `/in/ali-emre-varol-012989193/` form still resolves to the same profile.
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/aliemre-v',
    icon: 'linkedin',
    primary: true,
  },
  {
    label: 'Stack Overflow',
    href: 'https://stackoverflow.com/users/12928224/iamvarol',
    icon: 'stack-overflow',
  },
  { label: 'X', href: 'https://x.com/iamvarol', icon: 'x' },
];

export type NavItem = {
  label: string;
  href: string;
  /** Flipped to true as each phase lands, so the nav never links to a 404. */
  ready: boolean;
};

export const nav: NavItem[] = [
  { label: 'About', href: '/about/', ready: true },
  { label: 'Work', href: '/work/', ready: true },
  { label: 'Resume', href: '/resume/', ready: true },
  { label: 'Writing', href: '/blog/', ready: true },
  { label: 'Contact', href: '/contact/', ready: true },
];

export const readyNav = (): NavItem[] => nav.filter((item) => item.ready);

/** True when `href` is the current page or an ancestor of it. */
export const isActive = (href: string, pathname: string): boolean => {
  const a = href.endsWith('/') ? href : `${href}/`;
  const b = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return b === a || (a !== '/' && b.startsWith(a));
};
