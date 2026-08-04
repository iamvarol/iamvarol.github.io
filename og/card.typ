// Open Graph card — the image LinkedIn, Slack and iMessage show when the site
// is shared. That audience is the whole point of the site, so it is worth having.
//
// Rendered with the same pinned Typst already in CI for the resume, reading the
// same src/data/resume.yml, so there is no image toolchain to install and the
// name and title cannot drift from the CV.
//
//   typst compile --root . --ignore-system-fonts --format png --ppi 72 \
//     og/card.typ dist/og/default.png
//
// 1200x630pt at 72 ppi lands exactly on the 1200x630 px OG convention.

#let data = yaml("/src/data/resume.yml")
#let b = data.basics

#let bg = rgb("#0a0a0b")
#let fg = rgb("#ededed")
#let muted = rgb("#a1a1aa")
#let accent = rgb("#a78bfa")

#set page(width: 1200pt, height: 630pt, margin: (x: 86pt, y: 78pt), fill: bg)
#set text(font: "Libertinus Serif", fill: fg)

// In normal flow, not place() — place()'s dx/dy are relative to the content box,
// which already excludes the margin, so passing the margin again offsets it twice.
#rect(width: 54pt, height: 4pt, fill: accent)

#v(20pt)

#text(font: "DejaVu Sans Mono", size: 15pt, weight: "bold", tracking: 4pt, fill: muted)[
  #upper(b.label)
]

#v(18pt)

#text(size: 92pt, weight: "bold", tracking: -2.5pt)[#b.name]

#v(10pt)

#text(size: 26pt, fill: muted)[
  #b.focus.join("  ·  ")
]

#place(
  bottom + left,
  dx: 0pt,
  text(font: "DejaVu Sans Mono", size: 16pt, fill: accent)[iamvarol.github.io],
)

#place(
  bottom + right,
  dx: 0pt,
  text(font: "DejaVu Sans Mono", size: 16pt, fill: muted)[#b.location],
)
