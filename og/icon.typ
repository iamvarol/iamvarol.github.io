// The apple-touch-icon: the forecast-band mark at 180x180, compiled once and
// committed to public/ (iOS wants a PNG; the SVG favicon covers browsers).
//
//   typst compile --root . --ignore-system-fonts --format png --ppi 72 og/icon.typ public/apple-touch-icon.png

#let bg = rgb("#0a0a0b")
#let fg = rgb("#ededed")
#let accent = rgb("#a78bfa")
#let faint = rgb("#8b8b93")

#set page(width: 180pt, height: 180pt, margin: 0pt, fill: bg)

#let s = 180 / 32
#let P(x, y) = (x * s * 1pt, y * s * 1pt)

#place(curve(
  fill: accent.transparentize(72%),
  curve.move(P(19, 15.5)), curve.line(P(22, 13.8)), curve.line(P(25, 12.4)), curve.line(P(27.5, 11.2)),
  curve.line(P(27.5, 20.2)), curve.line(P(25, 18.8)), curve.line(P(22, 17.6)), curve.close(),
))
#place(curve(
  stroke: (paint: fg, thickness: 1.8 * s * 1pt, cap: "round", join: "round"),
  curve.move(P(4.5, 19.5)), curve.line(P(7.5, 17)), curve.line(P(10, 18.6)), curve.line(P(13, 14.8)),
  curve.line(P(16, 16.2)), curve.line(P(19, 15.5)),
))
#place(curve(
  stroke: (paint: accent, thickness: 1.8 * s * 1pt, cap: "round", join: "round"),
  curve.move(P(19, 15.5)), curve.line(P(22, 15.7)), curve.line(P(25, 15.6)), curve.line(P(27.5, 15.7)),
))
#place(line(start: P(19, 8), end: P(19, 24), stroke: 1 * s * 1pt + faint))
