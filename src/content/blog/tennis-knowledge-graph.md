---
title: "Analyzing Roland Garros and US Open Tennis Tournaments via Neo4j"
date: 2022-05-16
description: "Neo4j: simple, joyful traversals. Modeling two decades of Grand Slam tennis as a graph to find champions, streaks, and title runs that would be painful to query in SQL."
tags: [knowledge-graphs, neo4j]
draft: false
link: https://medium.com/@a.emrevarol/analyzing-roland-garros-and-us-open-tennis-tournaments-via-neo4j-9be55e3044a4
link_text: Read on Medium
---
![A tennis ball on a clay court](../../assets/blog/tennis-knowledge-graph-hero.jpg)

*Photo by [Kevin Mueller](https://unsplash.com/@kevinmueller) on [Unsplash](https://unsplash.com/).*

*Neo4j: simple, joyful traversals.*

---

Tennis is one of my favorite sports to watch, Grand Slams especially — and this post is partly an excuse to combine that with showing off what Neo4j is good at: analyzing sports competitions and tournaments as graphs.

## Outline

- Introduction and motivation
- Dataset
- The graph
- Analysis — finals, champions and runners-up, year-over-year turnarounds, repeat champions, winning and runner-up streaks, sweepers, and route-to-trophy
- Conclusion

## Introduction and Motivation

The ATP and WTA each run four majors a year — the **Grand Slams**: the Australian Open (January), Roland Garros / French Open (May–June), Wimbledon (June–July), and the US Open (August–September). A Grand Slam runs two weeks, and play generally sharpens in the second week, once the field narrows to the fourth round, quarterfinals, semifinals, and final.

This post covers **Roland Garros** and the **US Open** between **2000 and 2021**. I'd have liked to cover all four majors, but stuck to two given the constraints of the [free AuraDB](https://neo4j.com/cloud/platform/aura-graph-database/) tier.

A quick primer on scoring, since some of the terminology below assumes it: a game is won by reaching four points with at least a two-point lead — love (0), 15, 30, 40, then game. Tied at 40–40 ("deuce"), play continues until one side wins two points in a row (advantage, then game); losing the very next point after taking advantage resets to deuce. A set goes to whoever wins six games with a two-game margin — 6–0, 6–1, and 6–4 are valid set scores, 6–5 is not — and a set tied at 5–5 needs two more consecutive game wins, landing on 7–5 or, after a tiebreak, 7–6.

In Grand Slam singles, winning the title means winning seven rounds: men play best-of-five sets per match, women best-of-three. The draw starts at 128 players (R128), halving each round — R64, R32, R16 — down to the quarterfinals (QF), semifinals (SF), and final (F).

## Dataset

The underlying data is Jeff Sackmann's excellent [tennis_wta](https://github.com/JeffSackmann/tennis_wta) and [tennis_atp](https://github.com/JeffSackmann/tennis_atp) repositories — CSVs covering every WTA match back to 1920 and every ATP match back to 1968, kept continuously up to date. I merged and filtered the 2000–2021 slice with Pandas and mirrored it in [my own repository](https://github.com/iamvarol/blogposts/tree/main/medium/tennis) for convenience.

## The Graph

If Neo4j is new to you, [this is a good place to start](https://neo4j.com/developer/get-started/) — it's one of the industry-standard graph databases, with Desktop, AuraDB, AuraDS, Bloom, and Graph Data Science all built around the same core.

The data model is fairly direct: a player wins or loses a match, matches sit within a tournament ordered by round (R128 through F), and tournaments themselves are chained by year. Concretely, the node labels are **Player** (id, name, gender, hand, ioc), **Match** (id, year, round, score), **Set** (id, score, number), and **Tournament** (id, name, year, type); the relationships are `MATCH_WINNER`, `MATCH_LOSER`, `IN_TOURNAMENT`, `IN_MATCH`, `NEXT_TOURNAMENT`, and `NEXT_MATCH`.

Before loading data, unique node-property constraints on `id` for `Player`, `Match`, `Set`, and `Tournament` prevent duplicate nodes during graph creation — and as a side effect, Neo4j also builds an index on each constrained label/property, which speeds up the load itself.

The real design question in a graph like this is making sure the data model is easy to *traverse*, not just store: a tournament has matches across rounds, each match has sets, a player wins a match by winning enough sets, and a player who keeps winning through every round becomes tournament champion. Loading the CSVs and building the nodes leans on the `apoc.periodic.iterate` procedure from [APOC](https://neo4j.com/labs/apoc/) (Awesome Procedures On Cypher) — well suited to processing a large CSV in batched transactions. `NEXT_TOURNAMENT` relationships chain each tournament to the next year's edition (built separately for Roland Garros and the US Open), and `NEXT_MATCH` relationships chain matches within a tournament by round — together, these two relationship types are what make the year-over-year and round-over-round questions below cheap to ask.

The resulting graph has more than 45K nodes and 75K relationships. None of the analysis queries below take more than a couple of seconds to run — impressive for the free AuraDB tier.

## Analysis

By player count, the US, France, and Spain are the top three countries represented across both tournaments in this period.

### Finals of the Tournaments

Filtering matches to `{round: "F"}` traverses directly to every final played.

### Champions and Runners-Up

Pivoting that table by year and gender surfaces the champions: Rafael Nadal (13 titles) and Roger Federer (5) top the men's board at Roland Garros and the US Open respectively; Justine Henin (4) and Serena Williams (5) top the women's board at the same two events.

Looking at runners-up: Novak Djokovic and Roger Federer each finished runner-up at Roland Garros four times; Kim Clijsters, Dinara Safina, and Simona Halep each did so twice in the women's draw. At the US Open, Novak Djokovic (6) and Serena Williams (4) lead the runner-up count.

Combining both tournaments, Rafael Nadal leads men's singles titles outright, with Novak Djokovic the leading runner-up. Serena Williams dominates the women's side on both counts — champion and runner-up — largely on the strength of her US Open record.

### Runner-Up One Year, Champion the Next

Filtering for players who lost the final one year and won the title the next: Novak Djokovic did it three times in men's singles, Serena Williams twice in women's singles.

### Early Exit One Year, Champion the Next

A more dramatic turnaround: players who didn't reach the quarterfinal one year but were champions the next. Several went out in the very first round (R128) the year before their title: Dominic Thiem, Jelena Ostapenko, Stan Wawrinka, Serena Williams, Francesca Schiavone, Justine Henin, Albert Costa, and Jennifer Capriati.

### Multiple-Time Champions

A simple query over the champions list surfaces every player who's won a given tournament at least twice.

### Winning Streaks

Applying a streak function to the champions-by-year data surfaces consecutive title runs at Roland Garros and the US Open across 2000–2021.

### Runners-Up At Least Twice, and Runner-Up Streaks

The same pattern applied to runners-up: which players finished runner-up at least twice, and who did it in consecutive years. Roger Federer was runner-up three years running — 2006, 2007, and 2008.

### Sweepers in the Finals

Looking at set scores rather than just match results: which champions won the entire tournament without dropping a single set. The women's champions turn out to sweep noticeably more often than the men's.

### Route to Trophy

Finally, the `NEXT_MATCH` and `NEXT_TOURNAMENT` relationships that made every question above cheap to answer can also reconstruct a single player's path through a tournament, round by round, opponent by opponent.

As 2021 Roland Garros champion, Novak Djokovic opened against Tennys Sandgren, then beat Pablo Cuevas, Lorenzo Musetti, Ricardas Berankis, Matteo Berrettini, and Rafael Nadal in turn to reach the final, where he beat Stefanos Tsitsipas for the title.

## Conclusion

If I had to describe Neo4j in three words: **simple, joyful traversals.**

Every analysis above could be done in SQL — SQL is a mature, powerful language — but it would mean stacking join after join to reconstruct these same relationships across players, matches, sets, and tournaments, and each added join makes the query more complex and slower to reason about. Cypher gets to the same answers by just walking the relationships that are already there.

For a good comparison of the two approaches, I'd recommend [this article by Michael Hunger](https://neo4j.com/developer-blog/discover-neo4j-auradb-free-week-24-nytimes-article-knowledge-graph/). And if graph databases applied to real datasets are interesting to you, it's worth reading my other Neo4j posts too.

The full notebook behind this analysis is [here](https://github.com/iamvarol/blogposts/blob/main/medium/tennis/medium_tennis.ipynb) — fork it, adapt it, and pull requests are always welcome.

Thanks for reading — you can find me on [LinkedIn](https://www.linkedin.com/in/ali-emre-varol-012989193/), [GitHub](https://github.com/iamvarol), and [Twitter](https://twitter.com/iamvarol).
