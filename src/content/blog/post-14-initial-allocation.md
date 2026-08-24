---
title: The First Irreversible Bet: Initial Allocation
date: 2026-08-28
description: In fashion, there's a decision you usually get to make exactly once per style: how to split the first shipment across your stores. It's called **initial allocation**, and here's what makes it brutal — in most fashion retail, it's also the *last* allocation. The DC ships everything to stores at season start. There's nothing left in the warehouse to fix a mistake with. Whatever each store gets on day one is, more or less, what it has to sell the whole season.
tags: [retail, data science, inventory management, data analytics]
draft: false
link: 
link_text: Read on Medium
published: true
---
# The First Irreversible Bet: Initial Allocation

*Part 14 of "The Retail Data Playbook" — Season 2: Inside the Planning Machine*

---

In fashion, there's a decision you usually get to make exactly once per style: how to split the first shipment across your stores. It's called **initial allocation**, and here's what makes it brutal — in most fashion retail, it's also the *last* allocation. The DC ships everything to stores at season start. There's nothing left in the warehouse to fix a mistake with. Whatever each store gets on day one is, more or less, what it has to sell the whole season.

Get it right and inventory lands where demand is, sells at full price, and clears clean. Get it wrong and you manufacture the two worst outcomes at once: stockouts in the stores that could have sold more, and overstock — headed for markdown — in the stores that never had the demand. Same total units, same product, wildly different margin, decided entirely by how you split the pile.

Season 1 introduced allocation as one of the three ways inventory moves (allocate, replenish, transfer). This post goes inside the allocation decision itself — and, in particular, the one part of it that quietly destroys more fashion margin than almost anything else: the **size curve**.

---

## Allocation Is Not Replenishment

It's worth being precise, because retailers who blur these two make expensive mistakes:

| | Initial Allocation | Replenishment |
|---|---|---|
| Purpose | Proactively distribute new/limited inventory across locations | Reactively restock what's sold |
| Timing | Once, at season start (or a phased first wave) | Continuous, throughout the season |
| Supply assumption | **Finite** — you distribute what you have, once | **Ongoing** — you reorder as needed |
| Character | Predictive bet | Correction engine |
| If you get it wrong | End-of-season markdowns and dead stock | Stockouts, or costly store transfers |

Replenishment is a *correction engine* — it responds to live sales signals. Initial allocation sets the starting position of the whole board. For a style with limited or no reorders — a capsule collection, a seasonal trend piece — allocation isn't just important, it's essentially the only decision that matters.

---

## The Anatomy of an Allocation

A modern initial allocation runs through a recognizable sequence, most of which we've already built up over this season:

1. **Demand sensing** — forecast at store level, using attributes for new styles with no history (the cold-start problem from Parts 11–12).
2. **Store clustering** — group stores on behavior, not revenue (Part 12).
3. **Ideal inventory calc** — for each store, the target stock to support forecast sales *and* meet presentation/merchandising minimums. Ideal allocation = target inventory − current inventory.
4. **Size-curve & pack optimization** — split each store's units across sizes, and package them into efficient pre-packs for the DC.
5. **Execution** — route the trucks.
6. **Monitor & call back** — watch actuals, trigger replenishment/transfers, and at season end recall or mark down the stragglers.

Two of these deserve real attention: how you split units when you don't have enough (the constrained case), and how you split across sizes (the size curve). The second is where the money hides.

---

## The Constrained Case: When You Can't Fill Everyone

The ideal allocation almost never fits the available supply. If every store's ideal ask sums to more than you have — the normal situation for a hot style — you're distributing scarcity. Two disciplined levers:

- **Cluster priority** — fill the highest-performing clusters (flagships, high-STR regionals) to their ideal first; let the weakest clusters take the shortfall.
- **A hold-back strategy** — don't ship everything on day one. Keep a slice in the DC, watch the first two or three weeks of real sales, then deploy the reserve to wherever demand actually showed up.

The hold-back is one of the most underrated moves in fashion. It converts a pure pre-season bet into a bet-plus-correction: you commit most of the inventory blind, but you buy yourself one high-information decision after the market starts talking. We saw exactly this in Part 13 — TrendCo held back 1,600 units of the Floral Wrap and released them once the style proved hot.

---

## The Size Curve: The Quiet Margin Killer

Here's the trap. You can forecast a style's *total* units perfectly and still lose serious margin — if you split those units across sizes wrong. Sell out of M and L in week three while XS and XXL pile up, and your "80% available" style is really serving maybe 40% of demand. It's the brokenness problem from Season 1, created at birth by a bad size curve.

And retailers cause it themselves, every season, with one circular mistake: **they calculate next season's size curve from last season's sales.**

Watch why that's broken. Suppose last season's knitwear sold in this size mix:

**Knitwear — Last Season, As Sold**

| Size | Units sold | % of sales |
|---|---|---|
| S | 400 | 20% |
| M | 1,200 | 60% |
| L | 400 | 20% |

So the system allocates the new style 20/60/20. Looks data-driven. But look at *when* each size sold out:

**Knitwear — Last Season, With Stockout Timing**

| Size | Units received | Sold out? | True demand signal |
|---|---|---|---|
| S | 500 | No — leftovers | ~ demand met |
| M | 1,200 | No — leftovers | ~ demand met |
| L | 400 | **Yes, week 6** | demand was *higher* — customers walked |

L sold out halfway through the season. Every L customer who arrived after week 6 either walked or bought nothing. The "20%" for L isn't demand — it's the ceiling of what you happened to stock. True L demand might have been 35%. Allocate 20/60/20 again next season and you *re-create the exact same stockout*, then read the sales, and conclude — again — that L is 20%. That's the **circular logic of constrained data**: your allocation caps your sales, and then you use those capped sales to set your next allocation. The error is self-perpetuating.

