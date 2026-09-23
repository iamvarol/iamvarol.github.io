/**
 * schema.org builders. Data blocks, not scripts — they count for nothing
 * against the site's two-client-script budget — rendered by Base.astro's
 * `schema` prop into <head>.
 *
 * One Person node, identified by `@id`, so every page that mentions the
 * author points at the same entity rather than describing a new one.
 */
import { site, socials } from './site';

export const PERSON_ID = `${site.url}/#person`;

const abs = (path: string) => new URL(path, site.url).href;

export function person(extra: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    alternateName: site.shortName,
    jobTitle: site.role,
    description: site.bio,
    email: `mailto:${site.email}`,
    url: site.url,
    address: { '@type': 'PostalAddress', addressLocality: site.location },
    sameAs: socials.filter((s) => s.href.startsWith('http')).map((s) => s.href),
    ...extra,
  };
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    author: { '@id': PERSON_ID },
    inLanguage: site.locale,
  };
}

export function profilePage(path: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: abs(path),
    mainEntity: person(image ? { image } : {}),
  };
}

export function blogPosting(o: {
  path: string;
  title: string;
  description: string;
  date: Date;
  image?: string;
  /** The Medium original, when the post is a cross-post. */
  sameAs?: string | null;
  series?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: o.title,
    description: o.description,
    url: abs(o.path),
    mainEntityOfPage: abs(o.path),
    datePublished: o.date.toISOString().slice(0, 10),
    author: { '@id': PERSON_ID },
    inLanguage: site.locale,
    ...(o.image ? { image: abs(o.image) } : {}),
    ...(o.sameAs ? { sameAs: o.sameAs } : {}),
    ...(o.series ? { isPartOf: { '@type': 'CreativeWorkSeries', name: o.series } } : {}),
  };
}

export function article(o: { path: string; title: string; description: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: o.title,
    description: o.description,
    url: abs(o.path),
    mainEntityOfPage: abs(o.path),
    author: { '@id': PERSON_ID },
    inLanguage: site.locale,
    ...(o.image ? { image: abs(o.image) } : {}),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
