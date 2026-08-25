---
title: "10 Data Science Problems Every Retailer Wants Solved (And How to Frame Them)"
date: 2026-04-12
description: "Most retail data science job descriptions read like a wish list: \"demand forecasting, pricing optimization, personalization, supply chain analytics…\" They rarely tell you what the problem actually looks like from the inside — what goes in, what comes out, who acts on it, and what it's worth when you get it right."
tags: [retail, data-science, inventory-management, data-analytics]
draft: false
link: https://medium.com/@a.emrevarol/10-data-science-problems-every-retailer-wants-solved-and-how-to-frame-them-abb4a6650f83
link_text: Read on Medium
published: true
---
# 10 Data Science Problems Every Retailer Wants Solved (And How to Frame Them)

*Part 9 of "The Retail Data Playbook"*

---

Most retail data science job descriptions read like a wish list: "demand forecasting, pricing optimization, personalization, supply chain analytics…" They rarely tell you what the problem actually looks like from the inside — what goes in, what comes out, who acts on it, and what it's worth when you get it right.

After eight posts in this series, you have the domain context. Now let's put it together as a practical map of the 10 problems retail keeps coming back to — framed not as modelling exercises but as business problems with real inputs, real outputs, and real financial stakes.

Whether you're prepping for a retail DS interview, scoping a new project, or trying to prioritize where to focus first — this is the list.

![A person working through a checklist at a desk](../../assets/blog/ds-problems-hero.jpg)

