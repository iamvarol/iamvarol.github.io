# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Emre Varol's personal site. Astro 7, fully static, no UI framework, deployed to GitHub Pages
on every push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
`iamvarol.github.io` is a GitHub *user* page, so it serves from the apex and `base` is
deliberately omitted from the Astro config — **never prefix an internal link with a base path**.

The deploy is not just `astro build`: it also installs a pinned Typst, compiles the resume PDF
and the OG card into `dist/`, and runs a parity check that fails the deploy if the PDF no
longer matches the resume data. See *Build-time artefacts* below before changing the workflow.

Git note: this repo's history starts with its own initial commit — the Hugo site that preceded
it, and the first pass of this Astro rebuild, live in the public archived repo
`iamvarol/iamvarol.github.io_OLD`, which carries both a `hugo-archive` branch and a
`hugo-archive` tag. Clone it (or `gh api`) to recover anything from before — the old author
photo lives there. Commits are authored under the GitHub noreply address, set `--local` because
there is no global identity; the SSH remote uses the `github.com-personal` host alias because
the default `github.com` key belongs to a different account.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server at `localhost:4321`. Drafts are visible here and nowhere else |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check (`astro check`), including content collection schemas |
| `npm run todo` | Lists every outstanding `TODO(emre)` with file, line and what it blocks |
| `npm run verify:dist` | After a build: fails on a leaked `TODO(emre)`, an internal link in a new tab, or a sitemap that disagrees with the `noindex` pages |
| `npm run assets` | Compiles the resume PDF, the default OG card and one share card per post and case study into `dist/` — needs `typst` |
| `npm run resume:verify` | Compiles the PDF, then asserts it still matches `resume.yml` |

There is no test suite and no separate linter. The verification loop is `npm run check`,
`npm run build`, then `npm run verify:dist`; add `npm run resume:verify` whenever
`src/data/resume.yml`, `resume/*.typ` or `scripts/verify-pdf.mjs` changed. tsconfig extends
`astro/tsconfigs/strict`. The deploy runs all of these.

`npm run assets` requires Typst on PATH; the deploy installs it. A plain `npm run build`
without it produces a site whose PDF and OG links 404, which is fine locally and is why the
two are separate scripts.

Visual checks: there is no Chrome stable on this Mac, but `node_modules/puppeteer-core` (a
Lighthouse dependency) drives the Chrome for Testing binary under `~/.cache/puppeteer/`.
Serve `dist/` with `npm run preview`, or use `astro dev` for pages that are gated in
production, and screenshot at 1440 and 390 in both colour schemes plus 320 for overflow.

Lighthouse (mobile) scores 100 across all four categories on `/`, `/resume/`, `/blog/`,
`/about/`, `/contact/` and a post, and every page still ships **zero external JavaScript** —
both component scripts inline. If a change plausibly costs performance or accessibility, re-run
rather than assume: serve `dist/` locally, set `CHROME_PATH` (see *Visual checks* above), then
`npx lighthouse <url> --form-factor=mobile --screenEmulation.mobile`. On `/` the LCP element
must stay the `h1`: nothing with a `.enter` or `.reveal` entrance may be the largest paint, and
the hero portrait is a 4.5rem avatar below 48rem for exactly that reason.

## Nothing unapproved may reach the live site

Every page is built, but a page is withheld from visitors by a gate rather than by someone
remembering to flip a switch. **Never publish by hand what a gate is holding back** — satisfy
the gate and it opens itself.

- **About** is gated on a `TODO(emre)` marker in [src/data/bio.md](src/data/bio.md), because that
  copy was drafted *for* Emre from `resume.yml` rather than by him. **The marker has been
  cleared, so the page is live**: indexed, in the nav, and in the sitemap. The gate itself stays
  wired, and re-adding a marker to `bio.md` closes all three again — one marker, three gates:
  [src/lib/about.ts](src/lib/about.ts) for the page and nav, and
  [astro.config.mjs](astro.config.mjs) for the sitemap. The config reads the file with `fs`
  instead of importing `about.ts` because the config is loaded outside Vite and the `?raw`
  import would not resolve there — keep the two in sync if the marker string ever changes.
