---
title: The Inventory Optimization Trap: Why More Stock Isn't Always Better
date: 2026-04-10
description: Inventory optimization is one of the highest-impact, most structurally underappreciated applications of data science in retail.
tags: [retail, data science, inventory management, data analytics]
draft: false
link: https://medium.com/@a.emrevarol/the-inventory-optimization-trap-why-more-stock-isnt-always-better-889ba6c1e9b2
link_text: Read on Medium
published: true
---
# The Inventory Optimization Trap: Why More Stock Isn't Always Better

*Part 8 of "The Retail Data Playbook"*

---

When a store runs out of a popular product, the instinct from every direction in the organization is the same: *"Order more."*

The supply chain manager wants bigger safety buffers. The store manager wants fuller shelves. The buyer wants enough stock to capture every sale. "Order more" feels like a no-brainer — the cost of a stockout is visible and immediate; a dissatisfied customer, a lost sale, an angry call from the store. The cost of overstock is diffuse and delayed — it shows up weeks later as a markdown, a write-off, cash tied up that isn't generating returns.

This asymmetry in visibility is why retailers consistently overstock. And it's why inventory optimization is one of the highest-impact, most structurally underappreciated applications of data science in retail.

---

## The Two Costs Nobody Balances Properly

Every unit of inventory you hold has two potential costs, but only one of them shows up clearly on Monday morning.

**The cost of stockout (understocking):**
- Lost revenue on the unit you didn't have
- Lost customer loyalty — some percentage of stockout customers don't come back
- Lost basket: the customer might have bought complementary items that day
- Staff time spent explaining the stockout and finding substitutes

**The cost of overstock (holding):**
- Capital tied up — cash sitting on your shelves instead of funding growth
- Storage cost (DC space, store backroom)
- Markdown risk — if it doesn't sell at full price, it will need a discount
- Spoilage or obsolescence (especially in grocery and fashion)
- Opportunity cost — that shelf space could hold something that turns faster

The classic retail mistake is treating the stockout cost as "real" and the holding cost as "theoretical." Both are very real. The difference is timing.

---

## The Scenario: FreshMart's Safety Stock Decision

FreshMart's replenishment team is reviewing safety stock levels for 50 high-velocity grocery SKUs. The category manager has been pushing to reduce safety stock — working capital is tight. The store operations team has been pushing to increase it — they're tired of fielding calls about empty shelves.

Let's follow one SKU: ** yogurt 500g**, supplier lead time of 2 weeks.

FreshMart's demand data (per store, per week):
- Average weekly demand: 140 units
- Standard deviation of weekly demand: 18 units (after censoring correction — see Part 7)
- Supplier lead time: 2 weeks (but variable — ranges from 1.5 to 3 weeks)
- Lead time standard deviation: 0.4 weeks

**Safety Stock Formula:**

```
Safety Stock = z × √(Lead_Time × σ_demand² + Avg_Demand² × σ_lead_time²)
```

Where:
- **z** = service level factor
- **σ_demand** = standard deviation of demand per period
- **σ_lead_time** = standard deviation of lead time

This extended formula accounts for *both* demand variability and lead time variability — both of which drive stockout risk.

**FreshMart  Yogurt — Safety Stock by Service Level Target**

| Service Level | z Factor | Safety Stock (units) | Capital per Store (@ £1.19) | Stockout Rate |
|--------------|----------|---------------------|----------------------------|---------------|
| 90% | 1.28 | 79 units | £94 | 10 in 100 weeks |
| 95% | 1.65 | 102 units | £121 | 5 in 100 weeks |
| 98% | 2.05 | 126 units | £150 | 2 in 100 weeks |
| 99% | 2.33 | 143 units | £170 | 1 in 100 weeks |
| 99.5% | 2.58 | 159 units | £189 | 0.5 in 100 weeks |

*(The extended formula accounts for both demand and lead time variability: `z × √(2 × 18² + 140² × 0.4²) = z × 61.5`. The basic formula using demand variability alone — `z × σ × √LT` — gives much lower numbers; Part 7 used that simpler baseline. In practice, always use the extended formula when lead times vary.)*

Across 80 stores:

| Service Level | Total Chain Safety Stock | Total Capital Tied Up | Annual Stockout Weeks |
|--------------|-------------------------|----------------------|----------------------|
| 90% | 6,320 units | £7,521 | 416 store-weeks |
| 95% | 8,160 units | £9,710 | 208 store-weeks |
| 98% | 10,080 units | £11,997 | 83 store-weeks |
| 99% | 11,440 units | £13,614 | 42 store-weeks |
| 99.5% | 12,720 units | £15,137 | 21 store-weeks |

Going from 95% to 99% service level on this one SKU costs FreshMart an extra **£3,904 in working capital** to prevent **166 fewer stockout store-weeks** per year. Is that worth it?

That's the conversation the data scientist enables. Without the numbers, it's an argument between "we need fuller shelves" and "we need less inventory." With the numbers, it's a business decision: what's the value of a stockout-free store-week, and how does it compare to £3,904 in tied-up capital?

