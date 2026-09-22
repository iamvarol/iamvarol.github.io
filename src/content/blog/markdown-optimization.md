---
title: "The Art of Marking Down: How Data Science Can Save Margins"
date: 2026-04-08
description: "Markdowns are the most expensive routine decision in retail. Done well, they're a controlled release valve that clears inventory while protecting as much margin as possible. Done badly — too early, too deep, or too bluntly across the whole store network — they train customers to wait for sales, collapse blended margins, and shrink next season's buying budget."
tags: [retail, data-science, inventory-management, data-analytics]
series: retail-data-playbook
part: 6
draft: false
link: https://medium.com/@a.emrevarol/the-art-of-marking-down-how-data-science-can-save-margins-5f1be9305792
link_text: Read on Medium
---
*Part 6 of "The Retail Data Playbook"*

---

There's a phrase I've heard from planners more times than I can count: *"We marked it down too early."*

Not "we had the wrong product" or "the forecast was off." The most common regret in fashion retail isn't buying the wrong thing — it's cutting the price on the right thing before you had to.

Markdowns are the most expensive routine decision in retail. Done well, they're a controlled release valve that clears inventory while protecting as much margin as possible. Done badly — too early, too deep, or too bluntly across the whole store network — they train customers to wait for sales, collapse blended margins, and shrink next season's buying budget.

This post is about how to do it right.

![A "SALE" sign in a clothing store window](../../assets/blog/markdown-optimization-hero.jpg)