- **Blog** is filtered out of the nav while no non-draft post exists. An empty blog linked from
  every page reads worse than no blog while the site is doing job-search work.
- **Drafts** (`draft: true`) are visible in `npm run dev` and stripped from production
  entirely: no route, no listing entry, no tag page, no RSS item.
- **Work** — the case studies in [src/data/work.yml](src/data/work.yml) — is gated per entry
  by the same marker: an entry with any `TODO(emre)` left has no route, no landing row, no
  resume back-link, no share card and no sitemap line, and the nav item appears only once one
  is published. [src/lib/work.ts](src/lib/work.ts) is the gate; `astro.config.mjs` repeats the
  sitemap half with the same `yaml` parse because it runs outside Vite.
- **Hero availability line** (`hero.status` in `landing.yml`) and the two his-words fields on
  the contact page (`responseTime`, `include` in `contact.yml`) are withheld individually while
  they carry a marker; the pages themselves stay live.

The marker logic is one helper, [src/lib/gate.ts](src/lib/gate.ts) (`isPending`, `approved`,
`showDrafts`), and [scripts/verify-dist.mjs](scripts/verify-dist.mjs) turns the convention into
an invariant the deploy enforces — a marker in built HTML fails the build. The nav gates live in
[src/lib/nav.ts](src/lib/nav.ts) `visibleNav()`, used by `Header.astro` and `404.astro`, *on
top of* the `ready: boolean` in [src/lib/site.ts](src/lib/site.ts) `nav[]`. All five `ready`
flags are true, so if a nav item is missing the cause is a gate, not the flag. Don't add nav
entries any other way.

Related, and also not to be worked around:

- `TODO(emre)` marks copy only Emre can write; `npm run todo` lists what's outstanding. The
  lookup table naming those files lives in [scripts/list-todos.mjs](scripts/list-todos.mjs) —
  add a key when you add a data file. Never write prose in his voice to clear one.
- [src/data/decisions.yml](src/data/decisions.yml) holds open questions that are his, not
  yours. Each has a `default:` that applies if it's never answered, so an unanswered question
  never blocks work.

## Architecture

**Two load-bearing data files.** [src/lib/site.ts](src/lib/site.ts) holds every name, URL, and
handle used anywhere on the site (plus `nav`, `socials`, `isActive()`);
[src/data/resume.yml](src/data/resume.yml) holds the resume. Content and copy belong there, not
inlined in components. Moving to a custom domain is `site.url` here + `site` in
[astro.config.mjs](astro.config.mjs) + a `public/CNAME`, and nothing else.

**Six content collections**, all defined in
[src/content.config.ts](src/content.config.ts): `blog` (a glob over Markdown); `resume`,
`landing` and `contact`, which are single YAML *objects* rather than the array or id-map
`file()` expects — each therefore passes a one-line `parser` naming the entry `main` (without
it the loader would treat every top-level key as its own entry); and `work` and `series`,
arrays with an `id` per item. All are schema-validated, so a mistyped key fails the build
rather than rendering a blank line. Two cross-checks go further than the schema: every
`landing.yml proof[]` value and every `work.yml metrics[]` value must appear *verbatim* in the
highlights of the resume role it names, so a number edited in one place fails the build
instead of drifting. `work.yml` holds no role or dates — `src/lib/work.ts` joins each entry to
`resume.yml` by `company`, so there is still exactly one career list.

**resume.yml is read twice** — by the `resume` collection for `/resume` and by
[resume/resume.typ](resume/resume.typ) for the PDF. There is no export step and no second copy
of the employment history, so the *data* cannot drift; only the presentation can, which is what
[scripts/verify-pdf.mjs](scripts/verify-pdf.mjs) guards. Never add a parallel career list
elsewhere. Two fields exist only for the landing timeline: `experience[].blurb` (required — the
one-sentence version of `highlights`, and the default card line for a case study) and
`experience[].short` (the rail label where a company name is too wide). Typst reads fields by
name and never enumerates keys, so neither reaches the PDF or its two-page budget.
`basics.languages` is optional and *does* reach both mastheads when present. Roles on `/resume/`
carry `id="exp-<companyId>"` so case studies can link back to them.