---

## The Service Level Trap: Why 99% Is Often Wrong

The instinctive answer is "aim for the highest service level." But the math of diminishing returns is brutal.

**The capital cost of each incremental percentage point of service level ( yogurt, 80 stores):**

| From → To | Additional Safety Stock | Additional Capital | Stockout Weeks Prevented |
|-----------|------------------------|-------------------|--------------------------|
| 90% → 95% | 1,840 units | £2,189 | 208 weeks |
| 95% → 98% | 1,920 units | £2,287 | 125 weeks |
| 98% → 99% | 1,360 units | £1,617 | 41 weeks |
| 99% → 99.5% | 1,280 units | £1,523 | 21 weeks |

Going from 90% to 95% costs £2,189 and prevents 208 stockout weeks. Going from 99% to 99.5% costs £1,523 to prevent just 21 stockout weeks — 10× less efficient.

The marginal value of each additional percentage point of service level *typically falls sharply as you approach 100% — though the right service level depends on the SKU's margin and how substitutable it is for the customer*. This is the "diminishing returns zone" — where organizations routinely over-invest in safety stock because the cost appears small (each increment is just "a little more buffer") while the benefit is genuinely diminishing.

**The right service level for any SKU is where the marginal cost of one more unit of safety stock equals the marginal benefit of preventing one more stockout.** For a high-margin, high-loyalty product (like a FreshMart private label bestseller), that might be 98–99%. For a commodity product with easy substitutes, it might be 92%.

---

## Allocation and the Inventory Trap: The Fashion Version

In grocery, inventory optimization is primarily a safety stock and reorder point problem. In fashion, it manifests differently — as an allocation depth problem.

When TrendCo is deciding how to distribute 12,000 units of the Nova Linen Blazer across 120 stores, the tempting instinct is maximum distribution: put a little everywhere.

The math argues for the opposite.

**TrendCo Nova Blazer — Distribution Strategy Comparison**

Assume total inventory: 12,000 units. Two options:

**Option A: Wide distribution** — 100 units to each of 120 stores
**Option B: Deep distribution** — 300 units to the best 40 stores, 0 to the rest

| Metric | Option A (Wide) | Option B (Deep) |
|--------|----------------|----------------|
| Units per store | 100 | 300 |
| Units per size per store | ~17 per size (6 sizes) | ~50 per size |
| Weeks before size-level brokenness | ~4–5 weeks | ~10–12 weeks |
| Projected final STR | 68% | 81% |
| Markdown units (est.) | 3,840 | 2,280 |
| Full-price margin (@ £61/unit net) | £503,520 | £598,440 |
| Markdown margin (@ £35/unit net) | £134,400 | £79,800 |
| **Total projected margin** | **£637,920** | **£678,240** |

**Option B generates ~£40,000 more margin** from the same 12,000 units — not by being smarter about pricing or timing, but by concentrating inventory depth at fewer stores to maintain assortment completeness longer.

Wide distribution sounds intuitively right: "we want the product available everywhere." But with shallow depth per store, every location breaks its assortment early. Customers walk out without the size they want. Stock sits in sizes no one wants. Markdowns follow.

Deep distribution at fewer stores keeps the assortment complete longer, drives higher full-price sell-through at those stores, and accumulates less unsold residual inventory.

**The saturation decision rule:**
- **Core basics** (black jeans, white tees, essential socks): High saturation — put them everywhere; demand is ubiquitous and stable
- **Fashion / trend styles**: Selective saturation — choose stores where similar styles have historically converted well; depth matters more than reach
- **Premium / niche**: Very selective — flagship urban stores only; deep depth per store, never shallow across many

---

## Replenishment: When to Reorder, and How Much

For replenishable products (grocery, basics in fashion), the reorder decision has two components: *when* to trigger and *how much* to order.

**The Reorder Point (ROP):**

```
ROP = (Average Daily Demand × Lead Time in Days) + Safety Stock
```

When inventory hits the ROP, place an order.

**FreshMart  Yogurt ROP at 95% service level:**
- Average daily demand: 20 units/day
- Lead time: 14 days
- Safety stock: 102 units

```
ROP = (20 × 14) + 102 = 280 + 102 = 382 units
```

When FreshMart's yogurt inventory drops to 382 units in a store, the replenishment system should trigger an order. At current velocity, those 382 units will last approximately 19 days — covering the 14-day lead time plus 5 days of safety buffer.

**Order Quantity (Economic Order Quantity):**

How much to order when the ROP is triggered? The Economic Order Quantity (EOQ) balances two costs:
- **Ordering cost**: Every order has a fixed administrative and logistics cost (processing the PO, receiving the shipment, etc.)
- **Holding cost**: Every unit in inventory has a daily holding cost (capital cost, storage, spoilage risk)

```
EOQ = √(2 × Annual Demand × Ordering Cost / Holding Cost per Unit per Year)
```

