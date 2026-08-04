import { defineCollection } from 'astro:content';
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
    // Capped because search engines truncate past ~160 and a cut-off sentence
    // is worse than a build failure telling you to shorten it.
    description: z.string().min(1).max(200),

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
const reference = z.object({
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

    publications: z.array(reference).default([]),

    writing: z.array(reference).default([]),

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
    }),
    work: z
      .array(
        z.object({
          title: z.string().min(1),
          detail: z.string().min(1),
        }),
      )
      .min(1)
      .max(6), // beyond six the sequence stops reading as a shortlist
  }),
});

export const collections = { blog, resume, landing };