**Layout shell.** [src/layouts/Base.astro](src/layouts/Base.astro) is the root layout: it pulls
in `tokens.css` + `base.css` globally, renders `BaseHead` / skip-link / `Header` / `<slot/>` /
`Footer`. Pages pass `title`, `description?`, `noindex?`, `type?`, `image?` (a page-specific
OG card) and `schema?` (schema.org nodes built in [src/lib/jsonld.ts](src/lib/jsonld.ts), one
`<script type="application/ld+json">` each — data, not code). [Post.astro](src/layouts/Post.astro)
and [CaseStudy.astro](src/layouts/CaseStudy.astro) wrap it. `prose.css` is imported per-page
(only where rendered Markdown appears), not globally.

**Theming.** Dark is the default; the `data-theme` attribute on `<html>` selects the palette.
The no-flash half is an `is:inline` script in [BaseHead.astro](src/components/BaseHead.astro)
that must run pre-paint (explicit choice → OS preference → dark) and also stamps `html.js`.
[ThemeToggle.astro](src/components/ThemeToggle.astro) is `display: none` until `html.js`
exists, so a no-JS visitor never sees a dead control. Don't add a framework or a store for this.

**Client-side JavaScript.** Two scripts, both plain TypeScript in a component `<script>` that
Astro bundles, inlines and defers, both strictly optional. (Grepping for `<script>` also finds
the pre-paint theme script in `BaseHead.astro`, which is `is:inline` by necessity, and the
JSON-LD blocks `Base.astro` renders from its `schema` prop, which are data rather than code —
neither counts.) They are:
[ThemeToggle.astro](src/components/ThemeToggle.astro) and
[CareerTimeline.astro](src/components/CareerTimeline.astro). **The bar for a third is that the
feature already works without it.** Without its script the timeline is a native CSS scroll-snap
carousel whose rail stops are real fragment links and whose active card is server-rendered; the
script replaces that with the looping coverflow. Both gate their controls on a flag set *after*
wiring (`html.js` for the toggle, `data-enhanced` for the timeline) so neither can render a
dead control, and anything that dims or recedes content sits behind that gate too — otherwise a
no-JS visitor gets a card stuck at 35% opacity with nothing able to restore it. No framework,
no store, no hydration directive.

Two things about the coverflow that are easy to "fix" back into bugs. **It cannot be built on a
scroll container** — a scroller has two ends, so it can't wrap; cards are stacked in one grid
cell and positioned by transform from `--o`, their signed *circular* distance to the active
card, which is the single line that makes the loop work and keeps the fan full on both sides.
And **depth is a scrim, never `opacity`** — fading a card makes it translucent, so the card
behind shows through the one in front and the overlap turns to mud. An opaque card under an
overlay of page colour recedes just as well and still occludes.

The carousel also **autoplays, and that carries obligations**. It advances `+1` every 6s, which
in the newest-first order runs current role → oldest → wrap. It must not start under
`prefers-reduced-motion` — auto-motion is precisely what that setting exists to stop — and
WCAG 2.2.2 requires a real pause control, because hover and focus pausing does nothing for a
keyboard or switch user. Hence `[data-toggle]`. Hover/focus/offscreen/hidden-tab are *transient*
suspensions held separately from the `playing` flag, so leaving a hover resumes but an explicit
pause stays paused; any deliberate navigation calls `takeOver()` and stops it for good, so the
button always reflects the truth and nothing yanks a card away just after someone picked it.

**Fonts.** Inter (body and UI), Libertinus Serif (display sizes only) and JetBrains Mono
(eyebrows, metadata) are self-hosted through Astro's `fonts` API in
[astro.config.mjs](astro.config.mjs), which emits size-adjusted local fallbacks so the swap
doesn't shift layout. Libertinus is the same face the Typst PDF and OG card use, so the CV, a
LinkedIn preview and the site read as one document; it is loaded at one weight (600), so
display type is `--w-semibold`, never bold. `latin-ext` is required for Turkish — `ı ç ö ü`
are already in the `latin` subset (which explicitly includes `U+0131`), but `ğ ş İ Ğ Ş` are
not. Only the Latin subsets of the sans and the display face are preloaded; preloading more
defeats `unicode-range`. Never re-declare the fallback stack in CSS — `--font-sans` /
`--font-display` / `--font-mono` already resolve to the full chain, and `--face-sans` /
`--face-display` / `--face-mono` in `tokens.css` are the aliases everything downstream uses.

