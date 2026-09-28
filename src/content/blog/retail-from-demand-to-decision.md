---

## title: "Retail, From Demand to Decision: The Whole Playbook on One Page"
date: 2026-09-26
description: "Eighteen posts looked at eighteen problems — forecasting, sell-through, brokenness, MFP, assortment, allocation, replenishment, transfers, markdowns, the DC, agentic AI. They aren't eighteen problems. They're parts of one system. This is the map that puts them back together."
tags: [retail, data-science, inventory-management, data-analytics]
series: retail-data-playbook
part: 19
draft: false
link:
link_text: Read on Medium

*Part 19 of "The Retail Data Playbook" — The map that connects the whole system*

---

If you've read the previous eighteen posts in this series, you've seen a lot of different problems. Demand forecasting. Sell-through. Brokenness. Inventory optimization. Merchandise financial planning. Assortment. Allocation. Replenishment. Transfers. Markdowns. Distribution centers. Metrics. And, at the end, agentic AI.

They can look like separate problems. They aren't. They're different parts of the same system, and this post exists to put them back together. If the series has one sentence at its center, it is this:

> **Retail is a continuous decision system for placing the right inventory in the right location at the right time, under uncertain demand.**

Everything below is an unpacking of what that sentence means — and a map, with links, back to the post that goes deep on each part.

image: Retail, From Demand to Decision

---



## The Big Problem: Retail Is a Bet on the Future

At its core, retail has a deceptively simple problem: **you have to commit inventory before you know exactly what customers will want.**

That one constraint is what makes everything else hard. Demand is uncertain. Inventory is finite. Products have lead times. Stock is spread across many locations. And a large share of the decisions are expensive or difficult to reverse once made. In fashion, the commitment happens months before the season; in grocery the cycle is days, but the retailer is making replenishment calls against uncertain demand every single one of them. Either way the question is the same:

> **How much inventory should we commit, where should we put it, and when should we move or change it?**

The cost of being wrong runs in both directions. Too much inventory ties up capital and can end in markdowns, spoilage or obsolescence. Too little means stockouts, lost sales and a customer who bought elsewhere. And this is why a better model does not automatically fix retail. A forecast can be statistically excellent and still produce a bad outcome if the decision wrapped around it is wrong. The model is one component of the system, not the system.
That was the argument of [Part 1](/blog/why-retail-is-hard/), and it's the argument of every post since.

---



## Retail Runs on Two Clocks

The most useful mental model in the whole series is that retail operates on **two clocks at the same time** ([Part 13](/blog/pre-vs-in-season/)).

**The slow clock is pre-season.** It runs months before the customer arrives:
**demand forecast → merchandise financial plan → assortment → buy → initial allocation**
These are large, expensive, hard-to-reverse decisions, made with historical sales, trend signals, weather expectations and competitor intelligence — but without the one thing that matters, because the season hasn't happened yet. Pre-season asks:

> *What do we think the market will want?*

**The fast clock is in-season.**

Once selling starts, the retailer can finally observe reality. Sales arrive, inventory moves, stores diverge, some products become winners and some become slow movers. The loop becomes:
**plan → execute → analyze → adjust → repeat**
and the levers are open-to-buy management, re-trending the forecast, replenishment, store transfers, markdowns and rebalancing. The question changes to:

> *What is the market actually doing, and what should we change?*



This distinction matters enormously for data science. A model that understands only the slow clock never sees the correction loop. A system that understands only the fast clock doesn't know what plan it is supposed to be correcting. The handoff between the two — where the plan meets reality and someone has to decide whether a deviation is signal or noise — is where much of the value can leak.

image 2: **The Two Clocks of Retail**

---



## Two Retail Universes: Fashion and Grocery

The same concepts behave differently depending on the business, and fashion and grocery are not two categories of one problem — they run on different rhythms ([Part 5](/blog/grocery-vs-fashion/)).


|                       | Fashion                    | Grocery                              |
| --------------------- | -------------------------- | ------------------------------------ |
| Core planning rhythm  | Pre-season commitment      | Continuous replenishment             |
| Main uncertainty      | Style, size, timing, trend | Daily demand and promotions          |
| Major inventory risk  | Overstock and markdown     | Stockout and waste                   |
| Headline metric       | Sell-through               | Availability / on-shelf availability |
| Key inventory problem | Depth and localization     | Continuous availability              |
| Data pattern          | Seasonal, size-granular    | Dense, continuous, promotion-heavy   |
| Typical fast lever    | Markdown / transfer        | Replenishment / promotion            |


