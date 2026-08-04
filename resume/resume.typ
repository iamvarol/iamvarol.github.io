// Resume PDF.
//
// Reads the SAME file the /resume page reads — src/data/resume.yml. There is no
// export step and no second copy of the employment history, so the data cannot
// drift between the page and this document. Only the layout is separate, and
// scripts/verify-pdf.mjs asserts every company and role still reaches the PDF.
//
// Compile from the repo root so the absolute path resolves:
//   typst compile --root . --ignore-system-fonts resume/resume.typ out.pdf

#import "lib.typ": *

#let data = yaml("/src/data/resume.yml")
#let b = data.basics

#set document(
  title: b.name + " — " + b.label,
  author: b.name,
  keywords: b.focus,
)

// Sized to land on exactly two pages. A third page holding only the
// certifications line reads as careless on a resume, so the type scale and
// margins are tuned to keep the document at two. Adding a role or several
// bullets will spill it again — re-check the page count after editing the YAML.
#set page(
  paper: "a4", // one-line change to "us-letter" if the search turns US-heavy
  margin: (x: 15mm, y: 12mm),
  footer: context [
    #set text(font: mono, size: 6.5pt, fill: faint)
    #b.name
    #h(1fr)
    #counter(page).display("1 / 1", both: true)
  ],
)

#set text(font: serif, size: 9.4pt, fill: muted, lang: "en")
#set par(justify: false, leading: 0.55em, spacing: 0.58em)
#show link: set text(fill: accent)

// ── Masthead ───────────────────────────────────────────────────────────────

#text(font: serif, size: 23pt, weight: "bold", fill: ink, tracking: -0.015em)[#b.name]

#v(-0.35em)

#block[
  #text(font: serif, size: 11pt, fill: ink)[#b.label]
  #h(0.5em)
  #text(fill: hairline)[|]
  #h(0.5em)
  #text(font: mono, size: 7.5pt, fill: faint)[#b.focus.join(" · ")]
]

#v(-0.15em)

#block[
  #set text(font: mono, size: 7.5pt, fill: faint)
  #b.location
  #h(0.6em) · #h(0.6em)
  #link("mailto:" + b.email)[#b.email]
  #if "phone" in b [
    #h(0.6em) · #h(0.6em) #b.phone
  ]
  #h(0.6em) · #h(0.6em)
  #link(b.linkedin)[LinkedIn]
  #h(0.6em) · #h(0.6em)
  #link(b.github)[GitHub]
]

#v(0.5em)

#block(width: 100%, inset: (left: 0pt))[
  #set text(size: 9.7pt, fill: muted)
  #b.summary
]

// ── Experience ─────────────────────────────────────────────────────────────

#section("01", "Experience")

#for role in data.experience [
  #block(breakable: false, above: 0.85em)[
    #grid(
      columns: (1fr, auto),
      column-gutter: 1em,
      align: (left + bottom, right + bottom),
      text(font: serif, size: 10.5pt, weight: "bold", fill: ink)[
        #role.role
        #text(weight: "regular", fill: faint)[ · ]
        #text(fill: accent)[#role.company]
      ],
      text(font: mono, size: 7pt, fill: faint)[#fmt-range(role.start, role.end)],
    )

    #if "location" in role {
      v(-0.35em)
      text(font: mono, size: 7pt, fill: faint)[#role.location]
    }

    #if "context" in role {
      v(0.15em)
      text(size: 8.6pt, style: "italic", fill: faint)[#role.context]
    }
  ]

  #v(0.2em)

  #for item in role.highlights [
    #grid(
      columns: (0.85em, 1fr),
      align: (left + top, left + top),
      text(fill: accent)[•],
      text(size: 9.15pt)[#item],
    )
    #v(0.14em)
  ]

  #if "stack" in role and role.stack.len() > 0 [
    #v(0.1em)
    #text(font: mono, size: 6.8pt, fill: faint)[#role.stack.join("  ·  ")]
  ]

  #v(0.35em)
]

// ── Skills ─────────────────────────────────────────────────────────────────

#if data.skills.len() > 0 [
  #section("02", "Skills")

  #for group in data.skills [
    #grid(
      columns: (7.5em, 1fr),
      column-gutter: 0.9em,
      row-gutter: 0.45em,
      align: (left + top, left + top),
      eyebrow(group.group),
      text(size: 9.2pt)[#group.items.join(" · ")],
    )
    #v(0.3em)
  ]
]

// ── Education ──────────────────────────────────────────────────────────────

#if data.education.len() > 0 [
  #section("03", "Education")

  #for e in data.education [
    #block(breakable: false, above: 0.55em)[
      #grid(
        columns: (1fr, auto),
        column-gutter: 1em,
        align: (left + bottom, right + bottom),
        text(size: 9.7pt, weight: "bold", fill: ink)[#e.degree],
        text(font: mono, size: 7pt, fill: faint)[
          #fmt-years(e.at("start", default: none), e.end)
        ],
      )
      #v(-0.3em)
      #text(size: 9.2pt)[
        #e.institution
        #if "location" in e [ · #e.location]
        #if "gpa" in e [ · #text(fill: faint)[#e.gpa]]
        #if "note" in e [ · #text(fill: faint)[#e.note]]
      ]
      #if "detail" in e {
        v(-0.35em)
        text(size: 8.8pt, fill: faint)[#e.detail]
      }
    ]
  ]
]

// ── Publications ───────────────────────────────────────────────────────────

#if data.publications.len() > 0 [
  #section("04", "Publications")

  #for p in data.publications [
    // The explicit `fill: ink` is inside the link body on purpose: it beats the
    // global `#show link` accent, so six linked titles don't turn the section
    // violet. The venue line already names the source.
    #let head = text(size: 9.4pt, fill: ink)[#p.title]
    #block(breakable: false, above: 0.4em)[
      #if "url" in p [#link(p.url)[#head]] else [#head] \
      #text(font: mono, size: 7pt, fill: faint)[#p.venue · #fmt-ref-date(p.date)]
    ]
  ]
]

// ── Selected writing ───────────────────────────────────────────────────────

#if data.writing.len() > 0 [
  #section("05", "Selected writing")

  #for w in data.writing [
    #let head = text(size: 9.4pt, fill: ink)[#w.title]
    #block(breakable: false, above: 0.4em)[
      #if "url" in w [#link(w.url)[#head]] else [#head] \
      #text(font: mono, size: 7pt, fill: faint)[#w.venue · #fmt-ref-date(w.date)]
    ]
  ]
]

// ── Certifications ─────────────────────────────────────────────────────────

#if data.certifications.len() > 0 [
  #section("06", "Certifications")
  #text(size: 9.2pt)[#data.certifications.join(" · ")]
]
