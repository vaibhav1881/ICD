"""Diagnose Neo4j graph data."""
from neo4j import GraphDatabase

d = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
s = d.session()

# Count articles
r1 = s.run("MATCH (a:Article) RETURN count(a) AS cnt").single()
print(f"Articles in Neo4j: {r1['cnt']}")

# Count concepts
r2 = s.run("MATCH (c:Concept) RETURN count(c) AS cnt").single()
print(f"Concepts in Neo4j: {r2['cnt']}")

# Count relationships
r3 = s.run("MATCH (c:Concept)-[r:APPEARS_IN]->(a:Article) RETURN count(r) AS cnt").single()
print(f"APPEARS_IN relationships: {r3['cnt']}")

# Orphan concepts (not linked to any article)
r4 = s.run("MATCH (c:Concept) WHERE NOT (c)-[:APPEARS_IN]->(:Article) RETURN count(c) AS cnt").single()
print(f"Orphan concepts (no article link): {r4['cnt']}")

# List all articles
print("\n--- All Articles ---")
articles = s.run("MATCH (a:Article) RETURN a.title AS title, a.url AS url").data()
for i, a in enumerate(articles, 1):
    title = a["title"][:70] if a["title"] else "No title"
    print(f"  {i}. {title}")

# List orphan concepts
orphans = s.run("MATCH (c:Concept) WHERE NOT (c)-[:APPEARS_IN]->(:Article) RETURN c.name AS name LIMIT 20").data()
if orphans:
    print(f"\n--- Orphan Concepts (first 20) ---")
    for o in orphans:
        print(f"  - {o['name']}")

s.close()
d.close()
