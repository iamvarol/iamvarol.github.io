# iamvarol.github.io

Personal site for Emre Varol. Astro, static output, deployed to GitHub Pages on every
push to `main`.

## Commands

| Command | Does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | Type-check, including content collection schemas |

## Adding a blog post

Drop a `.md` file into `src/content/blog/` and push. The filename becomes the URL slug.
Frontmatter is schema-validated — a malformed field fails the build rather than shipping
a broken page.

```yaml
---
title: Post title
date: 2026-08-02
description: One sentence, used for the listing and the meta description.
tags: [forecasting, python]
draft: false
---
```

## Custom domain

Change `site` in `astro.config.mjs` and add `public/CNAME`. Nothing else — no link in the
codebase is prefixed with a `base` path.

## Build status

Deployment runs from `.github/workflows/deploy.yml`. The live site is the source of truth.
