---
title: "The Money Map: How Retail Decides Your Budget Before You Buy Anything"
date: 2026-08-25
description: "Here's something that surprises data scientists new to retail. By the time a buyer sits down to choose next season's dresses, the most important number has already been decided. Not by the buyer. Not by a model. By a spreadsheet built six to nine months earlier, in a room the data team was probably never in."
tags: [retail, data-science, inventory-management, data-analytics]
draft: false
link: 
link_text: Read on Medium
published: true
---
# The Money Map: How Retail Decides Your Budget Before You Buy Anything

*Part 11 of "The Retail Data Playbook" — Season 2: Inside the Planning Machine*

---

In Season 1 of this series, we covered the metrics, the stakeholders, and the decisions that make retail hard. This season, we go one level deeper — into the machine that actually runs a retailer. We'll follow a product through the entire operating calendar: from the budget that funds it, to the assortment that shapes it, to the allocation, replenishment, and transfers that move it, to the systems that increasingly make those calls automatically.

We start where every retail decision starts — the money.

Here's something that surprises data scientists new to retail. By the time a buyer sits down to choose next season's dresses, the most important number has already been decided. Not by the buyer. Not by a model. By a spreadsheet built six to nine months earlier, in a room the data team was probably never in.

That number is the **inventory budget** — how many dollars of product the buyer is allowed to bring in. And the discipline that produces it, **Merchandise Financial Planning (MFP)**, is the least glamorous and most consequential process in the entire retail calendar. Every forecast you build, every allocation you optimize, every markdown you recommend happens *inside* the guardrails that MFP set months before the season began.

If you don't understand where the budget comes from, you'll build models that quietly assume it doesn't exist. This post is about the money map — and where the data scientist actually fits on it.

---

## What MFP Actually Is

MFP is the process that translates a company's **financial targets** into an **inventory investment plan**. It answers one question, in dollars, before anyone picks a single style:

> "Given our sales and margin targets, how much money are we allowed to tie up in inventory — and where?"

It works top-down, cascading down the merchandise hierarchy:

1. **The company sets revenue and margin targets** — e.g., "grow sales 6%, hold gross margin at 60%."
2. **Those targets cascade down the hierarchy** — Division → Department → Class → Category.
3. **At each level, a planner sets** expected sales, the inventory needed to support them, and the target margin.
4. **The result is an inventory budget** — the total dollars available to spend on product.

Crucially, MFP is *not* assortment planning. MFP decides **how much money** goes into Dresses versus Outerwear. Assortment planning — the subject of the next post — decides **which specific dresses**, in which colors, sizes, and stores. Conflate the two and you sever the link between financial intent and shelf reality. MFP is the strategic north star; assortment is the tactical execution beneath it.

---

## The Scenario: TrendCo Plans Spring/Summer

It's September. TrendCo — our fictional UK fashion retailer, 120 stores — is planning next year's Spring/Summer season. The CFO has handed down the top line: Womenswear will target **£52.0M** in sales, up 6% on last year, at a **60% gross margin**.

That £52M doesn't stay a single number for long. Top-down planning breaks it across departments, giving each a share of the sales target, a markdown allowance, and a margin goal:

**TrendCo — Spring/Summer Top-Down Plan (Womenswear Division)**
*Division target: £52.0M sales · +6% vs LY · 60% blended gross margin*

| Department | Planned Sales | % of Division | Planned Markdown % | Target GM% |
|---|---|---|---|---|
| Dresses | £18.2M | 35% | 12% | 62% |
| Tops | £13.0M | 25% | 10% | 61% |
| Knitwear | £7.8M | 15% | 14% | 58% |
| Outerwear | £7.8M | 15% | 15% | 57% |
| Bottoms | £5.2M | 10% | 11% | 60% |
| **Total** | **£52.0M** | **100%** | **12.2%** | **60%** |

This is the guardrail. Every downstream decision — how many dresses to buy, how deep to go on any style, how much to hold back for in-season chasing — has to fit inside the Dresses department's share of the plan. The buyer can be as excited as they like about a £120 trench coat, but Outerwear has £7.8M of planned sales and a receipts budget to match. Enthusiasm doesn't move the number.

### Top-down meets bottom-up

The top-down plan is only half the story. In parallel, the people closest to the product — buyers and product planners — build a **bottom-up** plan: style-level estimates rolled up from what they believe each range will actually sell. Bottom-up planning is the reality check on top-down ambition.

