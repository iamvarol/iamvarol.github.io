---
title: "The Two Clocks of Retail: Pre-Season vs In-Season Planning"
date: 2026-08-29
description: "A retailer runs on two clocks at the same time, and they tick at completely different speeds."
tags: [retail, data-science, inventory-management, data-analytics]
series: retail-data-playbook
part: 13
draft: false
link: https://medium.com/@a.emrevarol/the-two-clocks-of-retail-pre-season-vs-in-season-planning-af4b807fae34
link_text: Read on Medium
---
# The Two Clocks of Retail: Pre-Season vs In-Season Planning

*Part 13 of "The Retail Data Playbook" — Season 2: Inside the Planning Machine*

---

A retailer runs on two clocks at the same time, and they tick at completely different speeds.

The first clock is slow and deliberate. It starts six to twelve months before a single customer walks in. It sets the budget (Part 11), builds the assortment (Part 12), places the buys, and locks in the size packs. By the time the season opens, this clock has already made almost every big decision — and most of them can't be undone, because the product is already made and on a boat.

The second clock is fast and twitchy. It starts the moment the doors open and re-reads the market every single week — sometimes every day. It watches what's actually selling, chases the winners, marks down the losers, and shuffles stock around the network to fix what the first clock got wrong.

**Pre-season planning** is the slow clock. **In-season planning** is the fast one. Almost every failure I've seen in retail data science comes from building a model that only understands one of them — a beautiful pre-season forecast with no in-season correction loop, or a reactive in-season tool with no memory of the plan it's supposed to be tracking against. This post is about how the two clocks work, where they hand off, and why the pivot between them is where seasons are won or lost.

![A wall covered in clocks showing many different times](../../assets/blog/pre-vs-in-season-hero.jpg)

