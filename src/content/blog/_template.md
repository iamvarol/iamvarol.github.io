---
title: Post template
date: 2026-08-02
description: Copy this file, rename it, change the frontmatter, write. Delete this one when you no longer need it.
tags: [meta]
draft: true
---

This file is a template, not a post. It is `draft: true`, so it is stripped from
production builds — no page, no listing entry, no RSS item, no tag page. It is
visible in `npm run dev` so you can see how a post renders.

## Adding a post

Copy this file to `src/content/blog/your-post-slug.md` and push. The filename
becomes the URL: `your-post-slug.md` serves at `/blog/your-post-slug/`. There is
nothing else to update — no index to edit, no route to register.

## The frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | 1–120 characters |
| `date` | yes | `YYYY-MM-DD`, unquoted |
| `description` | yes | 1–200 characters; used for the listing, the meta description, and social cards |
| `tags` | no | lowercase-kebab only, e.g. `time-series`; defaults to `[]` |
| `draft` | no | defaults to `false` |
| `link` | no | full URL to a cross-post (e.g. Medium); shown as a link under the title. Omit it, or leave it blank, if the post hasn't been cross-posted |
| `link_text` | no | label for `link`; defaults to `Read on Medium`. Has no effect without `link` |

Anything that violates those rules fails `npm run build`, which means the deploy
never runs and the broken page never reaches the site. That is deliberate: a
build failure is a better outcome than a live page with an `Invalid Date` on it.

Tags are restricted to lowercase-kebab so that `Machine Learning`,
`machine-learning`, and `ML` cannot silently become three separate tag pages.

## What renders

Standard Markdown. Headings from `##` down get anchor IDs automatically.

- Bullet lists
- With `inline code` and **bold**

> Block quotes render as a rule and an indent.

Fenced code blocks are syntax-highlighted, and long lines scroll inside the
block rather than widening the page:

```python
def forecast(series: pd.Series, window: int = 7) -> pd.Series:
    """Rolling-mean baseline. Replace with something that earns its keep."""
    return series.rolling(window=window, min_periods=1).mean()
```

Reading time is computed from the word count at 200 wpm — there is no field to
set and nothing to keep in sync.

## Images and sketches

Save the file next to this post (flat, not in a subfolder — a subfolder would change the URL,
since the filename *is* the slug) and reference it with a relative Markdown image:

```markdown
![Alt text describing the diagram](./my-post-diagram.png)
```

This applies to SVG sketches too, not just photos/screenshots — one convention for both.

**Always use `![]()` Markdown syntax, never a raw `<img>` tag.** Astro's content pipeline only
optimizes and resolves the Markdown form; a raw `<img src="./file.png">` is passed through
untouched, and its relative path resolves against the page URL rather than this file's
directory, so it silently 404s.

For a caption, the safe default is a Markdown image followed by an italic line — this keeps
the image on the optimized path, since nesting `![]()` inside a raw `<figure>` block risks
CommonMark treating the whole block as opaque HTML and skipping optimization entirely:

```markdown
![Alt text describing the diagram](./my-post-diagram.png)

*Photo by [Name](https://unsplash.com/@handle) on [Unsplash](https://unsplash.com/).*
```

This is the pattern used for the Unsplash header photos on several posts. A raw
`<figure>/<figcaption>` block is still fine for a case where optimization doesn't matter (e.g.
an already-optimized SVG), but for anything that should go through Astro's image pipeline,
prefer the italic-line pattern above.