*Photo by [Dmitriy Khanzhin](https://unsplash.com/@thedimus) on [Unsplash](https://unsplash.com/).*

---

## How to Read This List

Each problem is framed with:
- **The business question** — what the stakeholder is actually asking
- **Inputs** — the data you need
- **Output** — what the model or system produces
- **Who acts on it** — which stakeholder uses the result
- **Financial impact** — the order-of-magnitude opportunity

Problems are tagged **Fashion**, **Grocery**, or **Both** so you know where they apply.

---

## 1. Demand Forecasting `Both`

**The business question:** *"How much of this product will sell, at this store, next week?"*

This is the foundation. Every downstream decision — how much to buy, how much to stock, when to reorder, how much safety stock to hold — is built on top of a demand forecast. A bad forecast doesn't just hurt the forecast team; it cascades into overstocks, stockouts, unnecessary markdowns, and expensive transfer logistics.

| | |
|--|--|
| **Inputs** | POS history, inventory snapshots, promotion calendar, holiday calendar; optionally: weather, competitor pricing, social signals |
| **Output** | Demand forecast by SKU × store × week (or day, for grocery) |
| **Who acts on it** | Planner (OTB, replenishment), allocator (distribution), supply chain (DC orders) |
| **Key challenge** | Censored demand (OOS periods look like zero demand), promotional distortion, new products with no history |
| **Financial impact** | A 5% accuracy improvement reduces safety stock by ~15%, directly freeing working capital across every SKU in the range |

**The framing mistake to avoid:** Treating this as a pure accuracy optimization problem. The right question isn't "what's my MAPE?" — it's "which forecast errors are costing the most money, and how do I reduce those specifically?" A 20% error on a slow-moving SKU is irrelevant. A 10% error on a high-velocity SKU during peak season is enormously costly.

---

## 2. Markdown Optimization `Both`

**The business question:** *"Which styles should we cut prices on, by how much, and when — so we clear inventory while protecting as much margin as possible?"*

Markdowns are inevitable in fashion and common in grocery (for perishables and delisted SKUs). The question is never *whether* to mark down — it's the timing and depth that determine how much margin you preserve.

| | |
|--|--|
| **Inputs** | Cumulative STR, weeks of season remaining, current inventory, price elasticity estimates, historical sell-through curves |
| **Output** | Recommended markdown timing (which week), depth (% off), and store segmentation (which stores get the markdown now vs. later) |
| **Who acts on it** | Planner (triggers the price change), buyer (understands margin implications), store ops (executes in-store) |
| **Key challenge** | Root cause diagnosis — low STR can mean demand failure, brokenness, or wrong store allocation. Only demand failure calls for a markdown |
| **Financial impact** | **4–8 percentage points of margin improvement**. For a £500M fashion retailer, that's £20–40M in additional gross profit from better timing and store-level precision alone |

**The framing mistake to avoid:** Treating every slow seller as a markdown candidate. Before triggering a price cut, run the diagnostic: is it a demand problem, a brokenness problem, or an allocation problem? (See Part 6 for the full framework.) Markdowns on products with allocation problems accelerate margin destruction.

---

## 3. Promotion Effectiveness Measurement `Grocery`

**The business question:** *"Did this promotion actually drive incremental sales, or did we just discount product that customers would have bought anyway?"*

Grocery retailers run hundreds of promotions per year. 20–50% of them generate no meaningful incremental volume. But they continue — because they're entangled with supplier trade spend agreements, and because without rigorous measurement, no one knows which ones are working.

| | |
|--|--|
| **Inputs** | POS data (promoted and non-promoted periods), promotion calendar with start/end dates, baseline demand estimates |
| **Output** | Incremental lift per promotion, cannibalization rate (does it pull from adjacent products?), halo effect (does it lift nearby categories?), full ROI including supplier trade spend |
| **Who acts on it** | Category manager (builds the promotional calendar), finance (allocates trade spend budget) |
| **Key challenge** | Pantry loading — customers stock up during promotions, which creates a post-promo dip that makes the promotion's net effect look worse than the headline lift |
| **Financial impact** | Eliminating the bottom 20% of promotions by ROI typically yields **3–6% profit margin improvement** and frees trade spend for higher-ROI placements |

**The framing mistake to avoid:** Measuring promotion ROI using promoted-week sales only. Always include the post-promotion dip window (typically 2–4 weeks) in your lift estimate. A promotion that looks like +35% lift in Week 1 might be +8% net when you include the demand that was simply pulled forward.

---

## 4. Assortment Optimization `Both`

**The business question:** *"Which products should we carry in which stores — and which should we delist or add?"*

A 200-SKU dress range where 40 SKUs generate 80% of revenue is a common retail reality. The other 160 SKUs tie up capital, consume shelf space, and dilute the focus of allocators and store staff. Assortment optimization identifies what to carry, where, and at what depth.

| | |
|--|--|
| **Inputs** | Sales by product × store, space and capacity constraints, gross margin by SKU, customer demographics by store cluster |
| **Output** | Recommended assortment (what to carry where), range rationalization recommendations (what to add or delist) |
| **Who acts on it** | Buyer (selects styles), category manager (owns range architecture), allocator (decides store distribution) |
| **Key challenge** | Interdependencies — removing a slow SKU that anchors a category can reduce sales of other SKUs in that category ("the anchor effect") |
| **Financial impact** | Better product-location matching typically drives **2–4% sales uplift** and reduces markdowns from poorly-placed inventory |

**The framing mistake to avoid:** Optimizing assortment purely on historical sales. A product that sold poorly at a store where it was barely stocked may have been supply-constrained, not demand-constrained. Separate demand signal from availability signal before delisting decisions.

---

## 5. Store Clustering `Both`

**The business question:** *"Which stores are similar enough that they can share the same assortment, size curve, and promotion strategy?"*

120 stores don't need 120 individual strategies. But one national strategy is too blunt — a London flagship and a rural suburban store have almost nothing in common in terms of customer demographics, size preferences, and product demand. Clustering creates the right number of groups.

| | |
|--|--|
| **Inputs** | Store attributes (format, square footage, location type), sales mix by category, customer demographics (from loyalty data or census proxies), historical size-level sell-through |
| **Output** | Store clusters with shared assortment and allocation strategies |
| **Who acts on it** | Allocator (applies cluster-specific size curves), buyer (ranges products to appropriate clusters), category manager (localises promotions) |
| **Key challenge** | Cluster stability — stores should cluster consistently enough that you can build reliable strategies around them, but flexibly enough to reflect genuine shifts in demographics |
| **Financial impact** | Per-cluster strategies outperform one-size-fits-all approaches by **5–15%** in sell-through, primarily by reducing the mismatch between what's stocked and what local customers want |

**The framing mistake to avoid:** Clustering on store attributes alone (format, sq ft, region). The best clustering features are *behavioural* — what does this store actually sell, at what size distribution, for which customer profile. Attributes are proxies; sales behaviour is the signal.

---

## 6. Size Curve Optimization `Fashion`

**The business question:** *"For each product in each store cluster, what proportion of units should be in each size?"*

Getting size curves wrong is one of the most expensive routine mistakes in fashion retail. Allocate too many M units to a store that skews toward L/XL, and you've created brokenness before the season is two weeks old. Size curve optimization builds store-cluster-level size distributions from historical data and keeps them current as customer demographics shift.

| | |
|--|--|
| **Inputs** | Historical sales by size × store × product category, store cluster assignments, product fit attributes |
| **Output** | Recommended size mix (% allocation per size) by product type × store cluster |
| **Who acts on it** | Allocator (applies the curve when distributing inventory), buyer (inputs into order quantity per size) |
| **Key challenge** | Sparse data — at the store × product level, individual styles may have too few units to produce statistically reliable size distributions. The fix: aggregate at the category level (all fitted dresses, all oversized knitwear) to build the curve, then apply to individual styles |
| **Financial impact** | A 5% improvement in size allocation accuracy reduces size-related markdowns by **10–15%**, because fewer units end up stranded in unpopular sizes |

**Practical tip for interviews:** If asked "how would you build a size curve model?", the answer that impresses is: "I wouldn't build it at the SKU level — not enough data. I'd cluster stores by demographic profile, group products by fit archetype, aggregate sales at the cluster × archetype level to build the curve, validate on holdout seasons, and flag stores where actual size splits deviate >10% from the cluster curve as candidates for their own curve or cluster reassignment."

---

## 7. Replenishment Optimization `Grocery`

**The business question:** *"When should we reorder each product, and how much should we order, so we don't run out or overstock?"*

This is grocery's version of the inventory optimization problem. The inputs are demand forecast, lead time variability, and service level targets. The outputs are reorder points and order quantities. Done well, it's mostly automated. Done badly, it's the root cause of both the empty shelf and the written-off perishable in the same week.

| | |
|--|--|
| **Inputs** | Demand forecast by SKU × store, supplier lead time (mean and variance), service level target by SKU, current inventory levels, case pack sizes |
| **Output** | Reorder point (ROP) and order quantity by SKU × store; triggers purchase orders automatically when inventory hits ROP |
| **Who acts on it** | Replenishment analyst (oversees the automation, manages exceptions), supply chain (executes the orders), store operations (receives the stock) |
| **Key challenge** | Phantom inventory — the system believes 200 units are on hand, but the shelf has been empty for two days because the system count is wrong. The replenishment trigger never fires because it "sees" stock that doesn't exist |
| **Financial impact** | Well-tuned replenishment cuts inventory investment by **10–20%** while maintaining or improving fill rates — purely from removing unnecessary safety stock that was compensating for poor forecast accuracy |

**The phantom inventory problem in practice:** The most reliable detection signal is "perpetual zero sales for a product that should be selling." If a yogurt SKU hasn't registered a single transaction in 48 hours across three stores, and it's not on promotion or marked as delisted, something is wrong with either the stock or the system. Build this alert into any replenishment monitoring system.

---

## 8. Allocation Optimization `Both`

**The business question:** *"When 12,000 units of a new style arrive at the distribution centre, how do we distribute them across 120 stores to maximise sell-through and minimise transfers?"*

Initial allocation is the highest-leverage single decision in fashion retail. Get it right, and the season mostly runs itself. Get it wrong, and the next 12 weeks are a cascade of transfers, brokenness, premature markdowns, and post-mortems.

| | |
|--|--|
| **Inputs** | Demand forecast by store (from analogous past styles), store cluster assignments, size curve by cluster, total available inventory, shelf space constraints, minimum shipment quantities |
| **Output** | Units to send per SKU × size × store |
| **Who acts on it** | Allocator (reviews and overrides the recommendation), supply chain (executes the shipment), store ops (receives the stock) |
| **Key challenge** | Saturation vs. depth tradeoff — spreading inventory across too many stores creates shallow depth per store, which breaks assortments early. Better to allocate deeply to fewer stores where the style has the highest probability of converting |
| **Financial impact** | Better initial allocation reduces inter-store transfers (£2–5 per unit) and improves end-of-season STR by 5–10 percentage points, which compounds into meaningful markdown reduction |

**The signal to watch:** Transfer volume. If you find yourself moving large quantities of stock from suburban stores to London stores every season, the allocation model is giving too much to suburban stores. Transfer data is among the most valuable feedback for improving allocation models — it tells you exactly where the initial distribution was wrong.

---

## 9. Price Optimisation `Both`

**The business question:** *"What is the right regular selling price for this product, given what customers will pay, what competitors charge, and what margin we need?"*

Distinct from markdown optimization (which is about clearing existing inventory), price optimization is about setting the right price before the product hits the shelf. Even a 2% pricing improvement compounds dramatically at scale.

| | |
|--|--|
| **Inputs** | Historical demand at different price points, competitor prices (scraped or sourced), cost and margin targets, cross-product price relationships |
| **Output** | Recommended prices by product × store cluster; price elasticity estimates by category |
| **Who acts on it** | Category manager (sets the pricing architecture), buyer (uses elasticity in buying decisions), finance (models margin impact) |
| **Key challenge** | Endogeneity — price and demand are determined simultaneously. A product that sold 100 units at £50 might have sold 200 at £40 or 60 at £65. You don't observe the counterfactual; you need causal inference techniques (natural experiments, A/B tests, instrumental variables) to estimate true elasticity |
| **Financial impact** | Data-driven pricing optimization can yield up to **10% margin improvement** — primarily by identifying products that are underpriced relative to willingness to pay, and products whose price-sensitivity means small cuts generate outsized volume |

**The framing mistake to avoid:** Running price optimization independently per SKU. Cross-price effects matter — a price cut on  yogurt might cannibalize sales of own-brand yogurt, or it might lift granola sales through a halo effect. Model category-level cross-elasticities before setting individual prices.

---

## 10. Lost Sales Estimation `Both`

**The business question:** *"How much demand did we miss because we were out of stock — and what does that mean for our forecasts?"*

This one often gets deprioritised because it doesn't produce a direct action. It produces corrected data — which then feeds into every other model on this list. It's infrastructure, not a customer-facing product. But it's foundational: every model trained on uncorrected, censored demand data systematically underestimates true demand, leading to chronic under-ordering across the range.

| | |
|--|--|
| **Inputs** | POS data, daily inventory snapshots (to identify OOS periods), substitute product sales (optional), stockout flags |
| **Output** | Corrected demand estimates for every SKU × store × period where a stockout occurred; the "true demand" series that models should be trained on |
| **Who acts on it** | Data engineering (builds the corrected demand table), data science (trains forecasting models on it), replenishment analyst (understands true baseline demand) |
| **Key challenge** | You can't observe what you didn't sell. The estimation is inherently uncertain. But even a rough correction (proportional uplift for OOS periods) is far better than treating OOS periods as "demand was zero" |
| **Financial impact** | Breaks the stockout → low forecast → under-order → more stockouts vicious cycle. In retailers with chronic OOS problems, fixing censoring can improve forecast accuracy by 15–25% without changing the model at all — purely from better training data |

**Why this is the right first project for a new retail DS team:** It produces clean, corrected data that makes every subsequent model better. It's not glamorous, but it has compounding impact. If you want to demonstrate ROI quickly while building infrastructure that lasts — start here.

---

## The Priority Map

Not all 10 problems are equally urgent for every retailer. Here's how to think about sequencing:

**Start here (foundation):**
- Lost sales estimation — fixes the data everything else depends on
- Demand forecasting — every downstream decision runs on this

**High impact, well-defined scope:**
- Markdown optimization — clearest ROI, direct margin impact
- Replenishment optimization *(grocery)* or Allocation optimization *(fashion)*

**Medium-term (require foundation):**
- Promotion effectiveness *(grocery)* — requires clean baseline demand
- Size curve optimization *(fashion)* — requires store clustering
- Store clustering — requires solid sales data by cluster

**Strategic (longer horizon):**
- Assortment optimization — requires stable forecasting and clustering infrastructure
- Price optimization — requires causal inference capability and often A/B testing infrastructure
- Full allocation optimization — the most complex, requires all upstream inputs to be reliable

**The honest advice:** Most retail data science teams try to do too many of these at once and do none of them well. Pick two — one that fixes the data (lost sales), one that drives immediate margin impact (markdown optimization or replenishment) — and go deep before expanding.

---

## Key Takeaways

- **Retail has ~10 canonical DS problems.** They're the same across most retailers, even if the urgency and context differ.
- **Frame each problem as: business question → inputs → output → who acts → financial stake.** This is the vocabulary that lands in retail conversations.
- **Sequencing matters.** Some problems are foundational (lost sales, forecasting); others depend on them (markdown, allocation, promotion effectiveness).
- **The financial impact is real and quantifiable.** Markdown optimization: 4–8 margin points. Replenishment: 10–20% inventory reduction. Promotion effectiveness: 3–6% profit improvement. These are the numbers that get projects approved.
- **Most retail DS teams are underinvested in data infrastructure** (lost sales, metric layer, promotion tagging) and overinvested in complex models trained on bad data. Fix the data first.

---

## What's Next

The final post in this series: **Building a Canonical Metric Layer** — the single most durable thing a retail data scientist can build. How to design a metric architecture that every team in the business can trust, how to handle the aggregation rules that trip everyone up, and what it looks like in practice.

---

*This post is part of "The Retail Data Playbook" — a series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this post are fictional and used for illustrative purposes.*