The two almost never agree. Top-down says "Dresses will do £18.2M." Bottom-up says "based on the range we can actually source, £16.9M." **Plan reconciliation** is the (often painful) process of closing that gap into a single number everyone signs. Good planning software manages this with strict version control — a working draft, a locked "waiting for approval" state, and a final approved plan that becomes the season's source of truth. The point is discipline: one plan, agreed, binding.

For a data scientist, this reconciliation is where a lot of value hides. The bottom-up estimate is a forecasting problem. If your models can produce a defensible, style-level bottom-up number faster and more accurately than a buyer's gut, you've inserted yourself into the single most important meeting of the planning calendar.

---

## Open-to-Buy: The Guardrail That Moves

The plan is set in September. The season starts in February. And here's the thing about a plan built six months early: **it's wrong the moment reality arrives.** Some styles fly, others stall, a competitor runs out of stock, the weather turns.

The mechanism that keeps buying honest as reality unfolds is **Open-to-Buy (OTB)** — the single most important financial concept an in-season planner touches. OTB tells you, at any moment, how much budget is left to spend on new inventory:

```
OTB = Planned Sales + Planned Markdowns + Planned End-of-Period Inventory − Beginning-of-Period Inventory
```

Let's run it for TrendCo's Dresses department for the month of March:

**TrendCo — Dresses OTB, March**

| Component | Value |
|---|---|
| Planned sales (March) | £3.00M |
| Planned markdowns (March) | £0.35M |
| Desired end-of-March inventory | £6.20M |
| Inventory at start of March | £7.40M |
| **Open-to-Buy** | **£2.15M** |

So the buyer has **£2.15M** to spend on new dress inventory in March — no more. That number isn't decoration. It's the ceiling on every buying conversation this month.

The magic of OTB is that it's a **living number**, recalculated weekly as actual sales land:

- **Sales beat plan → OTB opens up.** You sold more than expected, so you have room (and reason) to buy more.
- **Sales miss plan → OTB tightens.** You're over-invested relative to demand; buy less until you clear.

This is the direct feedback loop that Season 1 kept pointing at: performance in Week 1 changes what you're allowed to do in Week 2. OTB is where that loop lives financially.

### The judgment call inside the loop

Here's where it gets interesting — and where the data scientist earns their seat. Suppose Week 1 dress sales come in **10% above plan**. Do you revise the whole season up 10% and open OTB accordingly?

It depends on whether the beat is **signal or noise**, and the two correct answers point in opposite directions:

| Situation | Interpretation | OTB action |
|---|---|---|
| One-week weather spike, a holiday shift, a fluke | **Noise** — hold plan | Keep the season forecast; only book the actual. Don't open OTB. |
| A style is genuinely resonating; a competitor went out of stock | **Signal** — extrapolate | Revise the season up, often with a dampening factor (+10% Wk 1 → +5% for remaining weeks) |

Get this wrong in the "noise" direction and you overbuy into a blip — next month's OTB tightens hard and you're marking down by Week 8. Get it wrong in the "signal" direction and you leave the hottest style of the season under-bought while a competitor eats the demand. The dampening factor — trusting the trend partially, and more as evidence accumulates — is exactly the kind of structured judgment a model should encode rather than leave to a Monday-morning gut call.

---

## GMROI: Where the Money *Should* Go

OTB tells you how much you can spend. It doesn't tell you **where** the return is best. That's the job of **Gross Margin Return on Investment (GMROI)** — the metric that tells you how many pounds of gross profit each pound of inventory generates:

```
GMROI = Gross Profit / Average Inventory Cost
```

GMROI is the reallocation lever. When one department is turning inventory into profit efficiently and another is sitting on capital, the planner's job is to move open budget toward the higher-GMROI opportunity. Consider two TrendCo departments at the same mid-season checkpoint:

**TrendCo — Mid-Season GMROI Check**

| Department | Gross Profit (season-to-date) | Avg Inventory (cost) | GMROI | Read |
|---|---|---|---|---|
| Dresses | £6.4M | £3.2M | **2.00** | Working hard — capital is productive |
| Knitwear | £1.9M | £2.6M | **0.73** | Capital tied up in slow stock |

