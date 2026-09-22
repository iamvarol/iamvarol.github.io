---
title: "Creating Clinical Knowledge Graph by Spark NLP & Neo4j"
date: 2021-09-21
description: "The first end-to-end clinical knowledge graph creation using Spark NLP and Neo4j."
tags: [knowledge-graphs, neo4j]
draft: false
link: https://medium.com/@a.emrevarol/creating-knowledge-graph-by-spark-nlp-neo4j-9d18706aa08b
link_text: Read on Medium
---
*The first end-to-end clinical knowledge graph creation using Spark NLP and Neo4j.*

---

In this article, we will build a Knowledge Graph (KG) using Spark NLP Relation Extraction (RE) Models and Neo4j. Graph data representation has become pervasive over the last decade since connected relationships based on context are its momentous feature.

We will not focus on "How to create a Spark NLP RE pipeline and its details?". The main point of this article is "How to connect Spark NLP with Neo4j to create a KG?". To achieve our main goal, we will generate KGs by exporting the results of three different Spark NLP RE models to a graph DB with Neo4j.

## 1. Spark NLP — A Short Introduction

Spark NLP is an open-source NLP library under the hood of Apache Spark and Spark ML. It provides a single unified solution for all NLP needs with an easy API to integrate with ML pipelines. [John Snow Labs](http://www.johnsnowlabs.com/) is an [award-winning](https://www.johnsnowlabs.com/press-awards/) data analytics company leading and sponsoring the development of the Spark NLP library.

The library covers many common NLP tasks such as tokenization, stemming, lemmatization, part-of-speech (POS) tagging, and named entity recognition (NER). The full list of annotators, pipelines, and concepts is described in the [online reference](https://nlp.johnsnowlabs.com/docs/en/quickstart), and you can find cards of pre-trained models and pipelines in the [models hub](https://nlp.johnsnowlabs.com/models).

Spark NLP crossed **1 million** downloads per month and **8 million** downloads from the beginning of its journey. You can find details of Spark NLP in [Introduction to Spark NLP: Foundations and Basic Components](https://medium.com/spark-nlp/introduction-to-spark-nlp-foundations-and-basic-components-part-i-c83b7629ed59), check out the [release notes](https://nlp.johnsnowlabs.com/docs/en/release_notes) of each version, or visit the [Spark NLP workshop repository](https://github.com/JohnSnowLabs/spark-nlp-workshop) to try some NLP tasks yourself.

## 2. Neo4j

The big data movement has increased the importance of graph databases. Storing and showing data and its relationships became popular in recent years — social media platforms use graph databases to track relationships and boost their recommendation systems, and relational databases are at least one step behind graph databases once you start talking about real-time, relationship-heavy analytics.

Neo4j is a graph database that provides trusted, advanced tools to developers and data scientists. It's available as a fully managed cloud service or self-hosted. [Neo4j Sandbox](https://neo4j.com/sandbox/), [Desktop](https://neo4j.com/download/), and [Aura](https://neo4j.com/cloud/aura/) are the options for beginners.

## 3. Relation Extraction Models

Relation extraction is the task of predicting semantic relationships from text. Relationships usually occur between named entities ("NER chunks") of a certain type — Person, Location, Organization, and so on. RE is the core component for building a **relation KG**, and it's essential for NLP applications like sentiment analysis, question answering, and summarization.

Named Entity Recognition (NER) is one of the core NLP tasks — in my opinion, annotating data for NER is the brain and heart of the NLP pipeline that everything else depends on. Recognition of named entities is essentially classification of tokens: NER locates and classifies pre-defined categories such as persons, locations, organizations, hospitals, medical centers, medical codes, measurements, monetary values, and quantities. In a clinical context, that lets you answer real-world questions like:

- Which hospital and department admitted the patient?
- Which clinical tests were applied to the patient?
- What were the test results?
- Which medication or procedure was started?

Clinical RE plays a key role in clinical NLP by extracting information from healthcare reports — detecting temporal relationships between clinical events, drug-drug interactions, and relationships between medical problems and their treatment or medication. We won't go deeper into the importance of RE in medical studies here; it's beyond the scope of this article. You can find detailed information about Spark NLP's NER and RE models at [this link](https://github.com/JohnSnowLabs/spark-nlp-workshop/tree/master/tutorials/Certification_Trainings/Healthcare).

## 4. Spark NLP Relation Extraction KG using Neo4j

This is the first article that shows how to create a KG using Spark NLP and Neo4j. The rest of this post walks through building a basic KG using Spark NLP, Neo4j, and a Colab notebook.

### 4.1. Creating a Neo4j Sandbox

The Neo4j Sandbox is especially appropriate for users who are new to Neo4j — no download or install required. It's a way to get a project up and running quickly, and you can collaborate with teammates if you invite them. A sandbox can be extended for 7 days, for up to 10 days total.

For this post, sign up for [Neo4j Sandbox](https://neo4j.com/sandbox/) and create a blank sandbox. It'll be ready by the time your coffee finishes brewing, at which point you'll have the connection details you need to connect from a Colab notebook.

### 4.2. Creating an RE Pipeline using Spark NLP

We'll use the licensed Spark NLP version for healthcare applications. Before proceeding, get a 30-day free secret key by filling out [this form](https://www.johnsnowlabs.com/spark-nlp-try-free/).

**Colab setup**

Set up a Colab session by uploading your secret key file to use Spark NLP JSL (the licensed version). The `jsl_colab_setup.sh` bash script handles the required installations based on your license key. From there, import the corresponding libraries and start the Spark NLP session — [this notebook](https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/tutorials/Certification_Trainings/Healthcare/10.2.Clinical_RE_Knowledge_Graph_with_Neo4j.ipynb) is prepared using Spark NLP and JSL version 3.2.2.

**Pipeline**

We'll use three RE pipelines to get relation predictions in clinical text: temporal events, clinical relations, and posology. This article walks through the first one; you can explore the others in the notebook.

The pipeline works like this: read the document and parse it into sentences, split each sentence into tokens, find token embeddings, and run POS tagging. Next, find the NERs using the pretrained `ner_events_admission_clinical` model, and merge the NER chunks (concatenating B- and I-tagged NERs). Finally, run the dependency parser and a pretrained relation-extraction model to extract relations between NER chunks. You can find all three RE pipelines (and more) [in this notebook](https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/tutorials/Certification_Trainings/Healthcare/10.Clinical_Relation_Extraction.ipynb).

To get faster inference at runtime, we use a light pipeline — for more on that, see [this article on Spark NLP LightPipeline](https://medium.com/spark-nlp/spark-nlp-101-lightpipeline-a544e93f20f1). The relation between NER chunks (the `chunk1` and `chunk2` columns) ends up in the `relation` column of the resulting Pandas DataFrame, alongside the entity types of the related chunks.

At this point we've signed up for a Neo4j Sandbox, created a blank sandbox, saved a Spark NLP JSL free trial key, set up a Colab session, built an RE pipeline, defined a light pipeline for faster inference, and gotten results. The natural next question: how do you use these results? You could feed them into downstream pipelines, or use them to build a KG and mine it for insights — we've chosen the latter, so we'll build a KG from the RE results using Neo4j.

### 4.3. Neo4j Connection

The Neo4j connection class is provided by the Neo4j dev team. We use it to connect to the blank sandbox using the sandbox's Bolt URL, username, and password, along with two helper functions — one to update data in the sandbox in batch mode, and one to create nodes and relationships between them. (I adapted these helper classes from [this article on creating a graph database in Neo4j with Python](https://towardsdatascience.com/create-a-graph-database-in-neo4j-using-python-4172d40f89c4).) Batch-mode loading matters once you exceed 50K rows, to avoid timeouts.

With the connection in place: create it, delete all existing nodes and relationships, then create constraints on nodes before populating the database. Constraints set up indexing and prevent duplicate nodes. Once constraints are asserted, load the NER chunks and relationships using an `add_ners_rels` helper function.

That function takes the relation DataFrame as a parameter and, inside it, runs:

```cypher
UNWIND $rows as row
```

This takes each row of the DataFrame and uses its column names to create a node or set a property. We create NERs from the `chunk1` and `chunk2` columns, typing them from the `entity1` and `entity2` columns respectively, and create relationships between NER entities using the `relation` column.

### 4.5. KG Queries

Time to query and check the results. Neo4j's graph query language is Cypher — an SQL-inspired language for matching patterns of nodes and relationships. See the [Cypher docs](https://neo4j.com/developer/cypher/) for details and online training.

The first query retrieves all nodes and relationships in the graph and saves them to a Pandas DataFrame:

```cypher
// Query in the notebook (Q1)
MATCH (n1)-[r]-(n2)
RETURN n1.name, n1.type, r.relation, n2.name, n2.type
```

The equivalent query for visualizing the same result directly in the sandbox:

```cypher
// Query in the Sandbox (Q2)
MATCH (n1)-[r]-(n2)
RETURN n1, r, n2
```

You can run either query from Colab or paste the Cypher query straight into the sandbox to see results as a table, text, or a visual graph — the sandbox also lets you export results as PNG, SVG, CSV, or JSON.

Once you run it, it's clear you can derive every relationship tied to a NER chunk — this is the insight layer sitting on top of the underlying data, letting you reason over enriched relationships with confidence for downstream decisions.

As one example, filter for nodes of type `DATE` and retrieve everything they relate to, to see all the date-related information the RE model extracted. The other two RE models — posology, and problem-to-test relations (which surface the treatments applied to cure a problem, and the corresponding test results) — follow the same pattern; see [the notebook](https://github.com/JohnSnowLabs/spark-nlp-workshop/blob/master/tutorials/Certification_Trainings/Healthcare/10.2.Clinical_RE_Knowledge_Graph_with_Neo4j.ipynb) for the full set of queries and results.

## 5. Conclusion

That's all for now. In this article, we covered how to create a KG using an RE model with Spark NLP — hopefully enough to get you started building your own. Stay tuned to Spark NLP, and don't forget to follow [their page](https://twitter.com/JohnSnowLabs).

A few more useful links for beginners:

- [Introduction to Spark NLP: Foundations and Basic Components (Part I)](https://medium.com/spark-nlp/introduction-to-spark-nlp-foundations-and-basic-components-part-i-c83b7629ed59)
- [Introduction to Spark NLP: Installation and Getting Started (Part II)](https://medium.com/spark-nlp/introduction-to-spark-nlp-installation-and-getting-started-part-ii-d009f7a177f3)
- [Spark NLP YouTube Channel](https://www.youtube.com/channel/UCmFOjlpYEhxf_wJUDuz6xxQ/videos)
