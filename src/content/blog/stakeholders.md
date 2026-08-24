---
title: "The Hidden Language of Retail: A Data Scientist's Field Guide to Stakeholders"
date: 2026-03-28
description: "Retail is an industry where the data science fails at the organizational layer far more often than at the technical layer. Before you write a single line of code, you need to know who makes decisions, what they actually care about, and — crucially — how they'll interpret your output."
tags: [retail, data-science, inventory-management, data-analytics]
draft: false
link: https://medium.com/@a.emrevarol/the-hidden-language-of-retail-a-data-scientists-field-guide-to-stakeholders-946787f0fe9d
link_text: Read on Medium
published: true
---

# The Hidden Language of Retail: A Data Scientist's Field Guide to Stakeholders

*Part 2 of "The Retail Data Playbook"*

---

Eight months into my first retail project, I built a markdown optimization model I was genuinely proud of. It was well-calibrated, interpretable, and produced recommendations that were — on paper — clearly better than what the business was doing manually.

The planner used it once, told me it was "interesting," and went back to her spreadsheet.

I didn't understand why until I sat next to her for a day and watched how she actually worked. The model was answering the wrong question in the wrong language for the wrong person. It wasn't a model problem. It was a stakeholder problem.

Retail is an industry where the data science fails at the organizational layer far more often than at the technical layer. Before you write a single line of code, you need to know who makes decisions, what they actually care about, and — crucially — how they'll interpret your output.

![A group of people in a meeting around a table](./stakeholders-hero.jpg)

