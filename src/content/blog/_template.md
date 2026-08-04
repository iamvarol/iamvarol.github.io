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

## The five frontmatter fields

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | 1–120 characters |
| `date` | yes | `YYYY-MM-DD`, unquoted |
| `description` | yes | 1–200 characters; used for the listing, the meta description, and social cards |
| `tags` | no | lowercase-kebab only, e.g. `time-series`; defaults to `[]` |
| `draft` | no | defaults to `false` |

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
