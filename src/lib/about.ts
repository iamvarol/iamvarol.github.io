import raw from '../data/bio.md?raw';

/**
 * True while src/data/bio.md still carries an unanswered marker.
 *
 * The About page is the one page whose copy was drafted for Emre rather than by
 * him, so it stays gated until he has been through it: while this is true the
 * page carries noindex, is absent from the nav, and is left out of the sitemap
 * (see astro.config.mjs, which reads the same file). Removing the marker line
 * publishes it — there is no second switch to remember.
 */
export const aboutIsDraft: boolean = raw.includes('TODO(emre)');