*Photo by [K HOWARD](https://unsplash.com/@kwh101) on [Unsplash](https://unsplash.com/).*

---

## The Slow Clock: Pre-Season

Pre-season planning is a proactive process that runs 6–12 months ahead of the selling season. Its job is to make the big, expensive, hard-to-reverse decisions with the best information available *at the time* — which is to say, not much, because the season hasn't happened yet. It moves through four stages we've largely already met:

1. **Demand forecasting** — project sales at SKU / store / week granularity, blending history with weather, demographics, competitor pricing, and halo/cannibalization effects.
2. **Merchandise Financial Planning** — turn financial targets into an inventory budget (Part 11).
3. **Assortment & store clustering** — decide what to carry where (Part 12).
4. **Initial allocation & size/pack optimization** — decide how the first shipment splits across stores and sizes (Part 14, next post).

The defining feature of the slow clock is **low flexibility**. Production lead times and supplier commitments mean that once these decisions are made, they're extremely hard to change. You are, in effect, making a bet on a market that doesn't exist yet — and then living with it.

---

## The Fast Clock: In-Season

The moment the season opens, the plan meets reality — and reality never read the plan. In-season planning is the agile, self-correcting loop that runs on live data: **Plan → Execute → Analyze → adjust → repeat.** Its levers are the fast ones:

- **Open-to-Buy management** — the living budget guardrail (Part 11), recalculated weekly as actuals land.
- **Weekly re-trending** — updating the forecast for the rest of the season based on what's actually selling.
- **Replenishment triggers** — auto-reordering the winners (Parts 15 & 17).
- **Store-to-store transfers** — rebalancing stock across the network (Part 16).
- **[Markdown optimization](/blog/markdown-optimization/)** — cutting price on the losers, precisely (Season 1, Post 6).

The defining feature of the fast clock is **very high flexibility**. Almost everything can be adjusted week to week. The constraint isn't "can we change it?" — it's "can we detect what to change, fast enough, and correctly?" That detection problem is where the data scientist lives.

---

## The Two Clocks, Side by Side

**TrendCo — Pre-Season vs In-Season**

| Dimension | Pre-Season (slow clock) | In-Season (fast clock) |
|---|---|---|
| Horizon | 6–12 months before the season | Real-time, week-by-week within the season |
| Core focus | Forecast, budget (MFP), assortment, initial allocation | OTB tracking, re-trending, replenishment, transfers, markdown |
| Data it runs on | History, macro trends, demographics, long-range climate | Live POS, foot traffic, competitor prices, delivery status |
| Methods | Clustering, probabilistic demand forecasting | Price elasticity, dynamic re-trending, exception detection |
| Flexibility | **Low** — locked by lead times and supplier commitments | **Very high** — restructured continuously on sales velocity |
| The question | "What will the market want?" | "What is the market actually doing — and what do we change?" |

These aren't two separate systems. They're two links of one chain. The pre-season plan is the *baseline* the in-season loop measures against; the in-season results are the *training data* that makes next year's pre-season plan better. A retailer that treats them as disconnected — one team throws a plan over the wall, another team reacts to fires — is the single most common organizational failure in planning.

---

## The Scenario: TrendCo's Floral Wrap Dress Hits Reality

Recall the Floral Wrap Midi from Part 12 — the unique, high-walk-rate style TrendCo ranged widely. Pre-season, the slow clock made its bet:

**Floral Wrap Midi — Pre-Season Plan**

| Parameter | Plan |
|---|---|
| Total buy | 8,000 units |
| Planned season STR | 78% over 16 weeks |
| Planned weekly run rate | ~390 units/week |
| Initial allocation | 6,400 units to stores, 1,600 held back in DC |

Then the season opened, and the fast clock started reading:

**Floral Wrap Midi — First 3 Weeks, Actual vs Plan**

| Week | Planned sales | Actual sales | Variance | Cumulative STR |
|---|---|---|---|---|
| 1 | 390 | 505 | +29% | 7.9% |
| 2 | 390 | 540 | +38% | 16.3% |
| 3 | 390 | 610 | +56% | 25.8% |

Three weeks in, the dress is running ~40% ahead of plan and accelerating. Now the two clocks have to talk to each other, and this is exactly the **signal-vs-noise** judgment from Part 11 — except now it's urgent and it's specific.

**Is +40% signal or noise?** The evidence says signal: it's building across three weeks (not a one-week weather blip), it's broad across store clusters (not one anomalous flagship), and the style has no near-substitute (high walk rate — customers aren't switching, they genuinely want *this*). So the fast clock acts:

1. **Re-trend the forecast.** At this velocity the style will sell out around Week 10, leaving six weeks of shelf empty. Revise the season forecast up — with a dampening factor, but decisively.
2. **Release the hold-back.** Push the 1,600 DC units to the hottest clusters now, before they break on size.
3. **Check OTB for a rebuy.** The style is beating plan, so OTB has opened. Can TrendCo get more from the supplier inside the lead time? If yes, this is the highest-ROI buy of the season.
4. **Protect availability.** A high-walk-rate style going out of stock is pure lost margin — every stockout is a customer who walks, not substitutes. Prioritize size-complete replenishment over everything else.

Contrast that with the wrong read. If TrendCo's system had no in-season loop — if it just trusted the pre-season plan — the dress sells out in Week 10, the shelves sit empty for six weeks, the hold-back never moves, the rebuy window closes, and the post-mortem records a "great sell-through" of 78% while quietly missing thousands of units of full-price demand. **The plan looked successful precisely because it was blind to its own ceiling.** That's the trap of running only the slow clock.

---

## Where the Handoff Breaks

The pivot from slow clock to fast clock is where most value leaks out, and the failure modes are predictable:

- **Blinded by averages.** Planning to average weekly demand hides the weekend spikes and the launch surge. As the supply-chain saying goes, your average body temperature is fine with your head in the freezer and your feet on fire. Plan to the distribution, not the mean.
- **Phantom inventory.** The fast clock reads the ERP, but the ERP says a size is in stock when the shelf is empty. Every replenishment and transfer decision downstream is now poisoned. (This is the silent killer we'll dig into in Part 15.)
- **Lead-time error.** The fast clock triggers a rebuy, but the assumed lead time is wrong, so safety stock runs out before the order lands.
- **Siloed teams.** Pre-season planners and in-season allocators on different calendars, different KPIs, not talking. The handoff is a wall, not a bridge.

---

## What the Data Scientist Actually Builds

The pre-season models — demand forecasting, clustering, allocation — get their own posts. The distinctive in-season build is the **detection-and-correction loop**:

1. **A re-trending engine.** Every week, compare actual vs plan at SKU/store granularity, classify each deviation as signal or noise, and output a revised rest-of-season forecast with a confidence-weighted dampening factor. This is the beating heart of the fast clock.

2. **An exception queue, ranked.** The planner cannot look at 200 styles × 120 stores every Monday. Surface the 15 styles that need action this week — the ones sprinting ahead (release hold-back, rebuy, protect availability) and the ones falling behind (transfer or mark down) — ranked by margin at stake.

3. **The plan-vs-actual memory.** Log every pre-season assumption and every in-season correction, so next year's slow clock learns from this year's fast clock. Rising transfer volume, chronic re-trends in the same category, repeated hold-back releases — these are all signals that the pre-season plan was systematically wrong in a fixable way.

The whole point: the pre-season plan is a hypothesis. The in-season loop is the experiment that tests it. The data scientist builds the instrument that reads the experiment fast enough to act while it still matters — and feeds the result back so the next hypothesis is better.

---

## Key Takeaways

- **Retail runs on two clocks.** Pre-season is slow, proactive, and hard to reverse; in-season is fast, reactive, and highly flexible. You must model both.
- **The defining difference is flexibility.** Pre-season decisions are locked by lead times; in-season decisions can change weekly. The in-season challenge isn't "can we change it" but "can we detect what to change, fast and correctly."
- **The handoff is the danger zone.** The pre-season plan is the baseline the in-season loop measures against; in-season results are next year's training data. Treat them as one chain, not two teams.
- **Signal-vs-noise gets urgent in-season.** A style beating plan across weeks, across clusters, with no substitute is signal — re-trend, release hold-back, rebuy, protect availability.
- **A plan with no in-season loop can look successful while failing.** A style that sells out early posts a great STR and silently leaves full-price demand on the table.
- **Build the detection-and-correction loop.** A weekly re-trending engine plus a ranked exception queue plus a plan-vs-actual memory that improves next season's plan.

---

## What's Next

The single most consequential move the slow clock makes is the one we've deferred twice now: **[initial allocation](/blog/initial-allocation/)** — the first shipment from DC to stores. In fashion it's often the *only* allocation, which makes it the first irreversible bet of the season. In Part 14 we get into how it's done: store clustering, the size-curve trap that quietly destroys margin, and why calculating size curves from sales data is a circular mistake retailers make every single year.

---

*"The Retail Data Playbook" is a series for data scientists and analysts building products for retail and e-commerce businesses. Season 2 goes inside the operating machine of a retailer.*

*All company names and data in this post are fictional and used for illustrative purposes.*