Fashion makes one large commitment before demand is visible. Grocery makes thousands of smaller decisions while demand is being observed. That difference propagates through the entire data architecture. "Availability" in fashion may mean the right *size* is there. In grocery it may mean the product is physically on the shelf at the moment the customer reaches for it. The technical skills transfer between the two worlds.The business logic does not.

---



## Who Actually Makes the Decisions

Retail is not one decision-maker. Different people own different parts of the system, and they ask different questions of the same data ([Part 2](/blog/stakeholders/)):

```text
                    CUSTOMER
                       │
                       ▼
                CATEGORY MANAGER
                       │
              ┌────────┴────────┐
              ▼                 ▼
            BUYER            PLANNER
              │                 │
              ▼                 ▼
         ASSORTMENT             MFP
              │
              ▼
           ALLOCATOR
              │
              ▼
        SUPPLY CHAIN
              │
        ┌─────┴─────┐
        ▼           ▼
  REPLENISHMENT   TRANSFER
```

The buyer asks:

> *Which products should we buy?*

The planner asks:

> *How much inventory can we afford?*

The allocator asks:

> *Where should it go?*

The supply chain team asks:

> *How do we keep it in the right places?*

These are different questions that happen to share a data source, and they need different outputs.

This is why retail data science is partly a **stakeholder problem**: a technically correct model can still fail because it answered the wrong person's question.

---



## The Product Journey

A product moves through a sequence of decisions, and each stage answers a different question:

```text
PLAN → ASSORT → BUY → ALLOCATE → SELL → REPLENISH → TRANSFER → MARKDOWN → CLEAR
```

Assortment asks:

> *Which products should we carry?*

([Part 12](/blog/assortment-planning/))

Allocation asks:

> *Where should the initial inventory go?*

([Part 14](/blog/initial-allocation/))

Replenishment asks:

> *What should we send next?*

([Part 15](/blog/store-replenishment/))

Transfer asks:

> *Should inventory move from one location to another?*

([Part 16](/blog/store-transfers/))

Markdown asks:

> *Should we cut the price to accelerate sell-through?*

([Part 6](/blog/markdown-optimization/))

And upstream of all of it, the merchandise financial plan decides how much money there is to play with before anyone buys anything ([Part 11](/blog/merchandise-financial-planning/)).

These decisions are connected. They are not interchangeable.

---



## Allocation, Replenishment and Transfer Are Three Different Levers

If there's one distinction worth carrying out of the series, it's this one. The three levers that move inventory are constantly conflated, and they are not the same thing.

**Allocation establishes the initial position.** It's proactive: the product has arrived and the retailer decides how to distribute it — which stores, how many units, which sizes, which clusters. In fashion this is the first irreversible bet, and the size-curve trap lives here.

**Replenishment is the continuous correction mechanism.** The retailer observes inventory and demand and decides whether more should be sent. The simplest version is a reorder point:

> **ROP = Average Daily Demand × Lead Time + Safety Stock**

Real implementations get far more sophisticated, but the logic never changes: reorder before expected demand and its uncertainty push stock below a safe level.

**Transfer changes the location of existing inventory.**

Instead of ordering more from upstream, the retailer asks whether inventory already sitting somewhere else could create more value here.

That makes transfer an economic decision, not a logistics one:

> **Value of selling at destination − transfer cost > value of leaving it (or marking it down) at origin**

A transfer is an inventory-value trade — and the volume of transfers a network needs can also be a useful report card on how well the original allocation worked.



---



## Inventory Is the Physical State of the System

Inventory is where decisions become physical. But one of the most important lessons in the playbook is that **inventory is not the same thing as availability** ([Part 4](/blog/brokenness/)).

A fashion store can hold ten units of a jacket and still be unable to sell one, because the ten units are in sizes nobody currently needs. The inventory number looks healthy. The customer experience is broken. That is *brokenness*: a retailer can report 98% in stock while the sizes and variants that actually drive sales are missing.

