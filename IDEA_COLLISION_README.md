# Idea Collision Generator — Complete Project Guide

## Overview
Idea Collision Generator is a personal knowledge‑intelligence engine that observes user reading behavior, extracts concepts using NLP, builds a personalized knowledge graph, and generates cross‑domain insights (“collisions”) using GPT‑4. It acts as a creative partner that discovers patterns, relationships, and innovative ideas a user would normally miss.

This README acts as a **Copilot Instruction File** so any AI code assistant understands the entire system architecture, workflows, tech stack, and expectations when generating code.

---

## Core Concept
The system automatically:
1. Tracks articles the user reads through a browser extension.
2. Extracts key concepts using an NLP pipeline.
3. Builds a dynamic knowledge graph in Neo4j.
4. Detects distant concepts suitable for collisions.
5. Uses GPT‑4 to generate creative insights, applications, and structured output.
6. Presents everything in a modern dashboard built with Next.js.

---

## System Architecture

### High‑Level Flow
1. **Browser Extension**
   - Monitors visited pages.
   - Scrapes title, URL, and main content.
   - Sends data to FastAPI backend.

2. **Backend System (FastAPI)**
   - Processes article content.
   - Runs NLP pipeline:
     - Text cleaning
     - Tokenization
     - NER
     - TF‑IDF keywords
     - Noun phrases
     - Domain classification
     - Embeddings with sentence transformers
   - Stores concepts and metadata into PostgreSQL.
   - Updates Neo4j knowledge graph.
   - Sends tasks to Celery for async processing.

3. **Knowledge Graph (Neo4j)**
   - Stores:
     - Concept nodes
     - Domain nodes
     - Article nodes
     - User activity relations
   - Computes:
     - Semantic distances
     - Co‑occurrence
     - Graph centrality
     - Concept clusters

4. **Collision Engine (GPT‑4)**
   - Finds distant concept pairs.
   - Generates insights using a structured JSON prompt.
   - Stores collisions in PostgreSQL and links in graph DB.

5. **Frontend App (Next.js)**
   - Dashboard (stats, activity, collisions)
   - Interactive knowledge graph (D3.js / Three.js)
   - Collision explorer page
   - Insights & analytics
   - User settings & privacy options

---

## Detailed Workflows

### 1. **Article Capture Workflow**
- Browser extension identifies article‑like pages.
- Extracts readable content (DOM parsing).
- Sends JSON payload `{ title, url, text, timestamp }`.
- FastAPI endpoint `/ingest/article` receives data.
- Creates `article` record in PostgreSQL.
- Pushes NLP job to Celery.

---

### 2. **NLP Concept Extraction Workflow**
Celery worker performs:
1. Clean text  
2. Tokenize (spaCy)  
3. POS tagging & NER  
4. TF‑IDF keywords  
5. Noun phrase extraction  
6. Domain classification  
7. Embeddings generation  
8. Store concepts in PostgreSQL  
9. Update Neo4j graph  

---

### 3. **Knowledge Graph Update Workflow**
Neo4j maintains:

- Node types:
  - `Concept`
  - `Domain`
  - `Article`
  - `User`
- Relation types:
  - `EXPLORED`
  - `APPEARS_IN`
  - `RELATED_TO`

Algorithms:
- Cosine similarity  
- Jaccard similarity  
- Shortest-path  
- Clustering  
- PageRank  

---

### 4. **Collision Generation Workflow**
1. Query Neo4j for distant concept pairs  
2. Select top pairs  
3. Generate structured prompt for GPT‑4  
4. Parse JSON response  
5. Store in PostgreSQL  
6. Update graph relationships  

---

### 5. **Frontend Workflow**
- Dashboard  
- Graph visualization  
- Collisions list  
- Collision detail view  
- Analytics  
- Settings  
- Export tools  

---

## Tech Stack Summary

### **Frontend**
- Next.js 14  
- React 18  
- TypeScript  
- Tailwind CSS  
- Zustand  
- Chart.js  
- D3.js  
- Three.js  
- Framer Motion  

### **Backend**
- FastAPI (Python)  
- Uvicorn  
- spaCy, NLTK  
- Transformers  
- Sentence Transformers  
- LangChain  
- Celery  
- Redis  

### **Databases**
- PostgreSQL  
- Neo4j  
- Redis  
- S3 / MinIO  

### **Browser Extension**
- Chrome Manifest V3  
- JavaScript  

---

## API Overview

### `/ingest/article`
Receives article content.

### `/concepts/extract`
Runs NLP extraction.

### `/collisions/generate`
Triggers GPT‑4 collision creation.

### `/graph/update`
Updates Neo4j graph.

### `/dashboard/stats`
Returns analytics for UI.

---

## MVP Version
1. Browser extension  
2. NLP extraction  
3. Store concepts  
4. Generate collision using GPT‑4  
5. Display collisions  

---

## Future Enhancements
- Multi‑concept collisions  
- AI chat assistant  
- Predictive insights  
- Trend forecasting  
- Local‑only mode  

---

## Instructions for AI Code Assistants
When generating code:
- Follow this architecture  
- Respect the tech stack  
- Keep everything modular  
- Use FastAPI + Next.js  
- Integrate Neo4j  
- Maintain privacy model  

This README is the **single source of truth** for the project.