**Entrances and page swaps are CSS, in `base.css`.** `.reveal` is scroll-driven
(`animation-timeline: view()`, range `entry 0% entry 40%` so anything already in view, or on a
page too short to scroll, is fully visible) and `.enter` is a load entrance staggered by
`style="--i: n"`. Never put either on the hero `h1` or the hero portrait — Chrome skips
`opacity: 0` elements when choosing the LCP candidate. Cross-document view transitions
(`@view-transition { navigation: auto }`, wrapped in `prefers-reduced-motion: no-preference`)
hold the header still and slide the current-page underline (`nav-current`) between pages with
no client router; Firefox simply loads. Internal links must therefore never open a new tab —
`verify:dist` checks. The resume's sticky section index is a CSS scroll-spy: named view
timelines pinched by `view-timeline-inset: 50% 50%` and a keyframe over their `cover` range.

**One motif, three surfaces.** The forecast band — actuals, a today line, a widening P10–P90
band — is generated once in [src/lib/forecast.mjs](src/lib/forecast.mjs) (plain JS so the Node
script can import it) and drawn by [ForecastBand.astro](src/components/ForecastBand.astro) on
the hero, by [og/page.typ](og/page.typ) on every share card (points passed as `--input`), and
by hand in `public/favicon.svg` / [og/icon.typ](og/icon.typ). The portrait is one file,
`src/assets/portrait.png` (background removed), rendered by
[Portrait.astro](src/components/Portrait.astro) at three sizes.

**Two formatters are mirrored across languages and will drift silently.**
[src/lib/resume.ts](src/lib/resume.ts) and [resume/lib.typ](resume/lib.typ) each implement the
`end: null` → "Present" convention and the mixed-precision reference date (`2013`,
`2022-04`, `2021-11-03`). Change one and you must change the other; nothing enforces it, which
is exactly why `verify-pdf.mjs` exists.

## Build-time artefacts

Two files in `dist/` are produced by Typst, not by Astro, and are absent from a plain
`npm run build`:

- `dist/emre-varol-resume.pdf` from [resume/resume.typ](resume/resume.typ)
- `dist/og/default.png` from [og/card.typ](og/card.typ) — the Open Graph card, 1200×630, which
  reads the same `resume.yml` so a LinkedIn share cannot disagree with the CV
- `dist/og/<slug>.png` for every published post and case study, from
  [og/page.typ](og/page.typ) via [scripts/og.mjs](scripts/og.mjs), which applies the same
  gates as the pages (no card for a draft or a pending case study) and passes the forecast
  geometry in as `--input`

Both compile with `--ignore-system-fonts` against only Typst's four embedded faces, because
macOS and the CI runner share no system fonts and the output would otherwise depend on where
it was built. Both pin `SOURCE_DATE_EPOCH` to the HEAD commit date, which removes the embedded
creation timestamp — the last source of nondeterminism — so a given commit always produces
identical bytes. Typst is pinned to an exact version in the workflow for the same reason.

[scripts/verify-pdf.mjs](scripts/verify-pdf.mjs) then asserts every company, role, institution,
publication and writing title in the YAML actually reached the PDF, and that it still fits two
pages. It fails the deploy, so a template that quietly stops emitting a section cannot ship a
resume missing a job. **The two-page limit is a real constraint** — adding a role or a few
bullets will breach it, and the fix is to trim, not to raise `PAGE_LIMIT`.

The sitemap excludes anything carrying `noindex`: `/404/`, `/tags/*` (while the Playbook posts
share one tag set, see `blog-tags` in `decisions.yml`), any pending `/work/<id>/` and `/work/`
itself while nothing is published, plus `/about/` again if a `TODO(emre)` marker ever returns
to `bio.md`. Advertising a page for crawling while asking it not to be indexed is reported as
an error in Search Console — `verify:dist` fails the build if the two lists disagree.

## CSS conventions

