import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { parse as parseYaml } from 'yaml';
// `import { z } from 'astro:content'` is deprecated in Astro 7; astro/zod is the
// bundled instance, so this adds no dependency.
import { z } from 'astro/zod';

/**
 * Blog.
 *
 * Adding a post is dropping one `.md` file into src/content/blog/ and pushing.
 * The filename becomes the URL slug — `forecasting-at-scale.md` serves at
 * /blog/forecasting-at-scale/ — so there is no slug field to keep in sync.
 *
 * The schema is deliberately strict. A typo here fails `npm run build` and the
 * deploy never runs, which is the whole point: a broken page should never reach
 * the site.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(120),

    // `coerce` accepts an unquoted YAML date (2026-08-02) or a quoted string.
    // Anything unparseable is a build error rather than an Invalid Date on the page.
    date: z.coerce.date(),

    // Does triple duty: listing subtitle, meta description, OG description.
    // Capped so a runaway paragraph can't stand in for a subtitle; 500 covers
    // the longest existing description (461) with headroom. Search engines
    // still truncate display past ~160 regardless of this cap.
    description: z.string().min(1).max(500),

    // Lowercase-kebab enforced so "Machine Learning", "machine-learning" and
    // "ML" can't silently become three separate tag pages.
    tags: z
      .array(
        z
          .string()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'tags must be lowercase-kebab, e.g. "time-series"'),
      )
      .default([]),

    draft: z.boolean().default(false),

    // Membership in a series (src/data/series.yml). `reference` makes a typo
    // in the id a build error; `part` orders the posts within it.
    series: reference('series').optional(),
    part: z.number().int().positive().optional(),

    // Cross-post attribution. `link` is optional — some posts haven't been
    // cross-posted yet — and `.nullable()` because an empty `link:` in YAML
    // parses as null, not undefined. `link_text` alone never renders a
    // dangling label; call sites guard on `link` being truthy.
    link: z.string().url().nullable().optional(),
    link_text: z.string().min(1).max(60).default('Read on Medium'),
  }),
});

/** 'YYYY-MM'. Month precision, so the page formats the range instead of storing
 *  a second, driftable copy of the display string. */
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "use 'YYYY-MM', e.g. '2025-08'");
const year = z.string().regex(/^\d{4}$/, "use 'YYYY', e.g. '2022'");

/** 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'. Precision varies per entry — a conference
 *  paper is dated to the month, a blog post to the day, an older paper to the
 *  year alone — so the renderers format whatever precision is present rather
 *  than forcing a month nobody has. */
const refDate = z
  .string()
  .regex(
    /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/,
    "use 'YYYY', 'YYYY-MM' or 'YYYY-MM-DD'",
  );

/** Publications and writing are the same shape; only the heading differs.
 *  `url` is optional: a piece that isn't online, or whose link hasn't been
 *  supplied yet, renders as plain text rather than a dead anchor. */
const citation = z.object({
  title: z.string(),
  venue: z.string(),
  date: refDate,
  url: z.string().url().optional(),
});

/**
 * Resume.
 *
 * src/data/resume.yml is read twice at build time by two renderers — this
 * collection for /resume, and resume/resume.typ for the PDF. There is no export
 * step and no second copy of the employment history, so the *data* cannot drift.
 * Only the presentation can, which is what scripts/verify-pdf.mjs guards.
 *
 * The file is one object rather than an array, so `file()` gets a parser that
 * names it: without one the loader would treat each top-level key (`skills`,
 * `experience`, …) as a separate entry, and the array-valued ones are not
 * valid entries.
 */