The fix is **demand unconstraining**. Instead of trusting raw sales, the model finds the precise moment each size went out of stock, then uses the store's normal traffic and sales velocity to estimate what *would* have sold if the size had stayed available. Correct the historical curve for censoring first, *then* build the allocation on true demand:

**Knitwear — Corrected (Unconstrained) Size Curve**

| Size | As-sold % (wrong) | Unconstrained % (right) | Allocation impact |
|---|---|---|---|
| S | 20% | 18% | Slightly less |
| M | 60% | 47% | Meaningfully less |
| L | 20% | 35% | **Substantially more** |

Same total units — but this split keeps L on the shelf all season instead of losing it in week six. This is the exact same censoring problem Season 1's forecasting post described (out-of-stock records zero sales, poisoning the training data), applied to the size dimension. If you build nothing else for allocation, build this.

For genuinely new styles with no history at all, the tools shift to **attribute-based models** (borrow the size behavior of similar past products), **regression trees** (where relative price, discount potential, and competitive intensity dominate demand), and **Bayesian inference** for sparse, volatile categories — all aimed at the same goal: allocate on *true* demand, not on the artifacts of last season's stockouts.

---

## The Scenario: TrendCo Allocates the Floral Wrap

TrendCo has 6,400 units of the Floral Wrap Midi to ship on day one (1,600 held back), across four store clusters. Naive approach: split pro-rata by total store revenue. Better approach: allocate to *clustered, unconstrained demand*.

**TrendCo — Initial Allocation, Naive vs Demand-Based**

| Cluster | Stores | Pro-rata by revenue | Demand-based (clustered) | Why the difference |
|---|---|---|---|---|
| Urban Flagship | 12 | 1,900 | 2,600 | Trend-forward; this style over-indexes here |
| Regional City | 34 | 2,400 | 2,500 | On-profile; roughly matched |
| Suburban Family | 58 | 1,700 | 1,100 | Under-indexes on premium trend styles |
| Compact / Outlet | 16 | 400 | 200 | Below minimum shipment for most |
| **Total** | **120** | **6,400** | **6,400** | Same units, different split |

Pro-rata by revenue over-ships the suburbs (where this premium style will stall and get marked down) and starves the flagships (where it would sell at full price). The demand-based split — built on unconstrained, size-correct, cluster-level demand — puts the units where the margin is. Same 6,400 units; a materially different season.

One constraint reality check: the Compact/Outlet cluster gets only 200 units because most of those small stores fall below the **minimum shipment quantity** — it's not worth trucking six units to a store. So they're skipped entirely, and their notional demand gets absorbed by e-commerce. Allocation math always meets physical logistics, and MSQ, receiving windows, and stockroom capacity routinely override the "optimal" answer.

---

## What the Data Scientist Actually Builds

1. **A demand-unconstraining pipeline.** Detect stockout timing per SKU/size/store, estimate lost sales, and correct the size curve *before* it feeds allocation. The single highest-value thing you can build here — it breaks the circular-data trap that costs margin every season.

2. **Behavioral store clustering.** The same clustering that powers assortment (Part 12) powers allocation. K-means on sales velocity, category affinity, and capacity — validated (silhouette score, Davies-Bouldin), not eyeballed.

3. **A constrained allocation optimizer.** Given finite supply, maximize expected full-price sell-through across clusters subject to MSQ, receiving, and capacity constraints — with cluster-priority and hold-back logic baked in.

4. **Attribute / regression-tree models for cold start.** Allocate new styles on their attributes and competitive context, not on a size curve borrowed blindly from one predecessor.

5. **The allocation-quality feedback loop.** Track full-price sell-through and — critically — transfer volume by store. Heavy mid-season transfers out of a store mean you over-allocated it. That signal is next season's training data (which sets up Part 16).

Measure it with the right KPIs: **allocation accuracy**, **full-price sell-through rate** (the cleanest proof the allocation matched demand), **broken-size ratio**, and stock-to-sales. Full-price sell-through is the one to anchor on — it's the number that goes down, invisibly, when a bad size curve breaks the run.

---

## Key Takeaways

- **Initial allocation is often the only allocation.** In fashion the DC ships everything at season start, so the first split is a largely irreversible bet — stockouts in some stores, markdown-bound overstock in others, decided on day one.
- **Allocation ≠ replenishment.** Allocation is a finite, proactive distribution; replenishment is a continuous correction engine. Don't manage one with the other's logic.
- **The size curve is the quiet margin killer.** A perfect total-unit forecast still loses money if the size split is wrong and popular sizes break early.
- **Calculating size curves from raw sales is circular.** Your allocation caps your sales; using those capped sales to set the next allocation re-creates the same stockout forever. Unconstrain demand first.
- **Hold-back converts a blind bet into a bet-plus-correction.** Reserve a slice in the DC; deploy it once the market starts talking.
- **Optimal always meets physical.** MSQ, receiving windows, and capacity override the math at the tails — some stores get rounded up, others skipped.
- **Anchor on full-price sell-through, and feed transfers back.** Rising transfers out of a store are proof you over-allocated it — and the training data to fix it.

---

## What's Next

Initial allocation is the fashion story — a finite pile, split once. But grocery lives in the opposite world: shelves that must be refilled continuously, forever, without drowning the store in stock or letting it run dry. In Part 15 we turn to **store replenishment** — the respiratory system of retail — and the silent failure mode that quietly breaks every replenishment model: **phantom inventory**.

---

*"The Retail Data Playbook" is a series for data scientists and analysts building products for retail and e-commerce businesses. Season 2 goes inside the operating machine of a retailer.*

*All company names and data in this post are fictional and used for illustrative purposes.*
