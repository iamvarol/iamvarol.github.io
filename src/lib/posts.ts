import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/**
 * Drafts are visible in `npm run dev` so you can preview them, and stripped
 * from production builds — index, tag pages, RSS, and the post route itself.
 * A draft therefore has no URL in production, rather than an unlinked one.
 */
const isVisible = (post: Post): boolean => import.meta.env.DEV || !post.data.draft;

/** Every publishable post, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', isVisible);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export type PostYear = { year: number; posts: Post[] };

/**
 * Posts bucketed by calendar year, newest year first.
 *
 * Order within a year is whatever the caller passed in — everything here comes
 * from `getPosts()`, which is already newest-first, so re-sorting would only be
 * a chance to disagree with it.
 */
export function groupByYear(posts: Post[]): PostYear[] {
  const years = new Map<number, Post[]>();

  for (const post of posts) {
    const year = post.data.date.getFullYear();
    const bucket = years.get(year);
    if (bucket) bucket.push(post);
    else years.set(year, [post]);
  }

  return [...years.entries()]
    .map(([year, group]) => ({ year, posts: group }))
    .sort((a, b) => b.year - a.year);
}

/** Tag slugs with their post counts, most-used first then alphabetical. */
export async function getTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * Reading time from a word count over the raw Markdown.
 *
 * Deliberately not a remark plugin: Astro 7 defaults to the Sätteri pipeline,
 * and pulling in remark-reading-time would mean opting the whole site back onto
 * unified() just for this number. 200 wpm is the conventional prose rate.
 */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
