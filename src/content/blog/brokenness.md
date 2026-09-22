---
title: "When \"98% In Stock\" Is a Lie: The Brokenness Problem"
date: 2026-03-30
description: "The brokenness problem is one of the most expensive things retailers consistently measure wrong."
tags: [retail, data-science, inventory-management, data-analytics]
series: retail-data-playbook
part: 4
draft: false
link: https://medium.com/@a.emrevarol/when-98-in-stock-is-a-lie-the-brokenness-problem-5379db72e004
link_text: Read on Medium
---
*Part 4 of "The Retail Data Playbook"*

---

A fashion retailer's weekly dashboard showed 98% in-stock rate across its womenswear category. The buying team celebrated. The stores called in furious.

Customers were walking out empty-handed — not because products were missing, but because *their size* was missing. The system counted a dress as "in stock" as long as at least one unit existed anywhere. It didn't matter that only 2XL remained in 80 stores out of 120. The metric looked fine. The business was bleeding.

This is the brokenness problem. And it's one of the most expensive things retailers consistently measure wrong.

![Rows of folded clothing on a retail shelf](../../assets/blog/brokenness-hero.jpg)

*Photo by [Nguyễn Duy Hưng](https://unsplash.com/@hungnguyenvn) on [Unsplash](https://unsplash.com/).*

---

## The Scenario: TrendCo's Nova Linen Blazer

It's Week 6 of TrendCo's Spring 2026 season. The Nova Linen Blazer launched with 12,000 units distributed across 120 stores. The planning dashboard shows **61% in-stock rate** — borderline, but not alarming.

Then a store manager from the Manchester flagship calls: "We've had customers asking for the Nova Blazer every day this week. We have plenty of it. But they all want XS, S, or M, and we've been out since Week 3."

Let's look at what the data actually says.

---

## What the Numbers Really Show

**TrendCo — Nova Linen Blazer, Week 6**
*Total receipts: 12,000 units | Full price: £89 | Cost: £28*

**Chain-wide size inventory:**

| Size | Receipts | Sold | Remaining | Size STR | Stock Status |
|------|---------|------|-----------|----------|--------------|
| XS | 600 | 600 | 0 | **100%** | Sold out — Wk 3 |
| S | 1,800 | 1,800 | 0 | **100%** | Sold out — Wk 4 |
| M | 3,600 | 3,420 | 180 | 95.0% | Nearly gone |
| L | 3,600 | 2,160 | 1,440 | 60.0% | Slow |
| XL | 1,800 | 720 | 1,080 | 40.0% | Very slow |
| 2XL | 600 | 120 | 480 | 20.0% | Barely moving |
| **Total** | **12,000** | **8,820** | **3,180** | **73.5%** | "Looks healthy" |

The aggregate STR is 73.5%. By any standard benchmark, that's a healthy number — tracking well ahead of curve.

But zoom in on the store level, and the picture collapses.

**Store-level brokenness at Week 6 (sample of 10 stores):**

| Store | XS | S | M | L | XL | 2XL | Sizes OOS | Brokenness |
|-------|----|----|----|----|-----|------|-----------|------------|
| Manchester Flagship | 0 | 0 | 2 | 18 | 12 | 4 | XS, S | 33% |
| Leeds City | 0 | 0 | 0 | 14 | 9 | 3 | XS, S, M | **50%** |
| Birmingham Grand | 0 | 0 | 1 | 16 | 11 | 4 | XS, S | 33% |
| Bristol Cabot | 0 | 0 | 0 | 11 | 8 | 3 | XS, S, M | **50%** |
| Edinburgh Rose St | 0 | 0 | 3 | 12 | 7 | 2 | XS, S | 33% |
| London Oxford St | 0 | 0 | 0 | 22 | 14 | 5 | XS, S, M | **50%** |
| Cardiff Queens | 0 | 0 | 0 | 9 | 6 | 2 | XS, S, M | **50%** |
| Liverpool One | 0 | 0 | 1 | 13 | 8 | 3 | XS, S | 33% |
| Nottingham | 0 | 0 | 0 | 10 | 7 | 3 | XS, S, M | **50%** |
| Newcastle Eldon | 0 | 0 | 2 | 11 | 9 | 2 | XS, S | 33% |

**Every single store is broken.** XS and S are gone everywhere. M is gone in half the network. What remains is L, XL, and 2XL — sizes that sell more slowly and will almost certainly need a markdown to clear.

---

## The Cascade Nobody Wanted

Here's why this matters so much. Brokenness doesn't just create lost sales — it triggers a chain reaction that ends in margin destruction.

**The brokenness cascade:**

```
Week 3: XS and S sell out in most stores
        → Customers who want those sizes walk out empty-handed (lost sales)

Week 4–5: Remaining L/XL/2XL sell slowly; overall STR declines
          → Planner sees STR slowing, raises concern

Week 6: Planner recommends markdown on the Nova Blazer
        → But wait — the product has strong demand. The SIZE CURVE was wrong.

Week 7 (if markdown applied): L/XL/2XL clear at 30% off
        → Blended margin collapses
        → Nova Blazer goes on the "underperforming styles" list
        → Buyer reduces order depth for similar styles next season
        → The wrong lesson is learned
```

The markdown wasn't caused by weak demand. It was caused by a broken assortment. But without size-level analysis, the business will never know the difference.

---

## Measuring Brokenness Properly

The standard formula:

```
Brokenness (%) = Out-of-Stock Sizes / Total Sizes in Range × 100
```

For the Nova Blazer chain-wide: XS and S gone, M nearly gone → roughly 2–3 sizes effectively unavailable out of 6 → **33–50% brokenness**.

But this flat measure misses something critical: **not all sizes are equal.** Size M drives far more demand than size 2XL. A smarter metric weights by the expected demand contribution of each size.

**Weighted availability for Nova Blazer:**

| Size | Demand Weight | Available? | Weighted Contribution |
|------|--------------|------------|----------------------|
| XS | 5% | No | 0.00% |
| S | 15% | No | 0.00% |
| M | 30% | Partially (15% of stores) | 4.50% |
| L | 30% | Yes | 30.00% |
| XL | 15% | Yes | 15.00% |
| 2XL | 5% | Yes | 5.00% |
| **Total** | **100%** | | **54.5%** |

**Weighted availability: 54.5%.** Less than half of expected demand can actually be captured from in-store stock.

Compare this to the 98% in-stock headline figure. Same product. Completely different reality.

---

## The Three Decisions Brokenness Affects

Brokenness isn't a single metric with a single use. Which measure you need depends on the decision you're making:

| Decision | Right Brokenness Measure | Why |
|----------|--------------------------|-----|
| Should we markdown this style? | Chain-wide product brokenness | If >50% of sizes are OOS across the whole network, the style is structurally broken |
| Which stores need stock transferred in? | Store-level brokenness | Identifies stores where the product is incomplete but DC stock is available |
| Is our size curve right for next season? | Size-level STR vs. demand weight | Sizes with 100% STR early = demand unmet by supply curve; rethink ratio |
| DC replenishment decision | DC-level completeness | Does the DC still hold all sizes to send to stores? |

For the Nova Blazer, the right answer at Week 6 is **not** a markdown. It's:

1. Transfer the 180 remaining M units from low-traffic stores to the 8 stores that still have M inventory demand
2. Consolidate remaining L/XL/2XL into the 20 stores with historically stronger demand for those sizes
3. Accept that XS and S are gone — calculate the lost sales impact and feed it back into next season's size curve

---

## What the Lost Sales Actually Cost

The sizing mistake is recoverable — but it has a real price tag. Let's estimate it.

**Lost sales from XS and S stockouts:**

TrendCo's historical data shows that for blazers in this price range, XS = 5% and S = 15% of demand. With 12,000 units total:
- Expected XS demand: 600 units ✓ (all sold)
- Expected S demand: 1,800 units ✓ (all sold)

But XS and S sold out by Week 3–4 out of a planned 20-week season. That means 16+ weeks of ongoing demand went unmet. If weekly velocity in the first 3 weeks was ~150 XS and ~450 S units per week:

| Size | Weeks Sold Out | Est. Weekly Lost Sales | Total Lost Units | Revenue Lost (@ £89) |
|------|---------------|----------------------|------------------|----------------------|
| XS | ~16 weeks | ~150 units/wk | ~2,400 units | **£213,600** |
| S | ~16 weeks | ~450 units/wk | ~7,200 units | **£640,800** |
| **Total** | | | **~9,600 units** | **~£854,400** |

These are rough estimates — real lost sales calculations require demand modeling to decouple "sold out" from "demand slowed naturally." But the order of magnitude matters. **Nearly £1M in potential revenue, gone.** Not because customers didn't want the product — because the size allocation was wrong.

---

## What the Data Scientist Builds

The planner doesn't need to manually check size STRs across 120 stores every week. That's what data systems are for.

Here's the minimum viable brokenness monitoring infrastructure:

**1. Size-level stockout alerts (early warning)**
- Flag any size at >90% STR before Week 6 of a 20-week season
- Trigger: "Potential unmet demand — investigate reorder or transfer opportunity"
- Silence the alert if demand weight for that size is <5% (edge sizes, acceptable to stock out early)

**2. Store brokenness score (weekly)**
- For each store × style combination, compute % of sizes OOS
- Threshold: if brokenness >33% and style is in Week 1–12, flag for transfer review
- Output: ranked list of "most broken store × style pairs" for the allocation team each Monday

**3. Weighted availability by style (portfolio view)**
- Aggregate across stores, weighted by demand curve
- Track trend week-over-week: is availability declining faster than expected?
- Threshold: weighted availability <70% triggers planning review

**4. Size curve accuracy report (post-season)**
- Compare ordered size ratio to actual sell-through ratio by size
- Highlight sizes consistently 100% STR (undersupplied) vs. consistently <30% STR (oversupplied)
- Feed into next season's buying model

The key insight: **the planner's job is to act on signals, not to find them.** The data system surfaces the problems; the human decides what to do about them.

---

## The Omnichannel Wrinkle

One important nuance for retailers operating across both stores and online: a size that's sold out in-store may still be available on the website or via ship-from-store from another location.

This changes the calculation. A customer turned away from the Manchester store might order online and still convert — the sale isn't necessarily lost. So:

- **In-store brokenness** drives transfer decisions (move stock between stores)
- **Network brokenness** (OOS across all channels) drives markdown decisions (if it's truly gone everywhere, the markdown conversation is legitimate)

For TrendCo, tracking brokenness separately for in-store vs. online inventory — and flagging when a size is network-wide OOS vs. just locally OOS — is the difference between a reactive business and a proactive one.

---

## Key Takeaways

- **"In stock" at the aggregate level is almost always a lie.** A product can register 98% availability while being completely unavailable in the sizes customers actually want.
- **Brokenness = the assortment is incomplete.** Some sizes sold out; others remain. The result: lost sales *and* markdowns, simultaneously.
- **Size-level STR is the early warning signal.** Any size hitting 100% STR before mid-season signals unmet demand, not strong performance.
- **Weight brokenness by demand.** M going OOS matters 6x more than 2XL going OOS. Flat brokenness metrics miss this.
- **Distinguish the markdown decision from the transfer decision.** Low STR caused by brokenness is an allocation problem, not a demand problem — fix placement before cutting price.
- **Build the infrastructure to surface brokenness automatically.** Planners can't manually check 500 styles × 120 stores × 6 sizes each week. The data system has to do it.

---

## What's Next

We've now seen two of retail's trickiest data problems: STR and brokenness — both concentrated in fashion, where one-time buying decisions lock in consequences for an entire season.

In Part 5, I'll compare the two retail universes head-on: **grocery vs. fashion**. Same industry, almost completely different data science challenges. Continuous replenishment vs. pre-season commitment. Perishability vs. seasonality. FMCG promotions vs. fashion markdowns. If you work across both — or are interviewing at a retailer and aren't sure which world you're entering — this one's for you.

---

*This post is part of "The Retail Data Playbook" — a series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this post are fictional and used for illustrative purposes.*
