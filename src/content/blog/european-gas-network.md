---
title: "Exploring the European Natural Gas Network as a Knowledge Graph"
date: 2022-04-26
description: "Using Neo4j to turn the European gas pipeline network into a knowledge graph, then exploring it with Graph Data Science algorithms and a NeoDash dashboard."
tags: [knowledge-graphs, neo4j]
draft: false
link: https://medium.com/@a.emrevarol/european-natural-gas-network-via-knowledge-graph-3c3decb5f2ec
link_text: Read on Medium
---
# Exploring the European Natural Gas Network as a Knowledge Graph

In this post, we'll use Neo4j to turn the European gas network into a knowledge graph and analyze the data.

---

The crisis between Ukraine and Russia caused relations between Russia and the EU to fall to their lowest point since the Cold War. The US and EU imposed sanctions on Russia over the invasion — financial measures designed to damage Russia's economy and penalize President Putin, his high-ranking officials, and those who have benefited from his regime.

Europe relies on Russia to keep warm, and Russia needs revenue from the gas trade — so despite the conflict, both still need each other. Germany's foreign minister recently announced that Germany would stop all Russian oil imports by the end of 2022.

The main focus of this post is turning the European gas network into a knowledge graph via Neo4j, then exploring and visualizing it. If you're a developer unfamiliar with Neo4j, [start here](https://neo4j.com/developer/get-started/) to get acclimated — in short, Neo4j is one of the industry-standard graph databases, with products including Neo4j Desktop, AuraDB, AuraDS, Bloom, and Graph Data Science.

Russian natural gas arrives in Europe via pipelines and makes up about a third of all gas used, so it plays a significant role in the energy mix of European nations.

In this article, we'll cover:

- Definitions of components and element structure
- Creation of the knowledge graph
- Exploratory data analysis and some queries
- Visualization via NeoDash

## Definitions of Components and Element Structure

