---
title: "Choosing What to Sell Where: The Assortment Problem"
date: 2026-08-26
description: "Your best-selling style is invisible in 90 of your 120 stores. Not because it flopped there — because it was never ranged there at all."
tags: [retail, data-science, inventory-management, data-analytics]
draft: false
link: https://medium.com/@a.emrevarol/choosing-what-to-sell-where-the-assortment-problem-80839c1e666f
link_text: Read on Medium
published: true
---
# Choosing What to Sell Where: The Assortment Problem

*Part 12 of "The Retail Data Playbook" — Season 2: Inside the Planning Machine*

---

Here's a pattern I've seen at more than one retailer. A style is a runaway best-seller — top-five in its category, sells out weekly, gets rebought twice. And it's stocked in only 30 of the 120 stores. In the other 90, customers never see it. It's not that those stores tested it and it flopped. It was never ranged there at all.

That's not a forecasting failure. It's an **assortment** failure — a decision, made months earlier, about what to carry and where. And it's the decision that sits directly downstream of the money map from Part 11.

Merchandise Financial Planning told us *how much* to spend on Dresses. Assortment planning answers the harder, more tactical question: **which dresses, in what depth, and in which stores?** Get it right and you match product to local demand across a network of very different shops. Get it wrong and you produce the two most expensive symptoms in retail simultaneously — stockouts of the things people want and markdowns on the things they don't.

