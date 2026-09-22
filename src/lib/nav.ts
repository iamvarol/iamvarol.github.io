import { readyNav, type NavItem } from './site';
import { getPosts } from './posts';
import { aboutIsDraft } from './about';

/**
 * The nav as a visitor should see it: `ready` flags from site.ts, then the
 * gates. Used by Header.astro and 404.astro so the two can never disagree
 * about which pages exist.
 *
 * Three links appear on their own rather than needing a flag flipped by hand:
 * an empty blog linked from every page reads worse than no blog at all, About
 * stays hidden while its copy is an unapproved draft, and Work stays hidden
 * until at least one case study has cleared its markers.
 */
export async function visibleNav(): Promise<NavItem[]> {
  const hasPosts = (await getPosts()).length > 0;
  return readyNav().filter((item) => {
    if (item.href === '/blog/') return hasPosts;
    if (item.href === '/about/') return !aboutIsDraft;
    return true;
  });
}
