// Per-page Open Graph card — one per blog post and case study, compiled by
// scripts/og.mjs, which passes the text and the forecast-band geometry in:
//
//   typst compile --root . --ignore-system-fonts --format png --ppi 72 \
//     --input title="…" --input eyebrow="…" \
//     --input hist="x,y;x,y;…" --input fcst="…" --input band="…" \
//     og/page.typ dist/og/<slug>.png
//
// Same palette and faces as og/card.typ (the default card), same motif as the
// hero's ForecastBand — the geometry comes from src/lib/forecast.mjs so the
// three cannot drift. 1200x630pt at 72 ppi is exactly 1200x630 px.

#let data = yaml("/src/data/resume.yml")
#let b = data.basics

#let bg = rgb("#0a0a0b")
#let fg = rgb("#ededed")
#let muted = rgb("#a1a1aa")
#let faint = rgb("#8b8b93")
#let accent = rgb("#a78bfa")
#let rule = rgb("#2a2a2e")

#let title = sys.inputs.at("title", default: "Untitled")
#let eyebrow = sys.inputs.at("eyebrow", default: "")

// "x,y;x,y" in the 1000x200 source box → points scaled into a target box.
#let pts(s, sx, sy) = if s == "" { () } else {
  s.split(";").map(p => {
    let xy = p.split(",")
    (float(xy.at(0)) * sx, float(xy.at(1)) * sy)
  })
}
#let polyline(points, ..style) = if points.len() > 1 {
  curve(..style, curve.move(points.first()), ..points.slice(1).map(p => curve.line(p)))
}

#set page(width: 1200pt, height: 630pt, margin: (x: 86pt, y: 78pt), fill: bg)
#set text(font: "Libertinus Serif", fill: fg)

// Long titles step down rather than wrap to a fourth line.
#let size = if title.len() > 72 { 50pt } else if title.len() > 44 { 58pt } else { 68pt }

#rect(width: 54pt, height: 4pt, fill: accent)

#v(20pt)

#text(font: "DejaVu Sans Mono", size: 14pt, weight: "bold", tracking: 3.5pt, fill: muted)[
  #upper(eyebrow)
]

#v(16pt)

#block(width: 100%)[
  #set par(leading: 0.28em)
  #text(size: size, weight: "bold", tracking: -1.2pt)[#title]
]

// The motif, bottom right, behind nothing.
#place(
  bottom + right,
  dy: -34pt,
  {
    let bw = 380pt
    let bh = 76pt
    let sx = bw / 1000
    let sy = bh / 200
    box(width: bw, height: bh, {
      let band = pts(sys.inputs.at("band", default: ""), sx, sy)
      if band.len() > 2 {
        place(curve(fill: accent.transparentize(84%), curve.move(band.first()), ..band.slice(1).map(p => curve.line(p)), curve.close()))
      }
      place(polyline(pts(sys.inputs.at("hist", default: ""), sx, sy), stroke: 1.5pt + fg))
      place(polyline(pts(sys.inputs.at("fcst", default: ""), sx, sy), stroke: 1.5pt + accent))
      place(line(start: (620 * sx, 0pt), end: (620 * sx, bh), stroke: 0.75pt + rule))
    })
  },
)

#place(
  bottom + left,
  text(size: 22pt, fill: fg)[#b.name #h(10pt) #text(fill: faint)[·] #h(10pt) #text(font: "DejaVu Sans Mono", size: 15pt, fill: accent)[iamvarol.github.io]],
)