Knitwear is holding £2.6M of inventory at cost to generate £1.9M of profit — every pound invested is barely returning its keep, and it's late enough in the season that it won't recover. Dresses is doing twice the work per pound. The planning move is to stop feeding Knitwear's OTB, clear it down, and route freed-up budget to where GMROI is strong. This is MFP as a closed loop: sales performance → OTB → GMROI → reallocation → next buy.

---

## Why This Breaks in Real Life: The Planning Gap

If MFP is so logical, why is it so often a mess? Because in most retailers it isn't one system — it's several, glued together by spreadsheets and meetings.

Finance builds the strategic budget in one tool. Merchandising builds product plans in another — often offline workbooks with hundreds of tabs. The two are reconciled only when someone consolidates them by hand for a quarterly review. By then the market has moved, and the meeting that was supposed to chart strategy degrades into an argument about *why the numbers don't match and whose fault it is.* This is the **planning gap** — the silo between financial intent and merchandising reality — and it's the number-one reason MFP transformations get funded.

You'll recognize the shape of this problem from Season 1's post on the metric layer: **two teams, same data, different numbers.** The fix is the same in spirit — a single, shared, granular source of truth that finance and merchandising both read from, each through their own lens, without a manual consolidation step in between. Modern planning platforms (RELEX, o9, Blue Yonder, Oracle, SAP) are, at their core, selling exactly that: one data model that turns financial targets from passive goals into active constraints on every downstream plan.

---

## What the Data Scientist Actually Builds

MFP looks like a finance function, so data scientists often assume there's nothing for them here. That's backwards. MFP is a stack of forecasting and optimization problems wearing a finance costume. Here's where you plug in:

1. **The bottom-up forecast.** Produce defensible style- and category-level sales estimates that feed reconciliation — faster and more accurate than the buyer's gut. This is the single highest-leverage entry point.

2. **The signal-vs-noise classifier.** Automate the in-season OTB judgment. For every category, flag whether this week's deviation from plan is a fluke or a trend, and recommend a dampening factor — so OTB adjustments are evidence-based, not vibes-based.

3. **The cold-start problem.** Fashion refreshes its range every season, so much of the plan covers products with *no sales history*. Classical time-series methods have nothing to work with. The modern approach: extract a new style's attributes (category, price tier, color, fabric, silhouette) and match it to similar past products, then borrow their sales curves as proxy data. A good attribute-based cold-start model is often the most valuable thing a DS team can hand the planning function.

4. **The GMROI reallocation view.** Surface, every week, which categories are earning their capital and which aren't — with a concrete "move £X of open budget from here to there" recommendation, not just a dashboard.

5. **The single source of truth.** Help close the planning gap by making finance and merchandising read from the same granular data. The least glamorous work, the most durable value — exactly as it was for the metric layer.

The pattern is the one this whole series keeps returning to: don't hand the planner a table and walk away. Hand them a **decision** — with the number, the reasoning, and the recommended action attached.

---

## Key Takeaways

- **The budget is decided before the buying starts.** MFP translates financial targets into an inventory budget 6–9 months ahead. Every downstream model operates inside guardrails that were set long before the season.
- **MFP ≠ assortment planning.** MFP decides *how much money* goes where (macro, financial, top-down). Assortment decides *which products* (micro, tactical). Keep them distinct in your data and your thinking.
- **OTB is a living guardrail.** It opens when sales beat plan and tightens when they miss. The hard part is the signal-vs-noise judgment on whether to hold plan or extrapolate — a perfect target for a model.
- **GMROI is the reallocation lever.** It tells you not how much to spend, but where the return is. Route open budget toward capital that's working.
- **The planning gap is the real enemy.** Finance and merchandising in separate systems is why MFP fails. A shared, granular source of truth is the fix — the same lesson as the metric layer.
- **MFP is forecasting and optimization in a finance costume.** Bottom-up forecasts, cold-start models, and signal-vs-noise classifiers are where the data scientist belongs.

---

## What's Next

We've set the budget. Now we have to spend it well. In Part 12, we tackle **assortment planning** — the problem of choosing *what* to sell and, just as importantly, *where*. Why is your best-selling product invisible in half your stores? How do you decide between carrying more styles (breadth) and going deeper on fewer (depth)? And how do supplier minimums quietly distort every one of those choices? The money map hands off to the range plan.

---

*"The Retail Data Playbook" is a series for data scientists and analysts building products for retail and e-commerce businesses. Season 2 goes inside the operating machine of a retailer.*

*All company names and data in this post are fictional and used for illustrative purposes.*