Three global stylesheets plus Astro's per-component scoped `<style>` blocks. No Tailwind, no
CSS-in-JS, no utility framework.

- [tokens.css](src/styles/tokens.css) — the single source of colour, type, space, measure,
  shape (`--hairline`, `--r-1/2/pill`, the focus ring) and motion (`--dur` for state,
  `--dur-move` for travel, `--dur-reveal` for entrances, `--dur-draw` for the band, `--stagger`;
  all zeroed under reduced motion). A `@media print` block forces the light palette so Cmd+P
  never prints white on black. Every fg/bg pair is contrast-checked with the ratio noted inline; nothing used for
  body text falls below WCAG AA (4.5). If you change a colour, re-check and update the inline
  ratio. `--on-accent` is
  intentionally *not* white in dark theme. `--tone-1`…`--tone-7` are the *accent's* ramp
  (`--accent` mixed into `--surface`, 20% → 0%), not a second colour — the site still holds one
  hue. Their ratios are quoted for `--muted`, the binding constraint: `--faint` drops to 4.04
  on `--tone-1` and fails, which is why anything sitting on a tone uses `--muted`.
- [base.css](src/styles/base.css) — reset, element defaults, and the shared utilities
  (`.wrap`, `.wrap-text`, `.sr-only`, `.skip-link`), type roles (`.eyebrow`, `.seq`,
  `.lead`), the entrance primitives (`.reveal`, `.enter`) and the view-transition rules. **It
  must never contain a literal hex value or px size** — everything resolves through a token;
  the only px on the site are the shape tokens.
- [prose.css](src/styles/prose.css) — scoped entirely under `.prose` so Markdown styling can't
  leak into page chrome.

Component-specific CSS lives in that component's scoped `<style>`. Logical properties
(`inline-size`, `margin-block-start`, `padding-inline`) are used throughout — match that.

**Accessibility is load-bearing, not decoration.** A single visible focus ring is defined once
in `base.css`; never remove it without replacing it. `prefers-reduced-motion` zeroes `--dur`
and disables smooth scroll. The header deliberately has no hamburger: below 30rem it wraps to
two rows (wordmark and toggle above, links below), which is plain flex and keeps it at zero
JavaScript. Check 320px whenever a nav label changes.

Two traps that the global reduced-motion block does *not* cover: it resets `scroll-behavior` on
`html` only, so a scroll container needs its own reset; and an explicit `behavior` passed to
`scrollIntoView`/`scrollTo` overrides the CSS property outright, so JS must re-check
`matchMedia('(prefers-reduced-motion: reduce)')` itself. Don't reach for `role="tab"` on
something scroll-based — it promises a keyboard contract a scroll container doesn't honour and
forces hiding content that stays tabbable.

## Design language

Adapted from replen.it, not copied: a neutral near-black with one violet accent held
throughout. The carried-over structure is the signature — the 11px mono eyebrow at `0.28em`
tracking, zero-padded sequence numbers that accent only the active item, tight negative
tracking on display type, and a 6–8rem (`--s-section`) section rhythm. Use
[Eyebrow.astro](src/components/Eyebrow.astro) and
[SectionHeading.astro](src/components/SectionHeading.astro) rather than rebuilding those
patterns; `size="hero"` is reserved for a landing-page `h1`.

Fluid type is reserved for display sizes only — body sizes stay fixed so line length, not
viewport width, governs readability. Display sizes (`--t-hero`, `--t-display`, the metric
figures, `--t-statement`) take `--face-display` at `--w-semibold`; nothing else does.

**Ordinal numbering is a finite, shared system, not a free decoration.** The landing "What I
work on" list and the `/resume` section headings carry `01–0n`, and roles are deliberately
never numbered — see the comment in
[ExperienceEntry.astro](src/components/resume/ExperienceEntry.astro). A third zero-padded
sequence on the same page reads as competing systems. So
[CareerTimeline.astro](src/components/CareerTimeline.astro) marks its rail with **years**,
filling the same `.seq` typographic slot (mono, `--tr-seq`, tabular-nums, `--faint` →
`--accent` when active) that [PostTimeline.astro](src/components/PostTimeline.astro) already
fills with years. Reach for `.seq` before inventing a marker; reach for a year before an
ordinal.
