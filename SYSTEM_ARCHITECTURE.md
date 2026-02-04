# 🧠 System Architecture & Algorithms

This document explains the technical logic behind the **Idea Collision Generator**, detailing every step from capturing an article to generating a new idea.

---

## 1. 📥 Article Capture (The "Ingestion" Layer)

**Technology:** Chrome Extension (JavaScript), Readability Logic

*   **How it works:**
    1.  When you click the extension icon, a script runs on the active tab.
    2.  It uses a **Readability algorithm** to parse the HTML. This algorithm scores paragraphs based on text density, limiting the noise (ads, sidebars, footers) and isolating the **Main Content**.
    3.  It extracts the `Title`, `URL`, and `Body Text`.
    4.  **Transmission:** This data is bundled into a JSON object and sent via an HTTP `POST` request to your backend: `http://localhost:8000/ingest/article`.

---

## 2. 🧹 NLP & Concept Extraction (The "Brain")

**Technology:** Python, spaCy (`en_core_web_sm`), Regular Expressions (Regex)
**File:** `backend/app/services/nlp.py`

*   **The Problem:** Raw text is too unstructured. We need specific "nodes" of knowledge.
*   **The Logic:**
    1.  **Tokenization**: The text is broken down into sentences and words.
    2.  **Entity Recognition (NER)**: spaCy identifies named entities.
        *   *Critical Logic:* We accept `ORG` (Organizations), `PRODUCT`, `event`, etc.
        *   *Filtering:* We **strictly exclude** `PERSON` entities (to prevent authors like "McAfee" from becoming concepts) and `DATE`/`TIME` entities.
    3.  **Noun Chunking**: The algorithm looks for "phrases" rather than just words (e.g., "Artificial Intelligence" instead of just "Artificial").
    4.  **Aggressive Filtering (The "Clean-Up"):**
        *   **Blacklist**: Removes academic noise ("et al", "vol", "pp", "doi").
        *   **Regex Checks**: Removes citations like `[12]` or `(2023)`.
        *   **Technical Validation**: A predefined list of keywords (`algorithm`, `theory`, `system`, `network`...) is used to prioritize technical/scientific terms over general language.

---

## 3. 🕸️ Knowledge Graph Creation (The "Memory")

**Technology:** Neo4j (Graph Database), Cypher Query Language
**Create Scripts:** `backend/app/services/graph.py`

*   **Why a Graph?**
    *   Relational databases (SQL) store rows. Graph databases store **relationships**. Relationships are first-class citizens here.
*   **The Structure:**
    *   **Nodes (Circles):**
        *   `(:Article {title: "..."})`
        *   `(:Concept {name: "..."})`
    *   **Edges (Lines):**
        *   `[:MENTIONS]` -> Connects an Article to the Concepts it contains.
*   **The Process:**
    1.  When an article is ingested, a node is created for it.
    2.  For every filtered concept output by the NLP engine, a `(:Concept)` node is created (MERGE operation ensuring no duplicates).
    3.  A relationship is drawn: `(Article)-[:MENTIONS]->(Concept)`.
    *   *Result:* If two different articles mention "Quantum Computing", that Concept node becomes a bridge connecting those two articles.

---

## 4. ⚡ Idea Collision (The "Spark")

**Technology:** Google Gemini API (`gemini-1.5-flash`), Python
**File:** `backend/app/services/llm.py`

*   **The Concept:** bisociation—connecting two unrelated frames of reference.
*   **The Algorithm:**
    1.  **Selection**: The user (or randomizer) selects two Concepts, usually from different domains (e.g., "Mycelial Networks" and "Blockchain").
    2.  **Prompt Engineering**: We construct a prompt for the AI:
        > "Find a surprising connection, insight, or application that combines [Concept A] and [Concept B]..."
    3.  **LLM Inference**:
        *   The AI uses its vast pre-trained knowledge to hallucinate a valid semantic bridge. It doesn't look up a database; it "reasons" how the properties of A could apply to B.
    4.  **Structured Output**: The AI is forced to return valid JSON containing specific fields: `Insight`, `Real-World Application`, and `Domain Intersection`.

---

## 5. 💾 Data Persistence (The "Record")

**Technology:** PostgreSQL
*   While the *relationships* live in Neo4j, the **permanent records** (full article text, collision history, timestamps) live in PostgreSQL.
*   This ensures that even if we wipe the graph to restructure it, we still have the raw data to rebuild it.

---

## Summary of Data Flow

1.  **User** visits Wikipedia → **Extension** scrapes text.
2.  **Backend** receives text → **NLP** extracts "Smart City" and "Cryptography".
3.  **Neo4j** stores: `(WikiPage)-[:MENTIONS]->(Smart City)` and `(WikiPage)-[:MENTIONS]->(Cryptography)`.
4.  **User** requests collision.
5.  **GenAI** processes "Smart City" + "Cryptography" → Returns "Quantum-Secured Urban Grids".
