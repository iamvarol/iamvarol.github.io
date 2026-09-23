import { getCollection, type CollectionEntry } from 'astro:content';
import { isPending, showDrafts } from './gate';
import { getResume, formatRange, companyId } from './resume';

export type WorkEntry = CollectionEntry<'work'>;

/** A case study joined to the role it came from. */
export interface CaseStudy {
  id: string;
  href: string;
  title: string;
  company: string;
  /** Anchor on /resume/ for the role this came from. */
  roleHref: string;
  sector: string;
  role: string;
  range: string;
  /** Rail-style marker — the year the work started. */
  year: string;
  summary: string;
  problem: string;
  approach: string[];
  outcomes: string[];
  metrics: { value: string; label: string }[];
  stack: string[];
  links: { label: string; href: string }[];
  order: number;
  /** Still carrying the marker — only ever true in `npm run dev`. */
  draft: boolean;
}

/**
 * Case studies a visitor may see, in display order.
 *
 * The gate is the marker: an entry with any marker left is dropped in
 * production (no route, no nav, no sitemap) and shown as a draft in dev. The
 * role, its dates and the card line come from resume.yml by `company`, so
 * there is no second career list to drift — and a company name that matches
 * nothing fails the build rather than rendering a case study for a job that
 * does not exist. Metric values are held to the same standard as the landing
 * proof strip: each must appear verbatim in that role's highlights.
 */
export async function getWork(): Promise<CaseStudy[]> {
  const entries = await getCollection('work');
  const { experience } = await getResume();

  return entries
    .filter((entry) => showDrafts || !isPending(entry.data))
    .map((entry) => {
      const d = entry.data;
      const role = experience.find((r) => r.company === d.company);
      if (!role) {
        throw new Error(
          `work.yml "${entry.id}": company "${d.company}" is not an experience[].company in resume.yml`,
        );
      }
      const bullets = role.highlights.join(' ');
      for (const m of d.metrics) {
        if (!bullets.includes(m.value)) {
          throw new Error(
            `work.yml "${entry.id}": metric "${m.value}" does not appear in the ${d.company} highlights in resume.yml`,
          );
        }
      }
      const start = d.period?.start ?? role.start;
      const end = d.period ? d.period.end : role.end;

      return {
        id: entry.id,
        href: `/work/${entry.id}/`,
        title: d.title,
        company: d.company,
        roleHref: `/resume/#exp-${companyId(d.company)}`,
        sector: d.sector,
        role: role.role,
        range: formatRange(start, end),
        year: start.slice(0, 4),
        summary: d.summary ?? role.blurb,
        problem: d.problem,
        approach: d.approach,
        outcomes: d.outcomes,
        metrics: d.metrics,
        stack: d.stack,
        links: d.links,
        order: d.order,
        draft: isPending(d),
      };
    })
    .sort((a, b) => a.order - b.order);
}

/** True when at least one case study is visible — drives the nav and /work/'s indexability. */
export async function hasWork(): Promise<boolean> {
  return (await getWork()).length > 0;
}
