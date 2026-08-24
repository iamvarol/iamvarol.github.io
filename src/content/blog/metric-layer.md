---
title: Building a Canonical Metric Layer: The Foundation of Retail Analytics
date: 2026-05-19
description: There's a meeting that happens at every retailer, in some form, every quarter. The planning team presents their numbers. The finance team presents their numbers. The two sets of numbers don't match.
tags: [retail, data science, inventory management, data analytics]
draft: false
link: https://medium.com/@a.emrevarol/building-a-canonical-metric-layer-the-foundation-of-retail-analytics-abbe746cd66d
link_text: Read on Medium
published: true
---
# Building a Canonical Metric Layer: The Foundation of Retail Analytics

*Part 10 of "The Retail Data Playbook"*

---

There's a meeting that happens at every retailer, in some form, every quarter. The planning team presents their numbers. The finance team presents their numbers. The two sets of numbers don't match.

"Our sell-through is 68%." "We have 71%." "Why are yours higher?" "We're excluding clearance stores." "We shouldn't be excluding clearance stores." "We always exclude clearance stores." "Since when?"

Two hours later, nothing has been decided about the actual business problem because everyone is arguing about whose STR is right.

This is what happens when a business doesn't have a canonical metric layer — a single, trusted source of truth for every key retail KPI, with agreed definitions, aggregation rules, and a data pipeline that every team pulls from.

Building this is the most unglamorous, most impactful thing a retail data scientist can do. It doesn't get conference talks. It doesn't involve neural networks. But it is the infrastructure that makes every other model in this series actually usable — because without it, the planners are working with different numbers than the allocators, who are working with different numbers than the finance team, and every model output gets re-questioned the moment it disagrees with someone's spreadsheet.

---

## The Problem This Solves

Let me make the cost of not having this concrete.

**At TrendCo, without a canonical metric layer:**

- The planning team calculates STR by summing weekly sales / total receipts, excluding returns
- The allocation team calculates STR using sales / (sales + current inventory), including returns
- The finance team calculates STR from financial system data, which lags POS data by 3 days and uses a different cost basis
- The data science team calculates STR from the data warehouse, which hasn't been refreshed since Tuesday

Same metric. Four different numbers. Every meeting starts with 20 minutes of reconciliation before anyone can talk about the actual business.

**With a canonical metric layer:**

One definition. One pipeline. One table. Everyone joins to it. The meeting starts with the business problem.

---

## Design Principles: The Three Rules

Before writing a single line of SQL, settle three principles. Violating any of them produces a metric layer that collapses under its own inconsistency within a season.

**Rule 1: Respect the metric type.**

Every retail metric is one of three types — and the aggregation rule differs for each:

| Type | What it measures | Time aggregation | Example |
|------|-----------------|-----------------|---------|
| **Flow** | Activity over a period — things that accumulate | **SUM** | Sales units, receipts, markdown spend |
| **Point-in-time** | State at a moment — things that don't add up | **AVERAGE** over time, **SUM** across locations (same timestamp) | Inventory on hand, price, WOS |
| **Derived ratio** | Computed from flow and/or point-in-time inputs | **Recalculate from components** — never average the ratio | STR, GMROI, margin %, WOS |

The most common mistake: averaging a ratio. `AVG(store_str)` is wrong. Always. Even if every store has the same volume, use `SUM(sales) / SUM(receipts)`. If stores have different volumes, averaging STRs gives undue weight to small stores.

**Rule 2: Build at the most granular level, then aggregate up.**

Calculate every metric at store × product × day. Aggregate to week, then to month, then to region, then to country. Never calculate at an aggregated level and push down. The granular level is the source of truth; everything above it is a view.

**Rule 3: Separate base from promoted demand.**

Tag every transaction at the daily grain: was this a full-price sale, a markdown sale, or a promotional sale? This single tag enables clean promotion effectiveness measurement, accurate baseline forecasting, and correct margin accounting — none of which are possible if the events are lumped together.

---

## The Metric Architecture

Here's what the canonical metric layer looks like in practice. Three levels, each building on the one below.

---

### Level 1: The Daily Grain (Foundation)

The lowest level. Calculated at **store × product × day**.

**TrendCo Daily Metrics Table — Structure**

