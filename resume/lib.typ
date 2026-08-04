// Shared helpers for the resume PDF.
//
// Only Typst's *embedded* fonts are used, and the deploy compiles with
// --ignore-system-fonts, so the PDF renders identically on a Mac and on the CI
// runner. Ubuntu and macOS do not share a system font set; relying on one would
// make the output depend on where it was built.
//
// Byte-level reproducibility additionally needs SOURCE_DATE_EPOCH pinned — the
// embedded creation timestamp is otherwise the one thing that differs between
// two compiles of identical input. The `resume:pdf` script sets it from the
// HEAD commit date, so the same commit always produces the same bytes.

#let accent = rgb("#6d28d9") // light-theme accent — the PDF is on white
#let ink = rgb("#17171a")
#let muted = rgb("#3f3f47")
#let faint = rgb("#6b6b74")
#let hairline = rgb("#d6d6da")

#let serif = "Libertinus Serif"
#let mono = "DejaVu Sans Mono"

#let months = (
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
)

/// "2025-08" -> "Aug 2025"
#let fmt-month(value) = {
  let parts = value.split("-")
  months.at(int(parts.at(1)) - 1) + " " + parts.at(0)
}

/// Mirrors formatRange() in src/lib/resume.ts. `end: null` in the YAML arrives
/// here as `none` and means the role is current — the one convention both
/// renderers must agree on.
#let fmt-range(start, end) = {
  fmt-month(start) + " — " + (if end == none { "Present" } else { fmt-month(end) })
}

#let fmt-years(start, end) = {
  if start == none { end } else { start + " — " + end }
}

/// Mirrors formatRefDate() in src/lib/resume.ts — change one and you must
/// change the other. A publication or writing date at whatever precision the
/// entry carries: "2013" -> "2013", "2022-04" -> "Apr 2022",
/// "2021-11-03" -> "3 Nov 2021". int() strips the day's leading zero, matching
/// the Number() coercion on the web side.
#let fmt-ref-date(value) = {
  let parts = value.split("-")
  if parts.len() == 1 {
    parts.at(0)
  } else if parts.len() == 2 {
    fmt-month(value)
  } else {
    str(int(parts.at(2))) + " " + months.at(int(parts.at(1)) - 1) + " " + parts.at(0)
  }
}

/// Small tracked uppercase mono label — the eyebrow from the web design.
#let eyebrow(body, fill: faint) = text(
  font: mono,
  size: 6.5pt,
  weight: "bold",
  tracking: 0.18em,
  fill: fill,
)[#upper(body)]

/// Numbered section rule, echoing the site's "01 / Experience" pattern.
#let section(number, title) = {
  block(above: 1.15em, below: 0.55em, width: 100%, stroke: (top: 0.5pt + hairline), inset: (top: 0.5em))[
    #eyebrow(number, fill: accent)
    #h(0.7em)
    #text(font: serif, size: 11pt, weight: "bold", fill: ink)[#title]
  ]
}
