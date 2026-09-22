/**
 * The forecast-band geometry: a demand series, a "today" line, and a P10–P90
 * band. One source for every surface that draws it — ForecastBand.astro on the
 * page, og/page.typ for the per-page share cards (via scripts/og.mjs) — so the
 * motif cannot drift between them.
 *
 * Plain JavaScript with JSDoc rather than TypeScript because scripts/og.mjs
 * runs under Node with no build step (CI is Node 22).
 *
 * Deterministic: a seeded generator, so the build is reproducible. Coordinates
 * live in a W×H box; consumers scale.
 */

export const W = 1000;
export const H = 200;
export const TODAY = 620;

const N_HIST = 32;
const N_FCST = 18;

/** @typedef {[number, number]} Point */

/** @returns {{ hist: Point[]; mid: Point[]; hi: Point[]; lo: Point[] }} */
export function forecastGeometry() {
  let seed = 7;
  const noise = () => {
    seed = (seed * 48271) % 2147483647;
    return seed / 2147483647 - 0.5;
  };

  /** @param {number} i @param {number} total */
  const level = (i, total) =>
    0.5 + 0.06 * (i / total) + 0.17 * Math.sin((i / total) * Math.PI * 4.6 - 0.8);

  /** @param {number} v */
  const y = (v) => H - 24 - v * (H - 48);

  /** @type {Point[]} */
  const hist = [];
  for (let i = 0; i <= N_HIST; i++) {
    hist.push([(i / N_HIST) * TODAY, y(level(i, N_HIST) + noise() * 0.11)]);
  }

  const last = hist[hist.length - 1];
  /** @type {Point[]} */ const mid = [last];
  /** @type {Point[]} */ const hi = [last];
  /** @type {Point[]} */ const lo = [last];
  for (let j = 1; j <= N_FCST; j++) {
    const t = j / N_FCST;
    const x = TODAY + t * (W - TODAY);
    const v = level(N_HIST + j * (N_HIST / TODAY) * ((W - TODAY) / N_FCST), N_HIST);
    const spread = 0.05 + 0.24 * Math.sqrt(t);
    mid.push([x, y(v)]);
    hi.push([x, y(v + spread)]);
    lo.push([x, y(v - spread)]);
  }

  return { hist, mid, hi, lo };
}

/** SVG path data for a polyline. @param {Point[]} pts */
export const svgPath = (pts) =>
  pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

/** Closed SVG path for the band between `hi` and `lo`. @param {Point[]} hi @param {Point[]} lo */
export const svgBand = (hi, lo) =>
  `${svgPath(hi)} ${[...lo].reverse().map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')} Z`;

/** "x,y;x,y;…" — the form og/page.typ parses from --input. @param {Point[]} pts */
export const typstPoints = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(';');