The dataset used to build this knowledge graph comes from [this link](https://zenodo.org/record/5079748) (I've also mirrored the related data files on my own GitHub for convenience). To understand the fields in the dataset, I'm drawing on the [SciGRID_gas: The Raw EMAP Data Set](https://elib.dlr.de/139217/1/scigrid_gas_EMAP.pdf) report published by the DLR Institute for Networked Energy Systems, summarized here in general terms so you don't have to read the full report.

Gas transmission networks consist of components such as pipelines, compressors, and LNG terminals. Briefly, with the main report as reference:

**Nodes** — gas flows from one point to another, given as coordinates. Elements of every other component (compressor stations, power plants, and so on) have an associated node, which geo-references that element. "Nodes" is the term used throughout this post, matching graph-theory terminology.

**PipeLines** — allow gas to transmit from one node to another, georeferenced by an ordered list of nodes.

**PipeSegments** — almost identical to PipeLines, but restricted to connecting exactly two nodes. Any PipeLines element with three or more nodes can be split into multiple PipeSegments.

**Compressors** — compressor stations that increase gas pressure to keep it flowing from node to node. A station contains several compressor units (turbines).

**LNGs** — Liquefied Natural Gas. Europe has several LNG terminals and storage sites, since some gas arrives by ship rather than pipeline.

**Storages** — surplus gas stored underground (old gas fields, salt caverns) and drawn on during low-supply or high-demand periods.

**Consumers** — gas users: households, industry, and commercial use. This excludes power plants, which are tracked separately.

**PowerPlants** — gas used by power plants specifically.

**Productions** — wells where gas is pumped out of the ground. Most gas used in Europe is imported, but a number of smaller production sites are scattered across the continent.

**BorderPoints** — facilities at country borders, mainly used to meter gas flow from one country into another.

### Element structure

Every element — whether a compressor or an LNG terminal — shares the same underlying structure:

- **id** — a unique string identifying the element.
- **name** — the facility's name (e.g. "Compressor Radeland"); often not supplied.
- **source_id** — a list of the element's data sources, since several elements from different sources may have been merged into one.
- **node_id** — the id of the geo-referenced node the element is associated with. For a compressor this is a single id; for a pipeline it's a list of at least two — the start and end node ids.
- **lat** / **long** — latitude and longitude (a list of values for PipeLines and PipeSegments), using the WGS 84 projection (EPSG:4326) throughout the SciGRID_gas project.
- **country_code** — the two-digit ISO Alpha-2 country code of the associated node (or list of nodes, for PipeLines/PipeSegments).
- **comment** — an arbitrary comment on the element; often not supplied.
- **tags** — a dictionary reserved for OpenStreetMap data, holding that item's OpenStreetMap key-value pairs.

## Creating the Gas Network Knowledge Graph

Before running this section, create a [Neo4j Sandbox](https://neo4j.com/sandbox/) to run the queries in the browser, or work through the [companion notebook](https://github.com/iamvarol/blogposts/blob/main/medium/europe_gas_network/european_gas_pipeline.ipynb). First define the constraints, then create the components — all of them, whether or not they participate in a pipeline, since all are used for visualization later. The notebook has code for every component; here, border points serve as the example of a component that isn't part of a pipeline.

Nodes are created next, as the junction points of the pipelines, and then connected to form the pipelines themselves.

## Exploratory Data Analysis and Graph Data Science

A natural first EDA question: how many nodes does the KG consist of, and what are their types? Then the same question for relationships — in this dataset there's really only one relationship type among the nodes, so this step is more about the code pattern than the insight. Neo4j's `apoc.meta.stats()` procedure gives the same picture in one call — node and relationship counts and types together.

### Neo4j Graph Data Science (GDS)

Neo4j released GDS 2.0 on March 24, 2022, and this analysis leans on it for several graph algorithms — PageRank, degree centrality, and more. The first step is creating a GDS graph projection, and plugging each algorithm's queries into that projection.

Before getting into the algorithms themselves, it's worth knowing the four execution modes every GDS algorithm supports once you have a named graph projection:

- `stream` — returns the algorithm's results as a stream of records, without altering the database.
- `write` — writes the results to the Neo4j database and returns a single record of summary statistics.
- `mutate` — writes the results to the projected graph (not the database) and returns summary statistics.
- `stats` — returns summary statistics only, writing to neither the database nor the projected graph.

There's also an `estimate` mode, for forecasting how much memory a given algorithm will use.

A note on `mutate`: when it's time for feature engineering, you'll often want to fold quantities calculated by GDS into your graph projection — that's what `mutate` is for. It doesn't touch the database; it writes results onto each node in the projected graph so later calculations can build on them. This matters most with more complex algorithms or multi-step pipelines; see the [GDS API docs](https://neo4j.com/docs/graph-data-science/current/common-usage/running-algos/?ref=gds-sandbox#running-algos-mutate) for more.

### PageRank

There are many ways to measure centrality, but one of the most popular is PageRank. The **PageRank (PR)** algorithm ranks nodes by their incoming relationships — originally designed to rank web pages, on the assumption that a page is only as important as the pages linking to it.

Running PR over the gas pipeline graph surfaces node `5305` as the most critical junction. Worth noting: this "id" is Neo4j's internal id, assigned automatically at creation time — not the `id` field we set ourselves. To translate that back into something meaningful, rerun PR with `write` mode to persist each node's PageRank score as a property, then query nodes ordered by that property directly — which also lets you show, for example, the top 10 junctions by PageRank alongside their maximum annual gas volume.

### Degree Centrality

Degree Centrality counts a node's incoming and outgoing relationships to surface popular nodes in a graph — the same technique used to [identify influential Twitter users](https://www.brandwatch.com/blog/react-influential-men-and-women-2017/) or [separate fraudsters from legitimate users in online auctions](https://link.springer.com/chapter/10.1007/978-3-319-23461-8_11). The key parameter is **orientation**, with three options:

- `UNDIRECTED` — scores both incoming and outgoing relationships.
- `REVERSE` — scores only incoming relationships.
- `NATURAL` — scores only outgoing relationships.

This analysis uses `UNDIRECTED` to count all relationships regardless of direction. (Detecting Twitter influencers, by contrast, would call for `REVERSE` — scoring by followers.)

### Betweenness Centrality

Betweenness Centrality measures centrality via shortest paths: in a connected graph, there's at least one shortest path between every pair of nodes, and a node's betweenness score is the count of those shortest paths passing through it. In practice, it's the standard way to find "bridge" nodes connecting one part of a graph to another, with applications across social networks, biology, transportation, and telecommunications — a transportation node with high betweenness effectively controls more of the network's flow, which is exactly the kind of signal decision-makers use to identify hubs.

### Cluster Detection via Louvain Modularity

Louvain modularity finds communities — or in this case, "rings" — within large networks. It's one of the fastest modularity-based algorithms and scales well; modularity measures how well a graph has been partitioned into clusters, and Louvain works by recursively merging communities into single nodes and re-running the clustering.

Applied to the pipeline graph, the largest resulting cluster of junction points is Russia — the natural gas provider — together with the countries closest to it: Estonia, Belarus, and Ukraine. Junction points in these countries play an outsized role in distributing natural gas to the rest of Europe. (Country codes referenced: EE Estonia, BY Belarus, UA Ukraine, RU Russia, NL Netherlands, BE Belgium, XX no country/under sea, DE Germany, AT Austria, CH Switzerland.)

### Pathfinding

As with the other algorithm categories here, there are several pathfinding options, predominantly aimed at finding the shortest path between two or more nodes — in this graph, which junction points minimize total distance between two points on the network.

[Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm) is the most common shortest-path algorithm; A* and Yen's algorithm are the other options in Neo4j's GDS arsenal. Unlike the earlier examples, this needs a *weighted* graph projection, since Dijkstra's algorithm operates over positive relationship weights such as distance — it repeatedly extends outward via the lowest-weighted relationship from the source until it reaches the target.

As an example run: source node `INET_N_856`, target node `NutsCons_1003`, weighted by `length_km`. The algorithm returns the total distance and the full list of junction points along the route — in this case, an 18-hop shortest path.

## Visualization via NeoDash

[NeoDash](https://neo4j.com/labs/neodash/) is a graph app for building dashboards from Neo4j data in minutes — multi-page visualizations with maps, tables, bar charts, pie charts, graph views, line charts, and dynamic parameters that drive other visualizations on the same dashboard. Once built, a dashboard saves back into the graph database as a node, ready to reopen later.

The [companion notebook](https://github.com/iamvarol/blogposts/blob/main/medium/europe_gas_network/european_gas_pipeline.ipynb) has the full code for everything above — fork it, adapt it to your own network or dataset, and pull requests are always welcome.

Thanks for reading — you can find me on [LinkedIn](https://www.linkedin.com/in/ali-emre-varol-012989193/), [GitHub](https://github.com/iamvarol), and [Twitter](https://twitter.com/iamvarol).