Which leads directly to the second lesson:

> **Sales are not demand.**

If an item was unavailable, zero sales does not mean zero demand — the observed signal is censored by inventory. That single fact is why lost-sales estimation and demand unconstraining are foundational problems in retail data science.

---



## Metrics Are the Language of the System

Once you start measuring retail you meet a large collection of metrics, and they are not interchangeable numbers. Each has:

- a definition
- a grain
- an aggregation rule
- a time interpretation
- a business meaning

Three families cover much of it.

**Flow metrics** accumulate over a period.

```text
Weekly Sales = SUM(daily sales)
```

**Point-in-time metrics** are a state at a moment.

```text
Inventory = snapshot at timestamp
```

Aggregating them means being explicit about whether you're summing across locations at the same instant or averaging across time — the two give different numbers with the same name.

**Derived metrics** are ratios.

```text
STR = Sales / Available Units
```

Ratios must be recalculated from their components at whatever grain you're reporting, never averaged from lower-level ratios.This is why the canonical metric layer is infrastructure rather than a reporting nicety. The source of truth is the granular level — typically **store × product × day** — and every higher-level number is a view derived from it. When two teams argue about sell-through, the argument is often about grain and aggregation rather than the business itself.

---



## Forecasting Connects the Past to the Future

With clean measurements in hand, the next question is:

> *What happens next?*

That is where demand forecasting enters ([Part 7](/blog/demand-forecasting/)).

At first glance forecasting is a modeling problem. In retail it's valuable only because it feeds decisions:

```text
Observed Sales
      ↓
Demand Signal
      ↓
Forecast
      ↓
Future Inventory Decision
```

The forecast drives buying, assortment, allocation, replenishment, safety stock and markdown timing. That is also why the hard cases are hard. A new product has no history, so the model borrows from similar products, attributes, categories and store clusters. A promotion distorts the signal, so observed sales reflect the discount rather than underlying demand. A stockout censors it entirely.

The lesson the whole series keeps returning to:

> **Forecast accuracy is not the objective. Decision quality is.**

A forecast creates value only when it improves what the retailer does next.

---



## Inventory Optimization Is an Economic Problem

The goal of inventory optimization is not "hold less stock" ([Part 8](/blog/inventory-optimization/)).

It is a balance.

Too much inventory costs:

- capital
- storage
- markdown risk
- spoilage
- obsolescence
- opportunity cost

Too little costs:

- stockouts
- lost revenue
- customer availability

Safety stock exists because demand and lead time are uncertain. Reorder points exist because inventory takes time to arrive. Service levels exist because the retailer has to decide how much availability it is willing to pay for. At the network level the problem gets more interesting, because inventory does not have to sit where the risk occurs. That is the door to multi-echelon optimization.

---



## The Retailer Is a Network, Not a Collection of Stores

A store is one node. The real object is the network ([Part 17](/blog/dc-replenishment/)):

```text
SUPPLIER
   ↓
  DC
   ↓
STORE A ─────→ CUSTOMER
   ↕
STORE B ─────→ CUSTOMER
```

Once the network is visible, a new class of questions appears: 

Should safety stock sit at the DC or in the stores?

Should some products ship directly from the supplier?

Should a store be replenished from the DC or transferred from a neighbor?

Should incoming inventory be allocated dynamically as it lands?

These are network questions.

Single-node optimization can get them wrong: optimizing every store independently can stack buffers across the network that pooling could have eliminated. Multi-echelon inventory optimization treats the network as a whole and uses risk pooling to decide where inventory should be held. And the bullwhip effect makes the information side just as important. Downstream orders are not consumer demand, and the further a signal travels upstream, the more distorted it can become.



---



## The Entire System Is a Feedback Loop

Now the pieces connect.

Retail is not:

```text
PLAN → EXECUTE → DONE
```

It is:

```text
PLAN
  ↓
EXECUTE
  ↓
OBSERVE
  ↓
MEASURE
  ↓
FORECAST
  ↓
OPTIMIZE
  ↓
DECIDE
  ↓
ACT
  ↓
LEARN
  └──────────────────→ PLAN
```

