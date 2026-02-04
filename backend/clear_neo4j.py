"""
Clear Neo4j database completely
"""
from neo4j import GraphDatabase
import os

NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

with driver.session() as session:
    # Delete all nodes and relationships
    result = session.run("MATCH (n) DETACH DELETE n")
    print("✅ Cleared all nodes and relationships from Neo4j")
    
    # Verify
    count = session.run("MATCH (n) RETURN count(n) as count").single()["count"]
    print(f"✅ Remaining nodes: {count}")

driver.close()
print("✅ Neo4j database is now empty!")