**FreshMart  Yogurt EOQ example:**
- Annual demand per store: 7,280 units (140/week × 52 weeks)
- Ordering cost: £12 per order (admin + receiving)
- Holding cost: £0.30 per unit per year (capital cost + refrigeration)

```
EOQ = √(2 × 7,280 × 12 / 0.30) = √(582,400) ≈ 763 units
```

FreshMart should order approximately 763 units each time. But this is theoretical — in practice, supplier minimum order quantities, case sizes, and shelf capacity constrain the choice. A supplier with a minimum of 500 and a case size of 24 means the practical order is whichever multiple of 24 gets closest to 763: 768 units (32 cases).

---

## The Transfer Arbitrage: Moving Stock Instead of Buying More

Before ordering new inventory, always ask: is the inventory I need already somewhere in the network?

Inter-store transfers — moving inventory from a store with excess to one that's running low — are often the most efficient way to balance the system. They're not free (logistics cost, labor at both ends), but they're almost always cheaper than the alternative: stockout at Store B while Store A marks down its excess.

**The transfer math:**

TrendCo — Nova Blazer, Week 8:
- Store A (suburban): 180 units remaining, STR 22%, running at 4 units/week → 45 weeks of supply (season ends in 12 weeks)
- Store B (London): 12 units remaining, STR 74%, running at 18 units/week → 0.7 weeks before stockout

Transfer 80 units from Store A to Store B:
- Transfer logistics cost: £3 per unit × 80 = £240
- Units sold at Store B at full price instead of being marked down at Store A: 60 units
- Margin at full price (£61): 60 × £61 = £3,660
- Margin at 35% markdown (£89 × 0.65 = £57.85; £57.85 − £28 cost = £29.85 ≈ £30): 60 × £30 = £1,800
- Margin recovery from transfer: £3,660 − £1,800 = **£1,860**
- Net of transfer cost: £1,860 − £240 = **£1,620 net gain**

Every time a transfer has a positive net gain, it should be executed. The data scientist's job is to compute this automatically across the entire network and rank transfer opportunities by expected margin recovery.

**Transfers also signal allocation quality.** If TrendCo is consistently transferring blazers from suburban stores to London stores every season, the initial allocation model is systematically wrong. The transfer history is training data for fixing allocation before the problem occurs.

---

## Putting It Together: The Inventory Optimization Stack

Inventory optimization isn't one problem — it's a stack of connected decisions:

**Layer 1: Demand forecast**
How much will each SKU sell per period, at each location? (Part 7 covers this in depth.)

**Layer 2: Safety stock sizing**
Given forecast error and lead time variability, what buffer is needed to hit the target service level? Use the extended safety stock formula; calibrate service level by SKU based on margin, substitutability, and customer loyalty impact.

**Layer 3: Reorder point and order quantity**
When to trigger a replenishment order, and how much to order, balancing ordering cost against holding cost (constrained by supplier minimums and case sizes).

**Layer 4: Allocation depth and saturation**
For non-replenishable fashion inventory, how many stores should carry the product, and at what depth per store? More stores ≠ more sales if depth is insufficient to maintain assortment integrity.

**Layer 5: Transfer optimization**
Mid-season: identify store pairs where transferring inventory improves expected margin. Rank by net gain. Execute the top N transfers given logistics constraints.

Each layer feeds the next. Better demand forecasts reduce the safety stock needed at Layer 2. Better allocation at Layer 4 reduces the transfer volume needed at Layer 5. The stack is integrated — optimizing one layer in isolation without the others produces suboptimal results.

---

## Key Takeaways

- **Both overstock and understock have real costs** — but overstock costs are delayed and diffuse, so they're consistently underweighted. Quantify both before any inventory decision.
- **The safety stock formula translates forecast accuracy into capital.** Both demand variability and lead time variability drive buffer requirements — the extended formula accounts for both. Better forecasting directly reduces safety stock needed.
- **Service level has diminishing returns.** Going from 90% to 95% is cheap. Going from 99% to 99.5% is expensive and prevents few stockouts. Calibrate service level by SKU — not one number for the whole business.
- **Wide distribution at shallow depth is usually worse than selective distribution at deep depth.** Spread too thin, you break assortments early and generate markdowns everywhere. Concentrate in the right stores, you sell more at full price.
- **Transfers are almost always cheaper than the alternative.** Running the math on transfer ROI across the network surfaces millions in avoidable markdown spend. Build this as a weekly automated ranking.
- **Transfers are feedback on allocation quality.** High transfer volume = allocation model is systematically wrong. Fix the root, not the symptom.

---

## What's Next

We're approaching the end of the series. In Part 9, we'll step back and look at the 10 data science problems every retailer actually wants solved — framed as business problems, not technical ones. If you're preparing for a retail DS interview or scoping a new project, this is the map.

---

*This post is part of "The Retail Data Playbook" — a series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this post are fictional and used for illustrative purposes.*