| Field | Type | Source | Notes |
|-------|------|--------|-------|
| `store_id` | dimension | store master | |
| `product_id` | dimension | product master | SKU level |
| `date` | dimension | calendar | |
| `sales_units` | flow | POS | Gross sales, before returns |
| `returns_units` | flow | POS | Returns as a separate field — don't net into sales |
| `net_sales_units` | flow | derived | `sales_units − returns_units` |
| `sales_revenue` | flow | POS | At actual transaction price |
| `full_price_units` | flow | POS + price | Units sold at ≥ current regular price |
| `markdown_units` | flow | POS + price | Units sold at permanent discount |
| `promo_units` | flow | POS + promo calendar | Units sold under a temporary promotional price |
| `eod_inventory` | point-in-time | inventory snapshot | End-of-day units on hand |
| `receipts_units` | flow | receiving records | Units received from DC or supplier |
| `transfers_in_units` | flow | transfer records | Units received from another store |
| `transfers_out_units` | flow | transfer records | Units sent to another store |
| `unit_cost` | point-in-time | product master | Cost at time of sale |
| `regular_price` | point-in-time | price history | Scheduled regular price |
| `actual_price` | point-in-time | POS | Average actual selling price that day |
| `is_oos` | flag | derived | 1 if `eod_inventory = 0` and `receipts = 0` |
| `is_promo` | flag | promo calendar | 1 if product had an active promotion this day |