const resume = defineCollection({
  loader: file('./src/data/resume.yml', {
    parser: (text) => ({ main: parseYaml(text) }),
  }),
  schema: z.object({
    basics: z.object({
      name: z.string(),
      label: z.string(),
      focus: z.array(z.string()).min(1),
      location: z.string(),
      email: z.string().email(),
      // Commented out in the YAML on purpose: the PDF is served from a public
      // URL, so anything here is as exposed as the web page.
      phone: z.string().optional(),
      linkedin: z.string().url(),
      github: z.string().url(),
      // Optional until he fills it in; rendered in both mastheads when present.
      languages: z
        .array(
          z.object({
            name: z.string().min(1),
            level: z.string().min(1),
          }),
        )
        .min(1)
        .optional(),
      summary: z.string(),
    }),

    skills: z
      .array(
        z.object({
          group: z.string(),
          items: z.array(z.string()).min(1),
        }),
      )
      .default([]),

    experience: z
      .array(
        z.object({
          company: z.string(),
          // Rail label for the landing timeline, where the full company name is
          // too wide for a stop. Falls back to `company`.
          short: z.string().max(24).optional(),
          role: z.string(),
          location: z.string().optional(),
          start: yearMonth,
          end: yearMonth.nullable(), // null renders as "Present"
          context: z.string().optional(),
          // One sentence for the landing timeline card. Required, not optional
          // with a fallback: `context` exists on one entry only and
          // `highlights[0]` is a 30-word bullet, so there is nothing honest to
          // fall back to. Adding a job therefore forces writing the one-liner.
          // 200 matches the blog `description` cap for the same reason — a card
          // that overflows is worse than a build that tells you to shorten it.
          blurb: z.string().min(1).max(200),
          highlights: z.array(z.string()).min(1),
          stack: z.array(z.string()).default([]),
        }),
      )
      .min(1),

    education: z
      .array(
        z.object({
          institution: z.string(),
          location: z.string().optional(),
          degree: z.string(),
          start: year.optional(),
          end: year,
          note: z.string().optional(),
          gpa: z.string().optional(),
          detail: z.string().optional(),
        }),
      )
      .default([]),

    publications: z.array(citation).default([]),

    writing: z.array(citation).default([]),

    certifications: z.array(z.string()).default([]),
  }),
});

/**
 * Landing page copy.
 *
 * A collection rather than a plain import so the same guarantee as the blog
 * applies: a mistyped key or a missing `detail` fails the build instead of
 * rendering a blank line on the first page a hiring manager sees.
 */
const landing = defineCollection({
  loader: file('./src/data/landing.yml', {
    parser: (text) => ({ main: parseYaml(text) }),
  }),
  schema: z.object({
    hero: z.object({
      statement: z.string().min(1),
      cta: z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      }),
      // A quieter second action beside the pill — the PDF, today.
      secondary: z
        .object({
          label: z.string().min(1),
          href: z.string().min(1),
        })
        .optional(),
      // The availability line: level open to, remote posture, from when. His
      // words; while the text still carries TODO(emre) the line is withheld
      // from production by src/lib/gate.ts and shown only in `npm run dev`.
      status: z
        .object({
          text: z.string().min(1).max(120),
          href: z.string().min(1).optional(),
        })
        .optional(),
    }),
    // "What I work on" — the numbered 01–0n list.
    focus: z
      .array(
        z.object({
          title: z.string().min(1),
          detail: z.string().min(1),
        }),
      )
      .min(1)
      .max(6), // beyond six the sequence stops reading as a shortlist
    // The proof strip under the hero. `value` must appear verbatim in the
    // highlights of the experience entry named by `source` (or in
    // basics.summary for 'summary'); getLanding() throws otherwise, so a number
    // changed in resume.yml fails the build here instead of drifting.
    proof: z
      .array(
        z.object({
          value: z.string().min(1).max(12),
          label: z.string().min(1).max(60),
          source: z.string().min(1),
        }),
      )
      .min(3)
      .max(4)
      .optional(),
  }),
});

/**
 * Selected work — case studies.
 *
 * An array with an `id` per item, so `file()` needs no parser. The role,
 * dates and card line are joined from resume.yml by `company` in
 * src/lib/work.ts, which is also where the publication gate lives: an entry
 * still carrying a TODO(emre) marker never gets a route in production.
 */
const work = defineCollection({
  loader: file('./src/data/work.yml'),
  schema: z.object({
    title: z.string().min(1).max(80),
    company: z.string().min(1),
    sector: z.string().min(1).max(40),
    period: z
      .object({
        start: yearMonth,
        end: yearMonth.nullable(),
      })
      .optional(),
    summary: z.string().min(1).max(200).optional(),
    problem: z.string().min(1),
    approach: z.array(z.string().min(1)).min(1),
    outcomes: z.array(z.string().min(1)).min(1),
    metrics: z
      .array(
        z.object({
          value: z.string().min(1).max(12),
          label: z.string().min(1).max(60),
        }),
      )
      .max(4)
      .default([]),
    stack: z.array(z.string()).default([]),
    links: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
        }),
      )
      .default([]),
    order: z.number().int().positive(),
  }),
});

/** Blog series — the title a post's `series` id resolves to. */
const series = defineCollection({
  loader: file('./src/data/series.yml'),
  schema: z.object({
    title: z.string().min(1).max(80),
    description: z.string().min(1).max(300).optional(),
  }),
});

export const collections = { blog, resume, landing, work, series };
