/**
 * The one publication gate, shared by every data file that can carry copy only
 * Emre may write.
 *
 * A string that still contains the marker is a placeholder describing what goes
 * there, not content. Nothing gated renders it in production; `npm run dev`
 * shows it so the layout can be checked. Removing the marker publishes — there
 * is no second switch to remember (CLAUDE.md, "Nothing unapproved may reach the
 * live site"). scripts/verify-dist.mjs fails the deploy if one leaks anyway.
 *
 * astro.config.mjs cannot import this (it loads outside Vite), so it repeats the
 * literal marker string — keep the two in step if it ever changes.
 */
export const MARKER = 'TODO(emre)';

/** True if any string anywhere inside `value` still carries the marker. */
export const isPending = (value: unknown): boolean =>
  JSON.stringify(value ?? '').includes(MARKER);

/** Drafts show in `npm run dev` only — the same rule src/lib/posts.ts applies. */
export const showDrafts: boolean = import.meta.env.DEV;

/**
 * The value when it is approved (or while previewing in dev), otherwise
 * undefined so the call site renders nothing.
 */
export const approved = <T>(value: T): T | undefined =>
  showDrafts || !isPending(value) ? value : undefined;