*Photo by [Rodeo Project Management Software](https://unsplash.com/@getrodeo) on [Unsplash](https://unsplash.com/).*

---

## The Cast of Characters

Every retailer organizes slightly differently, but five roles show up in almost every company. Let me walk through each one using TrendCo — the fictional mid-tier UK fashion brand you may have met in earlier posts in this series.

---

### The Buyer (aka Merchandiser)

**What they own:** Product selection. The buyer decides *which* products TrendCo carries, from which suppliers, at what negotiated cost. They attend trade shows, evaluate collections, build supplier relationships, and sign off on purchase orders months before a single unit arrives in the country.

**What keeps them up at night:** Gross margin. Did they pick winners? A buyer who selects a collection that sells through at full price is a hero. One whose collection requires deep markdowns is having a very bad quarter.

**How they think:** "Will this product make money?" They're making bets on taste, trend timing, and supplier quality all at once. They are often highly intuitive, pattern-matching from years of experience. They distrust models that feel like black boxes and respond better to "here's the evidence for this decision" than "the model says so."

**What they need from you:** Risk quantification on buying decisions — before the order is placed, not after. Frame it in margin terms.

> *"Your plan is to buy 8,000 units of this blazer. Based on the velocity of similar styles in previous spring seasons, there's a 35% chance demand is below 5,500 units. At that volume, clearance markdowns would cost approximately £42,000 in lost margin. Reducing the initial order to 6,000 with a reorder trigger at Week 6 reduces that downside to £18,000, with limited upside risk."*

That's a conversation a buyer can act on. "The model predicts 6,200 units" is not.

---

### The Planner (Merchandise Planner)

**What they own:** The financial plan. How much inventory to buy in total, when to spend the budget (Open-to-Buy, or OTB), and whether the business is hitting its sales and margin targets week by week.

**What keeps them up at night:** Being off-plan. Overspent OTB means too much stock coming in — capital tied up, markdown risk rising. Underspent OTB means missed sales opportunities. They are perpetually balancing two opposing pressures.

**How they think:** In weeks. Weeks of Supply (WOS) is their heartbeat metric — it tells them how long current inventory will last at current sales rates. If WOS is too high, they want to slow receipts or accelerate markdowns. Too low, they want to reorder or transfer in.

**What they need from you:** WOS and OTB projections, presented in the vocabulary they already use. Not "the model predicts X" — but "current WOS is 9.2 against a 5-week target; here are the 8 styles contributing most to the overhang, and the estimated markdown spend required to bring WOS to target by Week 12."

**The planner's conflict with the buyer:** The buyer wants to buy more (more product = more chances to win). The planner wants to buy less (more product = more markdown risk). This tension is healthy and intentional — the planner acts as a financial guardrail on the buyer's optimism.

---

### The Allocator

**What they own:** Distribution. Once TrendCo's DC receives a shipment of the Cleo Wrap Dress, the allocator decides which stores get which quantities in which sizes. They also manage transfers — moving stock between stores when some locations are sold out and others are sitting on excess.

**What keeps them up at night:** Store-level sell-through and broken assortments. An allocator who sends size M to stores whose customers are predominantly L/XL has just created a brokenness problem that will cascade into markdowns 6 weeks later. (We covered this in depth in Part 4.)

**How they think:** In store clusters and size curves. They group stores by customer profile, match products to profiles, and think constantly about whether each store has the right depth per size to avoid early stockouts.

**What they need from you:** Stock distribution vs. demand profile, side by side, at the store level. A ranked list of "under-allocated store × style combinations" and "transfer opportunities" (move from Store A which has excess to Store B which is stocking out) is immediately actionable. The framing that lands: "transferring 45 units of Cleo Wrap Dress from Bristol to London is estimated to prevent £3,200 in markdown spend."

**The allocator's conflict with supply chain:** The allocator wants flexibility — the ability to move stock between stores quickly. The supply chain manager wants to minimize the cost and complexity of transfers. Small inter-store shipments are expensive to route. Every transfer the allocator wants has a logistics cost the supply chain has to absorb.

---

### The Category Manager

**What they own:** Strategy for an entire product category — not just one style, but all of womenswear, or all of accessories. They set the competitive positioning, pricing architecture, promotional calendar, and assortment philosophy for their domain.

**What keeps them up at night:** Category market share and overall category Profit and Loss (P&L). They are asking "are we winning in dresses against our competitors?" not "is this one dress selling?"

**How they think:** Top-down. They start with market context (what's the competition doing, what are customers shifting toward?) and work down to assortment decisions. They're the ones who might decide to sacrifice margin on a traffic-driving basic product because they know it brings customers into store who then buy higher-margin accessories.

**What they need from you:** Competitive benchmarking, category-level trend analysis, and the ability to model assortment tradeoffs. "If we reduce the number of dress options from 120 to 90 SKUs, here's the expected impact on sales volume, margin, and customer satisfaction" is a category manager question. An individual markdown recommendation is too granular.

**The category manager's conflict with the buyer:** The category manager might want to run a loss-leader promotion on a key style to drive foot traffic. The buyer — whose bonus depends on gross margin per unit — may push back hard. Same data; different incentives.

---

### The Supply Chain Manager

**What they own:** The physical flow of goods from suppliers to distribution centers to stores. Lead times, logistics costs, DC capacity, transport routes — this is their world.

**What keeps them up at night:** On-time in-full (OTIF) delivery and cost-per-unit-delivered. A two-day delay on a bestselling style during peak selling season can mean millions in lost sales that no amount of supply chain efficiency will ever recover.

**How they think:** In service levels and variability. They want predictable, consistent flow. They hate surprises — a last-minute rush order from a buyer, or a transfer request from an allocator that requires splitting a truck across 15 stores, is a nightmare to execute cost-effectively.

**What they need from you:** Forecasts they can plan logistics around. "Lead time variability for this supplier is ±6 days — reducing it to ±2 days would allow safety stock reductions of approximately 15% across 200 SKUs, freeing X units of DC space" is supply chain language. Margin percentages are not.

---

## The Conflict Map

Here's the full picture of who pulls against whom — and why:

| Pair | Tension |
|------|---------|
| Buyer ↔ Planner | Buyer wants to buy more; planner wants to buy less |
| Allocator ↔ Supply Chain | Allocator wants flexible, frequent transfers; SC wants batch efficiency |
| Category Manager ↔ Buyer | Cat manager wants category share (sometimes sacrificing margin); buyer protects margin targets |
| Planner ↔ Category Manager | Planner wants to cut slow stock via markdown; cat manager may want to protect brand perception |
| All ↔ Supply Chain | Everyone wants fast, flexible logistics; SC wants predictable, consolidated flow |

These conflicts are not dysfunctional — they are checks and balances. The buyer's optimism is tempered by the planner's caution. The allocator's flexibility is balanced by supply chain's cost discipline. The system produces better decisions under tension than any single stakeholder would produce alone.

**Your job as a data scientist is not to take sides.** Your job is to give each stakeholder the information they need to make a better decision within their domain — and to make the tradeoffs between domains visible to whoever arbitrates them.

---

## The Same Data, Four Different Questions

Let me make this concrete. It's Week 7 of TrendCo's Spring 2026 season. The Cleo Wrap Dress has a 43.7% cumulative STR, tracking slightly ahead of historical curve.

Here's how each stakeholder reads that:

**TrendCo Spring 2026 — Cleo Wrap Dress, Week 7 Summary**

| Metric | Value | Role Who Cares Most |
|--------|-------|---------------------|
| Cumulative STR | 43.7% | Planner, Buyer |
| WOS remaining | 8.3 weeks | Planner |
| OTB impact of reorder | +£42,000 | Planner |
| XS / S sold out in 94 of 120 stores | — | Allocator |
| Projected final STR (trend-adjusted) | ~88% | Buyer |
| Transfer opportunity: 180 M units to rebalance | — | Allocator |
| Logistics cost of transfer: £1,200 | — | Supply Chain |
| Projected margin at current trajectory | £312,000 gross | Category Manager |

The buyer's question: "Is the Cleo a winner I should reorder?" → Answer: yes, trend-adjusted projection is 88%.
The planner's question: "Can I afford a reorder against OTB?" → Separate conversation about budget.
The allocator's question: "Where do I move the remaining M units?" → Transfer recommendation list.
The supply chain manager's question: "How do I batch these transfers efficiently?" → Logistics optimization.

If you show all four stakeholders the same "43.7% STR" summary dashboard, three of them will find it mildly interesting and one will find it useful. If you design outputs that answer each person's actual question, all four will.

---

## A Note on Retail Formats

One more layer that shapes who you're building for: the type of retailer.

**TrendCo is a specialty fashion retailer.** Its data science problems are heavily weighted toward assortment, size curves, allocation, STR, and markdown timing. The buyer and allocator are the power users.

At **FreshMart** — a grocery chain — the equivalent power users are the category manager and replenishment analyst. The problems are promotions, on-shelf availability (OSA), waste minimization, and fill rates. There's no equivalent of "size curves" or "one-time buy" because products replenish continuously.

**A quick format reference:**

| Format | Who Drives DS Decisions | Primary DS Problems |
|--------|------------------------|---------------------|
| Grocery / FMCG | Category manager, replenishment | Promotions, OSA, waste, demand forecasting |
| Specialty fashion | Buyer, allocator, planner | STR, size curves, allocation, markdowns |
| Department store | Buying team by department, OTB planner | Mix of fashion + category; space allocation |
| Discount / off-price | Category manager, supply chain | Replenishment, cost efficiency, opportunistic buying |
| E-commerce / omni | Product team, supply chain | Demand forecasting, fulfillment, returns |

Knowing the format tells you which stakeholders matter most, what vocabulary they use, and which metrics they'll actually act on. A grocery category manager doesn't care about sell-through rate. A fashion allocator doesn't care about promotion ROI. Getting this right is the difference between building something that gets used and building something that gets demo'd once and abandoned.

---

## Key Takeaways

- **Retail has five core stakeholders:** buyer, planner, allocator, category manager, supply chain. Each owns a different lever and has a different definition of success.
- **Their conflicts are structural and healthy.** Buyer vs. planner, allocator vs. supply chain — these tensions produce better decisions than any single stakeholder would make alone.
- **The same data answers four different questions.** Design outputs for the decision each stakeholder actually makes, not for a generic "the model says X" result.
- **Speak each role's language.** Buyers respond to margin risk framing. Planners respond to OTB and WOS. Allocators respond to transfer recommendations. Supply chain responds to service levels and logistics cost.
- **Retail format shapes which stakeholders matter most.** Fashion → buyer/allocator. Grocery → category manager/replenishment. Know your format.

---

## What's Next

In Part 3, we go deep on the single most important metric in retail: **Sell-Through Rate**. How it's calculated, how to project it, what it looks like at the size level — and why aggregate STR is almost always a lie that hides the real story.

---

*This post is part of "The Retail Data Playbook" — a series for data scientists and analysts building products for retail and e-commerce businesses.*

*All company names and data in this post are fictional and used for illustrative purposes.*