The retailer starts with imperfect information and makes decisions. The market responds. The retailer observes what happened. The data changes. The forecast changes. The inventory position changes. And so does the next decision. The value of a planning system is not only the plan it produces. It is the system's ability to **learn when the plan is wrong and respond appropriately**.That is exactly why the handoff between the two clocks matters so much.

---



# Three Layers of the Retail System

At this point, it helps to separate the system into three layers.

### 1. The Physical Layer

This is what physically exists:

**Supplier → DC → Store → Customer**

and the inventory moving through that network.

### 2. The Decision Layer

This is what the retailer controls:

**MFP → Assortment → Buy → Allocation → Replenishment → Transfer → Markdown**

### 3. The Intelligence Layer

This is what helps the retailer decide:

**Data → Metrics → Forecasting → Optimization → Recommendation → Automation**

The physical layer is what the retailer operates.

The decision layer is what the retailer controls.

The intelligence layer is what helps the retailer decide better.

This distinction is useful because many "AI problems" are actually problems in one of the other two layers.

---



## Where Data Science Fits

This is the most important conclusion for a data scientist entering retail. The job is not:

> *Build a model.*

A retail data-science problem is better represented as a chain:

```text
BUSINESS QUESTION
       ↓
DECISION
       ↓
STAKEHOLDER
       ↓
DATA
       ↓
METRIC
       ↓
MODEL
       ↓
RECOMMENDATION
       ↓
HUMAN ACTION
       ↓
OUTCOME
       ↓
LEARNING
```

This is why the ten canonical problems in [Part 9](/blog/ds-problems/) were framed as business question → inputs → output → who acts → financial impact, rather than by algorithm.

Demand forecasting is not:

> *Predict next week's sales.*

It is:

> *How much should we expect to sell, so that someone can make a better buying, allocation or replenishment decision?*

Markdown optimization is not:

> *Estimate price elasticity.*

It is:

> *Which products, when, and by how much?*

Replenishment is not:

> *Predict the reorder quantity.*

It is:

> *Which inventory should move, where and when, while balancing availability against cost?*

The framing changes the work. The model becomes one component inside a decision system. And the recurring theme of the whole series — **the model gets used** — becomes the design goal rather than a hope.

---



## From Predictive Models to Decision Intelligence

This is also where AI gets interesting, because three different ideas are usually collapsed into one word ([Part 18](/blog/agentic-ai/)).


|                   | Question                         | Examples                                                                           |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------------------- |
| **Predictive AI** | What is likely to happen?        | Forecast demand, predict stockouts, estimate lost sales                            |
| **Generative AI** | What should we consider?         | Explain forecasts, summarize exceptions, help investigate an underperforming store |
| **Agentic AI**    | What can the system actually do? | Raise a replenishment order, execute a transfer, trigger an exception workflow     |


The critical distinction is not model sophistication.

It is:

> **What is the system allowed to change without asking?**

That is the line where a prediction becomes an operational system.

### Autonomy Has a Prerequisite

Automation does not remove the need for good data. It increases it. Imagine a replenishment agent running unattended, and the inventory record says ten units while the shelf holds none. The agent sees no reason to reorder. The system becomes confidently wrong — and quiet about it, because the order that should have fired never became an exception. Repeat that across thousands of SKU-location pairs and a small data error can become a material business problem.

That is why the stack has an order:

```text
DATA QUALITY
     ↓
METRIC DEFINITIONS
     ↓
OBSERVABILITY
     ↓
FORECAST
     ↓
DECISION LOGIC
     ↓
AUTOMATION
```

An autonomous system can only be as trustworthy as the state it observes.

---



## The Complete Retail Decision System

Put it all together and the map looks like this:

```text
                         CUSTOMER DEMAND
                                │
                                ▼
                         DEMAND FORECAST
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
               MFP                          ASSORTMENT
                │                               │
                └───────────────┬───────────────┘
                                ▼
                               BUY
                                │
                                ▼
                         INITIAL ALLOCATION
                                │
                                ▼
                       ┌───────────────────┐
                       │     INVENTORY     │
                       └───────────────────┘
                          │       │       │
                          ▼       ▼       ▼
                      SALES  REPLENISH  TRANSFER
                          │       │       │
                          └───────┼───────┘
                                  ▼
                         CUSTOMER OUTCOME
                                  │
                                  ▼
                               METRICS
                                  │
                                  ▼
                             REFORECAST
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                     MARKDOWN          OPTIMIZE
                         │                 │
                         └────────┬────────┘
                                  ▼
                               DECISION
                                  │
                                  ▼
                                ACTION
                                  │
                                  └──────────→ LEARN
```