**Key design note on the `is_oos` flag:** This is the input to lost sales estimation. Any day where `eod_inventory = 0` and `receipts = 0` and `net_sales_units = 0` is a candidate OOS day. But be careful — some products are genuinely zero-demand on some days (a seasonal item in off-season, a product in a store that doesn't carry it). Filter OOS flags by "product is in the active range for this store" before marking as true OOS.

---

### Level 2: The Weekly Grain

Aggregated from the daily grain at **store × product × week**.

**Aggregation rules:**

| Metric | How to calculate | Do NOT do this |
|--------|-----------------|----------------|
| `weekly_sales_units` | `SUM(sales_units)` | Avg daily and multiply by 7 |
| `weekly_net_sales_units` | `SUM(net_sales_units)` | |
| `weekly_receipts` | `SUM(receipts_units)` | |
| `sow_inventory` | `eod_inventory` on first day of week | SUM daily inventories |
| `eow_inventory` | `eod_inventory` on last day of week | |
| `avg_inventory` | `AVG(eod_inventory)` across all 7 days | SUM daily inventories |
| `weekly_markdown_units` | `SUM(markdown_units)` | |
| `weekly_promo_units` | `SUM(promo_units)` | |
| `cumulative_str` | `SUM(net_sales_units) / (SUM(net_sales_units) + eow_inventory)` — computed over the season window, not just the week | AVG of daily STRs |
| `wos` | `eow_inventory / (weekly_net_sales_units / 7)` | AVG of daily WOS |
| `oos_days` | `SUM(is_oos)` | |

**TrendCo — Cleo Wrap Dress, Weekly Metrics (sample)**

| Week | Sales | Receipts | EOW Inv | Avg Inv | Cumul. Sales | Cumul. STR | WOS | OOS Days |
|------|-------|---------|---------|---------|-------------|------------|-----|----------|
| Wk 1 | 820 | 18,000 | 17,180 | 17,590 | 820 | 4.6% | 146.8 | 0 |
| Wk 2 | 1,140 | 0 | 16,040 | 16,610 | 1,960 | 10.9% | 98.4 | 0 |
| Wk 3 | 1,050 | 0 | 14,990 | 15,515 | 3,010 | 16.7% | 99.9 | 0 |
| Wk 4 | 980 | 0 | 14,010 | 14,500 | 3,990 | 22.2% | 100.1 | 0 |
| Wk 5 | 1,210 | 0 | 12,800 | 13,405 | 5,200 | 28.9% | 74.0 | 0 |
| Wk 6 | 1,380 | 0 | 11,420 | 12,110 | 6,580 | 36.6% | 57.8 | 0 |
| Wk 7 | 1,290 | 0 | 10,130 | 10,775 | 7,870 | 43.7% | 54.9 | 0 |

This is the table a planner should be able to open on Monday morning and immediately understand: where is the Cleo relative to plan, what's the current WOS, are there any OOS incidents to investigate?

---

### Level 3: The Aggregated Grain (Country / Region / Category)

Built by rolling up Level 2 — but with strict rules about which metrics can be summed and which must be recalculated.

**The correct aggregation from store to country:**

**TrendCo Spring 2026 — Country-Level Metrics, Week 7**

| Metric | How to get it | Common mistake |
|--------|--------------|----------------|
| `total_sales_units` | `SUM(weekly_sales_units)` across stores | — |
| `total_eow_inventory` | `SUM(eow_inventory)` across stores at same timestamp | SUM across different timestamps |
| `country_str` | `SUM(cumulative_sales) / (SUM(cumulative_sales) + SUM(eow_inventory))` | `AVG(store_str)` — wrong because small stores distort the average |
| `country_wos` | `SUM(eow_inventory) / SUM(weekly_sales_units)` | `AVG(store_wos)` — same problem |
| `country_availability` | `SUM(store_sales × store_availability) / SUM(store_sales)` | `AVG(store_availability)` — unweighted average gives too much weight to low-volume stores |
| `country_margin_pct` | `SUM(gross_profit_£) / SUM(net_sales_£)` | `AVG(store_margin_pct)` |

**Why you can never average STR across stores — a worked example:**

| Store | Sales | Receipts | Store STR |
|-------|-------|---------|-----------|
| London Flagship | 9,200 | 12,000 | 76.7% |
| Rural Suburban | 80 | 400 | 20.0% |

`AVG(store_str)` = (76.7% + 20.0%) / 2 = **48.4%** — makes the business look mediocre.

`SUM(sales) / SUM(receipts)` = 9,280 / 12,400 = **74.8%** — reflects what's actually happening, dominated appropriately by the high-volume store.

The rural store's 20% STR is real and matters — but it shouldn't drag down the company-level number. At the company level, 74.8% is the truth. At the store level, the rural store's 20% is a local problem to investigate.

---

## The Metric Definitions Document

The data pipeline is only half of the canonical metric layer. The other half is documentation — a single source of truth that every team can read to understand exactly what each metric means.

A minimal metric definition has five fields. Here's what it looks like for the core retail KPIs:

**TrendCo Canonical Metrics — Definition Table**

| Metric | Definition | Numerator | Denominator | Aggregation Rule | Business Use |
|--------|-----------|-----------|-------------|-----------------|-------------|
| **Sell-Through Rate (STR)** | % of received inventory that has sold | Cumulative net sales units | Cumulative net sales + current inventory | Recalculate from SUM(sales) / (SUM(sales) + SUM(inventory)) | Planner: track style performance vs. historical curve |
| **Weeks of Supply (WOS)** | Weeks of inventory remaining at current sales rate | EOW inventory | Weekly net sales (7-day average) | Recalculate: SUM(eow_inv) / SUM(wkly_sales) | Planner: identify overstock risk; trigger reorder |
| **GMROI** | Gross profit earned per £ of inventory invested | Gross profit (£) | Average inventory at cost (£) | Recalculate from SUM(GP) / AVG(inv_cost) | Buyer: compare product profitability |
| **On-Shelf Availability (OSA)** | % of SKUs physically available to buy | SKU-days in stock | Total SKU-days (in range) | Weighted average by store sales volume | Replenishment: measure service level |
| **Inventory Turnover** | Times inventory is sold and replaced per year | Annualised COGS | Average inventory at cost | Recalculate from SUM(COGS) / AVG(inventory) | Finance: capital efficiency benchmark |
| **Markdown Rate** | % of sales revenue taken at markdown price | Markdown sales (£) | Total net sales (£) | Recalculate from SUM(md_sales) / SUM(net_sales) | Planner: monitor margin erosion |
| **Adjusted STR** | STR corrected for size availability | Actual STR | Weighted availability rate | Recalculate at each grain | Allocator: separate demand from availability signal |

**The rule for "Aggregation Rule":** If it says "Recalculate," that means recompute the ratio from the rolled-up components. Never take the ratio at a lower grain and average it upward.

---

## The SQL That Makes It Real

This is the practical section — the patterns you'll use every week.

**Pattern 1: Weekly sales from daily POS (flow metric — SUM)**
```sql
SELECT
    store_id,
    product_id,
    DATE_TRUNC('week', sale_date) AS week_start,
    SUM(sales_units)              AS weekly_sales,
    SUM(net_sales_units)          AS weekly_net_sales,
    SUM(receipts_units)           AS weekly_receipts,
    SUM(markdown_units)           AS weekly_markdown_units,
    SUM(CASE WHEN is_oos THEN 1 ELSE 0 END) AS oos_days
FROM daily_metrics
GROUP BY 1, 2, 3
```

**Pattern 2: Average inventory from daily snapshots (point-in-time — AVG over time)**
```sql
SELECT
    store_id,
    product_id,
    DATE_TRUNC('week', snapshot_date) AS week_start,
    AVG(eod_inventory)                AS avg_weekly_inventory,
    MIN(eod_inventory)                AS min_inventory,  -- useful for detecting intra-week stockouts
    FIRST_VALUE(eod_inventory) OVER (
        PARTITION BY store_id, product_id, DATE_TRUNC('week', snapshot_date)
        ORDER BY snapshot_date
    ) AS sow_inventory,
    LAST_VALUE(eod_inventory) OVER (
        PARTITION BY store_id, product_id, DATE_TRUNC('week', snapshot_date)
        ORDER BY snapshot_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS eow_inventory
FROM daily_inventory
GROUP BY 1, 2, 3
```

**Pattern 3: Cumulative STR over the season (running SUM window)**
```sql
SELECT
    store_id,
    product_id,
    week_start,
    SUM(weekly_net_sales) OVER (
        PARTITION BY store_id, product_id
        ORDER BY week_start
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS cumulative_sales,
    -- STR = cumulative_sales / (cumulative_sales + current_eow_inventory)
    SUM(weekly_net_sales) OVER (
        PARTITION BY store_id, product_id
        ORDER BY week_start
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    )::FLOAT / NULLIF(
        SUM(weekly_net_sales) OVER (
            PARTITION BY store_id, product_id
            ORDER BY week_start
            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        ) + eow_inventory, 0
    ) AS cumulative_str
FROM weekly_metrics
```

**Pattern 4: Country-level rollup — correct aggregation of ratios**
```sql
SELECT
    country,
    week_start,
    SUM(weekly_net_sales)    AS country_sales,
    SUM(eow_inventory)       AS country_inventory,
    -- Correct: recalculate STR from components
    SUM(cumulative_sales)::FLOAT / NULLIF(
        SUM(cumulative_sales) + SUM(eow_inventory), 0
    ) AS country_str,
    -- Correct: recalculate WOS from components
    SUM(eow_inventory)::FLOAT / NULLIF(SUM(weekly_net_sales), 0)
        AS country_wos,
    -- Correct: availability weighted by store sales
    SUM(weekly_net_sales * store_availability) / NULLIF(SUM(weekly_net_sales), 0)
        AS country_availability_weighted
FROM weekly_store_metrics
JOIN stores USING (store_id)
GROUP BY 1, 2
```

**Pattern 5: 4-week rolling average (for trend smoothing)**
```sql
SELECT
    store_id,
    product_id,
    week_start,
    weekly_net_sales,
    AVG(weekly_net_sales) OVER (
        PARTITION BY store_id, product_id
        ORDER BY week_start
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ) AS rolling_4wk_avg
FROM weekly_metrics;

-- or 

-- Count rows and if they are less than 4 then filter them out
SELECT * FROM (
    SELECT
        store_id,
        product_id,
        week_start,
        weekly_net_sales,
        AVG(weekly_net_sales) OVER (
            PARTITION BY store_id, product_id
            ORDER BY week_start
            ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
        ) AS rolling_4wk_avg,
        COUNT(*) OVER (
            PARTITION BY store_id, product_id
            ORDER BY week_start
            ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
        ) AS weeks_in_window
    FROM weekly_metrics
)
WHERE weeks_in_window = 4;
```

---

## The Gotchas That Will Break Your Metric Layer

**1. Partial weeks at season start and end**

The first and last week of a season often have fewer than 7 days. This deflates STR (fewer selling days in the denominator period) and inflates WOS. Three options:
- *Exclude* partial weeks from KPI reporting
- *Scale up proportionally*: `actual_sales × (7 / days_in_week)` — use for forecasting inputs
- *Flag and include*: add a `is_partial_week` column; downstream teams decide what to do

Never silently include partial weeks without flagging them. A 4-day week with 600 units sold looks like weak performance vs. a 7-day week's 900 units — but the velocity is identical.

**2. Returns timing mismatch**

A dress sold in Week 4 may be returned in Week 7. If you net returns at the point of return, Week 7 looks like fewer net sales than actually occurred. The convention: deduct returns in the week they occur, but track them separately so you can see gross sales and return rate independently.

**3. Transfer double-counting**

A store-to-store transfer of 50 units does not create 50 new units. If you include transfers in "receipts," you'll overstate the denominator in your STR calculation. Track transfers separately from supplier receipts; only include supplier receipts (true new inventory into the system) in STR denominators.

**4. Promotional price misclassification**

A product with a supplier-funded rollback at £0.89 (vs. regular £1.19) is under promotion — even if it looks like a permanent price change in the price history. Without a promotion calendar join, you'll misclassify this as a markdown, contaminating your baseline demand estimates and your promotion effectiveness measurement.

---

## Why This Is Worth Building First

A canonical metric layer is not glamorous. It won't get you a conference invite. The business stakeholders won't notice it exists — which is exactly the point. When it works, meetings start with "the Cleo is tracking 8% above curve" and end with a decision, not a 20-minute reconciliation about whose STR is right.

From a career perspective, building this positions you as the person who made the whole analytics organisation more effective — which is a far stronger signal than shipping one more ML model. It demonstrates that you understand the business deeply enough to define its metrics, that you can build durable infrastructure, and that you're thinking about the organisation's effectiveness, not just your own output.

And every model in this series — markdown optimization, demand forecasting, allocation, replenishment, promotion effectiveness — gets sharper when it runs on clean, consistently-defined inputs. The metric layer is the foundation that makes everything else reliable.

---

## Key Takeaways

- **A canonical metric layer is a single, trusted source of truth for every KPI** — one definition, one pipeline, one table. It ends the reconciliation meetings.
- **Three types; three rules:** Flow → SUM over time. Point-in-time → AVG over time, SUM across stores at the same timestamp. Derived ratios → always recalculate from components, never average.
- **Build at the most granular level (store × product × day) and aggregate up.** The granular level is the source of truth; higher levels are views.
- **Separate full-price, markdown, and promo sales at the daily grain.** This single tag enables clean promotion effectiveness, accurate baseline forecasting, and correct margin accounting.
- **The common failure modes are well-known:** partial weeks, return timing mismatches, transfer double-counting, promotional price misclassification. Design around them explicitly.
- **It's worth building first.** Every model in this series gets better when it runs on clean, consistently-defined inputs. The metric layer is infrastructure that compounds.

---

## Closing the Series

This is the tenth and final post in "The Retail Data Playbook." We've covered a lot of ground:

1. **Why retail is hard** — the irreversible bet, the bullwhip effect, the cost of being wrong in both directions
2. **Who makes decisions** — buyer, planner, allocator, category manager, supply chain, and how to speak each one's language
3. **Sell-through rate** — the heartbeat metric, size-level analysis, adjusted STR, velocity
4. **Brokenness** — why "98% in stock" can be a lie, and how to measure what's actually available
5. **Grocery vs. fashion** — two completely different games with different metrics, failure modes, and data challenges
6. **Markdown optimization** — how to diagnose before discounting, and why tiered beats blanket
7. **Demand forecasting** — new products, promotional distortion, and the censoring vicious cycle
8. **Inventory optimization** — safety stock, service level tradeoffs, allocation depth vs. width
9. **The 10 DS problems** — framed as business problems with inputs, outputs, stakeholders, and financial stakes
10. **The canonical metric layer** — the infrastructure that makes everything else reliable

If this series helped you get a foothold in retail — or sharpen thinking you already had — that's exactly what it was for. The retail industry is full of genuinely hard problems, real financial stakes, and stakeholders who will use your work if it answers their actual questions. There's no shortage of interesting work to do.

---

*"The Retail Data Playbook" is a 10-part series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this series are fictional and used for illustrative purposes.*