*Photo by [Artem Beliaikin](https://unsplash.com/@belart84) on [Unsplash](https://unsplash.com/).*

---

## First: What Kind of Price Cut Is This?

Retailers use at least four different terms for price reductions, and mixing them up in your data is a fast way to break your analytics. Let's settle the vocabulary before anything else.

| Term | What it means | Goal | Temporary or permanent? |
|------|--------------|------|------------------------|
| **Promotion** | Planned, temporary discount (e.g., "20% off this weekend") | Drive traffic, reward loyalty, move seasonal stock | Temporary — price reverts |
| **Markdown** | Permanent price reduction on a slow-moving style | Clear inventory while preserving some margin | Permanent — price stays down or goes deeper |
| **Clearance** | Deepest markdown, end of season | Empty the shelf before new season arrives | Permanent — the product is exiting |
| **Rollback** *(grocery)* | Longer-term "everyday low" price on key items, usually supplier-funded | Compete on price without a dated "sale" | Semi-permanent |

**Why this matters for data science:** Promotions create *incremental* demand — you measure lift against a baseline. Markdowns and clearance *accept* lower margin to clear stock — you optimize timing and depth, not lift. If you tag both as "discount" in your POS data, you'll attribute markdown-driven volume to promotional effectiveness (overstating your promo ROI) and misread baseline demand for every future forecast. Always join transactions to both the promotion calendar and the price change history before assigning an event type.

---

## The Scenario: TrendCo's Satin Midi Skirt vs. Iris Trench Coat

It's mid-season at TrendCo. Two styles are underperforming. Both need attention. The planning team is about to make very different decisions for each — one right, one costly.

**TrendCo — Two Underperforming Styles at Week 8**
*20-week selling season | Target final STR: 75%*

| | Satin Midi Skirt | Iris Trench Coat |
|--|-----------------|-----------------|
| Total receipts | 6,000 units | 5,200 units |
| Units sold | 1,560 | 1,404 |
| Cumul. STR at Wk 8 | 26.0% | 27.0% |
| Historical Wk 8 avg | 41.0% | 40.0% |
| Full price | £75 | £120 |
| Cost | £24 | £38 |
| Full-price margin | £51 | £82 |

On the surface: both styles look almost identical. Both are around 26–27% STR at Week 8 against a ~40% historical average. Both are significantly behind curve.

The planning team meets. The decision on both styles: **immediate 30% markdown across all stores.**

That decision will turn out to be correct for one style and a £74,000 mistake for the other.

---

## Why "Same STR, Same Action" Is Wrong

Before pulling the markdown trigger, the right question isn't "what is the STR?" It's "**why** is the STR low?"

The data science team runs the diagnosis:

**Satin Midi Skirt — root cause: style miss**

| Store Group | STR | Availability | Notes |
|-------------|-----|-------------|-------|
| London flagships | 25% | 98% | Full assortment, selling slowly |
| Regional cities | 27% | 97% | Full assortment, selling slowly |
| Suburban | 26% | 99% | Full assortment, selling slowly |

All sizes available. All stores performing similarly. Low STR is uniform. **This is a demand problem** — the product doesn't resonate with customers regardless of where it's stocked or what sizes are available. Markdown is the right call.

**Iris Trench Coat — root cause: brokenness**

| Store Group | STR | Availability (size-weighted) | Notes |
|-------------|-----|--------------------------|-------|
| London flagships | 52% | 61% | XS, S, M sold out |
| Regional cities | 29% | 88% | XS, S sold out |
| Suburban | 14% | 94% | Selling slowly but complete |

The London stores are actually outperforming — 52% STR with significant brokenness. The adjusted STR (correcting for availability) for London is 52% / 0.61 = **85%** — that's a great product. The suburban stores are underselling, but they have the complete assortment. The problem isn't demand — it's that sizes XS through M were under-allocated to London, and now they're gone.

**The right action for the Iris Trench Coat is not a markdown. It's a transfer.**

Move 200 units of XS/S/M from suburban stores (where they're barely selling) to London stores (where they'd sell at full price). Meanwhile, apply a selective 20% markdown in the suburban stores on the remaining excess L/XL stock.

---

## The Financial Difference: One Decision, £74,000

Let's run the numbers on what happens under each path:

**Iris Trench Coat — Blanket 30% Markdown vs. Transfer + Selective Markdown**

| Scenario | Units at Full Price (£120) | Units at Markdown (£84) | Margin |
|----------|--------------------------|------------------------|--------|
| Blanket 30% MD (what they decided) | ~1,200 | ~3,800 | £98,400 + £174,800 = **£273,200** |
| Transfer 200 units + selective suburban MD | ~1,800 | ~3,200 | £147,600 + £147,200 = **£294,800** |

**Difference: ~£21,600** on this one style — just from routing 200 units to the right stores before cutting price.

But the bigger cost is what a premature blanket markdown does to the full-price stores. As soon as London customers see "30% off the Iris Trench Coat," the customers who were about to buy at £120 next weekend will wait. The London stores were converting at 52% STR — that's a healthy, full-price business. Triggering a network-wide markdown kills it.

When you include the full-price sales cannibalised in London, the total cost of the blanket markdown is significantly larger than the £21,600 direct margin difference. London stores had roughly 850 remaining full-price units at that point; at 52% STR, many of those would have sold at full price — each representing £82 in lost margin vs. £58 at markdown. The direct margin loss plus the cannibalised full-price revenue adds up to a substantial six-figure hit on this one style — the exact number depends on how many London customers wait for the markdown, but even conservative assumptions put it well above £50,000.

---

## The Timing Dilemma: The Most Counter-Intuitive Truth in Retail

Conventional instinct says: *if a product is struggling, cut the price early and move it quickly.*

The evidence says the opposite.

**Early markdowns train customers to wait.** Once a brand consistently marks down struggling styles in Week 6, its customer base learns: *"If I wait until Week 6, I'll get 20% off."* The next season, customers who would have bought at full price in Week 3 now deliberately wait. Full-price weeks shrink. The markdown window becomes the buying window.

**Late markdowns protect full-price weeks, but risk dead stock.** If you hold price until Week 14 on a style that only reaches 30% STR by then, you'll need a much deeper markdown to clear by season end — and you may not fully clear at all.

The optimal strategy is **tiered markdowns**: gradual reductions that match the urgency of clearing inventory to the weeks remaining.

**TrendCo Markdown Decision Framework — Satin Midi Skirt**

| Week | WOS Remaining | STR | Situation | Action |
|------|--------------|-----|-----------|--------|
| Wk 8 | 12 weeks | 26% | Behind curve, time available | 15% off in lowest-performing stores only |
| Wk 10 | 10 weeks | 34% | Slight improvement, still behind | Hold at 15% off; monitor |
| Wk 12 | 8 weeks | 38% | Not recovering fast enough | Extend 15% off to all stores |
| Wk 14 | 6 weeks | 45% | Moving but slow | 30% off — clear urgency |
| Wk 17 | 3 weeks | 58% | Significant remaining stock | 50% off — prioritise clearing |
| Wk 20 | 0 weeks | 68% | Season end | Off-price channel / donation |

Compare this to the alternative — blanket 30% markdown at Week 8:

| Scenario | Full-price units sold | Markdown units (30% off) | Clearance units (50%+ off) | Total margin |
|----------|----------------------|--------------------------|---------------------------|-------------|
| Blanket MD Week 8 | 1,560 | 3,800 | 640 | **£154,880** |
| Tiered markdown | 2,100 | 2,800 | 1,100 | **£169,400** |

**Tiered approach: +£14,520 better margin on 6,000 units.** That's 2.4 extra margin points — which, at scale across a 200-style collection, is the difference between a profitable season and a write-down.

---

## Store-Level Markdowns: The Precision Lever

Not every store should get the same markdown at the same time. This is the most underused lever in retail pricing.

**TrendCo Satin Midi Skirt — STR by Store Group at Week 10**

| Store Group | Units Remaining | STR | WOS at Current Velocity | Recommended Action |
|-------------|----------------|-----|------------------------|--------------------|
| London Flagships | 280 | 48% | 7.2 weeks | Hold full price — tracking fine |
| Regional A (Manchester, Leeds) | 490 | 39% | 9.8 weeks | 15% off — gentle stimulus |
| Regional B (Bristol, Sheffield) | 620 | 31% | 12.4 weeks | 25% off — time pressure |
| Suburban | 1,840 | 22% | 18.1 weeks | 35% off — urgent clearance |

Blanket 25% off across all stores would undersell London (where the product doesn't need a markdown) and undercut suburban (where 25% off won't clear 18 weeks of supply in 10 remaining weeks).

Store-level markdowns, properly implemented, preserve **4–8 percentage points of blended margin** vs. network-wide cuts. On a £1B revenue base with 40% gross margin, that's £16–32M in preserved margin from one lever alone.

---

## The Depth Formula: How Much to Cut

Once timing is settled, the question becomes: how deep? The intuitive answer ("whatever feels right") is why most retailers leave margin on the table.

A structured approach:

**Step 1: Estimate units you need to sell.**
You have 1,840 suburban units. You want to clear to <100 by season end. You need to sell 1,740 more in 10 remaining weeks. Current velocity: ~26 units/week. Required velocity: 174 units/week — you need to **6.7× the current sell rate**.

**Step 2: Translate to price elasticity.**
If price elasticity for this category is approximately −2.0 (typical discretionary apparel elasticity ranges from −1.5 to −2.5; calibrate from your own price test data), a 10% price cut drives 20% more volume. A 6.7× velocity increase requires roughly:

```
Required % change in demand = +570%
Required % price cut ≈ 570% / 2.0 elasticity ≈ 285%
```

That's not achievable through markdown alone — you'd need to give it away. Which means the suburban stock won't clear at any reasonable markdown. Time to consider off-price channel or donation.

**Step 3: Adjust for operational reality.**
This is where business judgment re-enters. The math says "this won't clear." The decision is: take a 50% off clearance markdown and clear most of it, or move remainder to off-price channel at near-zero margin, or write off and donate. None of these is good — but the markdown model tells you *earlier* so the decision can be made while there's still more time to act.

**Summary decision matrix:**

| WOS Remaining | Current STR | Suggested Markdown Depth |
|--------------|-------------|--------------------------|
| > 8 weeks | > 60% | Hold full price |
| > 8 weeks | 40–60% | 15–20% — gentle stimulus |
| 4–8 weeks | 40–60% | 25–35% |
| 4–8 weeks | < 40% | 35–45% |
| < 4 weeks | < 40% | 50%+ — prioritise clearing |
| < 2 weeks | Any | 60%+ or off-price channel |

---

## What the Data Scientist Actually Builds

The planner doesn't have time to run this analysis for 200 styles × 120 stores every week. The data scientist's job is to make this happen automatically.

**The markdown recommendation engine — minimum viable version:**

1. **Weekly STR vs. curve comparison** — flag every style tracking >15% below historical curve for its week of season
2. **Root cause classifier** — for each flagged style, compute: (a) availability-adjusted STR, (b) size-level STR variance, (c) store-cluster STR variance. Classify as: demand problem / brokenness problem / allocation problem / localised issue
3. **Transfer recommendation** — for brokenness and allocation problems, output: "transfer X units of size Y from store group A to store group B, estimated margin recovery £Z"
4. **Markdown recommendation** — for demand problems, output: recommended timing, store-group segmentation, and depth per the decision matrix above
5. **Financial impact estimate** — show projected margin under recommended action vs. status quo; make the planner's decision concrete

The goal: the planner walks into Monday's review with a ranked list of 15 styles that need attention this week, each with a classified root cause and a specific recommended action. Not "here's the data, you figure it out." That's the difference between a model that gets used and one that doesn't.

---

## Key Takeaways

- **Markdown vs. promotion vs. clearance are not the same thing.** Tag them differently in your data or your analytics will be permanently broken.
- **Diagnose before marking down.** Low STR has three possible root causes: demand problem, brokenness problem, or allocation problem. Only the first one calls for a markdown. The other two call for transfers or consolidation.
- **Early blanket markdowns are almost always a mistake.** They train customers to wait, cannibalize full-price sales, and rarely outperform a tiered approach in total margin.
- **Tiered markdowns outperform flat markdowns.** Match depth and timing to urgency; preserve full-price weeks in well-performing stores while clearing aggressively where necessary.
- **Store-level markdowns preserve 4–8 margin points** vs. network-wide cuts. This is one of the highest-ROI interventions in retail data science.
- **Build the recommendation engine, not the report.** The planner needs "take this action on these styles this week" — not "here is the STR data across 200 styles."

---

## What's Next

In Part 7, we tackle the question that sits underneath every markdown and allocation decision: **demand forecasting**. Why is forecasting in retail so much harder than in other industries? How do you forecast a product that's never existed before? And what's the vicious cycle that makes every stockout you miss make the next one more likely?

---

*This post is part of "The Retail Data Playbook" — a series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this post are fictional and used for illustrative purposes.*