![Racks of women's clothing displayed in a boutique](../../assets/blog/assortment-planning-hero.jpg)

*Photo by [Tyler Davis](https://unsplash.com/@tymotion) on [Unsplash](https://unsplash.com/).*

---

## Three Dials, One Budget

Assortment planning is the art of balancing three dials at once, all inside the budget MFP set:

- **Breadth (variety)** — how many different styles/SKUs you carry. More breadth attracts more customer segments but spreads the budget thin.
- **Depth** — how many units of each. More depth reduces stockout risk but raises markdown risk if a style misses.
- **Localization** — how the mix changes store to store. A flagship in central London and a suburban family store should not carry the same range, even if they get the same budget per square foot.

Breadth and depth trade off against each other because the budget is fixed. Localization is what turns a single national plan into 120 store-specific ones. Nail all three and you've done the job.

---

## The Scenario: TrendCo Ranges Spring Dresses

TrendCo has £18.2M of Dresses budget for Spring/Summer (from Part 11). The first move isn't picking styles — it's recognizing that its 120 stores are not one audience. They cluster:

**TrendCo — Store Clusters for Assortment**

| Cluster | Stores | Profile | Assortment implication |
|---|---|---|---|
| Urban Flagship | 12 | High footfall, fashion-forward, premium spend | Full breadth, newness first, premium price tier |
| Regional City | 34 | Mid-size, broad demographic | Core range + selected trend styles |
| Suburban Family | 58 | Value-oriented, size-inclusive demand | Core basics, deeper size runs, value tier |
| Compact / Outlet | 16 | Small footprint, price-led | Narrow — best-sellers only |
| **Total** | **120** | | |

Notice that clusters are built from **behavior**, not geography — footfall, spend, size-profile, what actually sells. (This is the same "cluster on behavior, not store attributes" lesson from Season 1's [DS-problems post](/blog/ds-problems/).) A premium floral wrap dress belongs in the 12 flagships and some regional cities. A size-inclusive jersey dress in a deep size run belongs in the 58 suburban stores. Ship the flagship range to the suburbs and you get markdowns; withhold the best-seller from the regionals and you get the invisible-best-seller problem I opened with.

### Breadth vs. depth, in numbers

Within a cluster, the budget still forces a choice. Take a single suburban store with a fixed 5,000-unit dress budget and a 10-week season. Two strategies:

**TrendCo — Breadth vs. Depth (one store, 5,000 units, 10-week season)**

| Strategy | Styles | Units/style | Avg units/size (6 sizes) | First-stockout risk | Markdown risk |
|---|---|---|---|---|---|
| **Broad & shallow** | 1,000 | 5 | ~0.8 | Very high — one sale breaks a size | Low per style |
| **Deep & narrow** | 200 | 25 | ~4.2 | Low — absorbs early demand | High if a style misses |

Broad-and-shallow looks appealing — more choice for the customer — but with under one unit per size, the *first sale* breaks the assortment. Deep-and-narrow holds availability but concentrates risk: if one of the 200 styles flops, you're clearing 25 units, not 5. Most retailers land in between, and the right point differs by cluster: flagships lean broader (customers come for newness and choice), suburban stores lean deeper on fewer proven styles.

### The MOQ tax nobody budgets for

There's a hidden hand on the breadth dial: supplier **Minimum Order Quantities**. Say TrendCo wants a niche embroidered dress for its flagships, forecast demand 400 units — but the supplier's MOQ is 800. Now the choice is: skip the style (lose breadth) or buy 800 and plan to clear 400 at markdown (buy depth you didn't want). MOQ is why broad-and-shallow assortments cost more than they look on paper — every incremental niche style drags a minimum buy behind it.

---

## The Hard Part: Ranging Products With No History

Half of a fashion assortment is new every season. You can't forecast a floral wrap dress that has never existed from its own sales history — there isn't any. This is the cold-start problem again (Part 11), and assortment planning has an elegant answer: **attribute-based demand**.

Instead of forecasting the SKU, you decompose it into attributes — silhouette (wrap), length (midi), fabric (linen-blend), color family (floral print), price tier (£65) — and estimate demand for each *attribute level* from products you have sold. Sum the attribute weights and you get a demand estimate for a dress that never existed. Marshall Fisher's pioneering work on this approach — [Fisher & Vaidyanathan, "A Demand Estimation Procedure for Retail Assortment Optimization with Results from Implementations," *Management Science* 60(10), 2014](https://doi.org/10.1287/mnsc.2014.1904) — cut new-product forecast error to the high teens (MAPE 16.2% for snack cakes, 19.1% for tires) against a traditional industry norm around 30.7%, and drove sales lifts of 5.8% and 3.6% in the tire and automotive-chemical categories where it was implemented.

The same attribute map tells you the other thing assortment planning must know: **substitution**. If the floral wrap sells out, does the customer buy the striped wrap sitting next to it (substitution — you keep the sale), or walk out (a lost sale)? A style with a high **walk rate** — customers leave rather than switch — is genuinely unique and must never go out of stock. A style with lots of near-substitutes is a cannibalization risk: adding it may just split demand with its neighbor rather than growing the category.

**TrendCo — Ranging Two Candidate Dresses**

| Candidate | Attribute-based demand | Nearest substitute in range | Walk rate | Ranging call |
|---|---|---|---|---|
| Floral Wrap Midi | 6,800 units | None close | High (72%) | **Range widely — unique, protect availability** |
| Striped Jersey Shift | 4,100 units | Existing Navy Shift | Low (28%) | **Cannibalization risk — range narrowly or replace** |

The Floral Wrap earns broad distribution and deep buys because when it's gone, the sale is gone. The Striped Jersey mostly steals from a dress TrendCo already sells — ranging both just splits the same demand across two SKUs and doubles the brokenness risk.

---

## Why the Math Meets a Wall

Formally, assortment planning is a constrained profit-maximization problem — choose the most profitable subset of styles subject to shelf space, budget, and MOQ constraints. It's a knapsack problem, it's NP-hard, and consumer-choice models (Multinomial Logit and its more realistic cousins) sit underneath it to predict what shoppers pick from a given set. That's the science.

But the science hits physical and behavioral walls the moment it's deployed:

- **Shelf space is inelastic.** The optimal quantity doesn't fit if the planogram and stockroom can't hold it.
- **Perishability (grocery).** For FreshMart, a "wider range" of fresh product isn't just capital risk — it's waste. An over-broad fresh assortment rots.
- **The assortment paradox.** More choice for the customer means less depth per SKU, which means faster stockouts. Breadth and availability fight each other.
- **Data silos.** Sales, loyalty, and logistics data fragmented across systems will make even a perfect optimizer confident and wrong.

This is why the best assortment work blends the algorithm's ranking with the category manager's local intuition — science *and* art, not one replacing the other.

---

## What the Data Scientist Actually Builds

1. **Behavioral store clustering.** Group the 120 stores on what they actually sell and who shops them — not postcode or floor area. This is the foundation every localized assortment sits on.

2. **Attribute-based demand for new products.** The single highest-value model in assortment planning. Decompose styles into attributes, estimate attribute-level demand, and produce credible forecasts for products with zero history.

3. **A substitution / walk-rate map.** Quantify which styles are unique (protect them) and which cannibalize (rationalize them). This directly informs both ranging and the "never let it break" availability rules from Season 1's [brokenness post](/blog/brokenness/).

4. **Cluster-level breadth/depth optimization.** Given each cluster's budget and shelf capacity, recommend how many styles and how deep — respecting MOQ so the plan is buildable, not just optimal on paper.

5. **The delisting engine.** Every season, rank SKUs on true cost-to-serve (not just gross margin) and flag the bottom tail for removal. Disciplined delisting alone is worth roughly half a margin point; better product-location matching is worth a 2–4% sales lift.

As always: the deliverable isn't a ranked SKU table. It's a ranging recommendation per cluster — *carry these, drop these, go deep here, stay shallow there* — with the demand and substitution reasoning attached.

---

## Key Takeaways

- **Assortment planning answers "what, how deep, and where"** — the tactical layer directly beneath MFP's "how much money."
- **Three dials, one budget:** breadth vs. depth trade off because the budget is fixed; localization turns one plan into 120.
- **Cluster on behavior, not geography.** A flagship and a suburban store deserve different ranges even at the same budget per square foot.
- **Attribute-based demand solves cold start.** Decompose new styles into attributes to forecast products with no history — the highest-leverage model here.
- **Walk rate separates unique from cannibalizing.** Protect the styles customers won't substitute; rationalize the ones that just split demand.
- **MOQ is a hidden breadth tax.** Every niche style drags a minimum buy behind it — which is why broad assortments cost more than they appear.
- **Science ranks, art decides.** The optimizer proposes; the category manager's local knowledge disposes. Build for the blend.

---

## What's Next

We've set the budget (Part 11) and chosen the range (Part 12). Both were locked *before the season started* — pre-season planning. But the season never behaves. In Part 13, we look at **[the two clocks of retail](/blog/pre-vs-in-season/)**: the pre-season plan built months ahead, and the in-season plan that changes every Monday — and why the pivot between them is where seasons are won or lost.

---

*"The Retail Data Playbook" is a series for data scientists and analysts building products for retail and e-commerce businesses. Season 2 goes inside the operating machine of a retailer.*

*All company names and data in this post are fictional and used for illustrative purposes.*