Underneath the whole thing sits the infrastructure layer:

> **Data → Metrics → Forecasting → Optimization → Decisioning → Execution**

Every article in this series is a deep dive into one part of this map.



---



## The Mental Model to Keep

If you remember one thing from the entire series, make it this:

> **Retail is not a collection of reports, forecasts, models or inventory algorithms. It is a network of decisions operating under uncertainty.**

The decisions are connected.

Assortment affects demand.

Demand affects inventory.

Inventory affects availability.

Availability affects sales.

Sales feed the forecast.

The forecast drives replenishment.

Replenishment changes inventory.

Imbalance creates transfers.

Slow sales create markdowns.

Markdowns change observed demand.

Financial targets constrain all of it.

Supply-chain constraints decide what is physically possible.

Every decision creates the data for the next one.

Which changes how a data scientist should approach retail.

Don't start with:

> *What model should I build?*

Start with:

> *What decision are we trying to improve?*

Then:

Who makes it?

With what information?

What information is missing?

What metric represents the problem?

What does the data fail to observe?

What happens when the decision is wrong?

What action can the business actually take?

How quickly can that action happen?

And how will we know it worked?

Only after those questions are answered is it time to ask what model, optimization method or agent belongs there.

That is the difference between building a model and building a decision system.

---



## Where Each Piece Lives

Season 1 built the mental models.

1. **[Why Retail Is Hard](/blog/why-retail-is-hard/)** — the bet on the future, and why models alone don't fix it
2. **[The Stakeholders](/blog/stakeholders/)** — who makes which decision, and how to speak their language
3. **[Sell-Through Rate](/blog/sell-through-rate/)** — the heartbeat metric
4. **[Brokenness](/blog/brokenness/)** — why inventory is not availability
5. **[Grocery vs. Fashion](/blog/grocery-vs-fashion/)** — two rhythms, two failure modes
6. **[Markdown Optimization](/blog/markdown-optimization/)** — diagnose before discounting
7. **[Demand Forecasting](/blog/demand-forecasting/)** — censored demand, new products, promotions
8. **[Inventory Optimization](/blog/inventory-optimization/)** — the economics of safety stock and service levels
9. **[The 10 DS Problems](/blog/ds-problems/)** — framed by decision, with the money attached
10. **[The Canonical Metric Layer](/blog/metric-layer/)** — the infrastructure everything else stands on

Season 2 went inside the planning machine.

1. **[Merchandise Financial Planning](/blog/merchandise-financial-planning/)** — the budget decided before anyone buys
2. **[Assortment](/blog/assortment-planning/)** — what to sell where
3. **[The Two Clocks](/blog/pre-vs-in-season/)** — pre-season vs. in-season, and the handoff
4. **[Initial Allocation](/blog/initial-allocation/)** — the first irreversible bet
5. **[Store Replenishment](/blog/store-replenishment/)** — the continuous engine, and phantom inventory
6. **[Store Transfers](/blog/store-transfers/)** — the arbitrage in your network
7. **[DC Replenishment](/blog/dc-replenishment/)** — multi-echelon optimization and the bullwhip
8. **[The Autonomous Planner](/blog/agentic-ai/)** — what agentic AI actually changes

The topics differ. The underlying problem never does. It is always some version of:

> **What should we do with uncertain demand, finite inventory, limited time and a network of locations?**

Data science sits in the middle of that — not as an isolated modeling function, but as one stage of a loop that runs:

**observe → understand → predict → decide → act → measure → learn**

The further retail technology evolves, the more of that loop software will execute on its own. The system underneath doesn't change. The retailer still has to decide what to sell, how much to buy, where to put it, when to move it, when to replenish it, when to discount it — and, above all, how to make better decisions before the cost of being wrong gets too large.

That is the Retail Data Playbook. And that is retail, from demand to decision.

---

*"The Retail Data Playbook" is a series for data scientists, analysts, engineers and practitioners building products for retail and e-commerce businesses.*

*All company names and data in this series are fictional and used for illustrative purposes.*