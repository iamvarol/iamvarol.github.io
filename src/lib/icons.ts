/** Names for the hand-drawn icon set in src/components/Icon.astro. Lives here,
 *  not in site.ts, so site.ts stays content/copy and doesn't import from
 *  components/ — the reverse of every other import direction in the codebase. */
export type IconName =
  | 'mail'
  | 'github'
  | 'linkedin'
  | 'stack-overflow'
  | 'x'
  | 'rss'
  | 'external'
  | 'pin';
