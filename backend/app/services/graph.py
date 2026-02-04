from neo4j import GraphDatabase
import os
from typing import List, Dict, Any

URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
AUTH = (os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "password"))

class GraphService:
    def __init__(self):
        self.driver = GraphDatabase.driver(URI, auth=AUTH)

    def close(self):
        self.driver.close()

    def create_article_node(self, article_data: Dict[str, Any]):
        """Creates an Article node in the graph."""
        with self.driver.session() as session:
            session.execute_write(self._create_and_return_article, article_data)

    @staticmethod
    def _create_and_return_article(tx, article_data):
        query = (
            "MERGE (a:Article {url: $url}) "
            "ON CREATE SET a.title = $title, a.timestamp = $timestamp "
            "RETURN a"
        )
        result = tx.run(query, url=article_data["url"], title=article_data["title"], timestamp=str(article_data.get("timestamp", "")))
        return result.single()[0]

    def add_concepts(self, article_url: str, concepts: List[str]):
        """Creates Concept nodes and links them to the Article."""
        with self.driver.session() as session:
            session.execute_write(self._create_concepts_and_relationships, article_url, concepts)

    @staticmethod
    def _create_concepts_and_relationships(tx, article_url, concepts):
        query = (
            "MATCH (a:Article {url: $article_url}) "
            "UNWIND $concepts as concept_name "
            "MERGE (c:Concept {name: concept_name}) "
            "MERGE (c)-[:APPEARS_IN]->(a)"
        )
        tx.run(query, article_url=article_url, concepts=concepts)

    def get_random_concepts(self, limit: int = 5) -> List[str]:
        """Fetches a list of random concepts from the graph."""
        with self.driver.session() as session:
            return session.execute_read(self._get_random_concepts, limit)

    @staticmethod
    def _get_random_concepts(tx, limit):
        query = (
            "MATCH (c:Concept) "
            "WITH c, rand() AS r "
            "ORDER BY r "
            "RETURN c.name AS name "
            "LIMIT $limit"
        )
        result = tx.run(query, limit=limit)
        return [record["name"] for record in result]

    def get_graph_data(self, limit: int = 100) -> Dict[str, List[Any]]:
        """Fetches nodes and relationships for visualization."""
        with self.driver.session() as session:
            return session.execute_read(self._get_graph_data, limit)

    @staticmethod
    def _get_graph_data(tx, limit):
        # Fetch Article nodes
        query_articles = "MATCH (a:Article) RETURN a.url as id, a.title as name, 'article' as type LIMIT $limit"
        articles = [dict(record) for record in tx.run(query_articles, limit=limit)]
        
        # Fetch Concept nodes attached to those articles
        query_concepts = (
            "MATCH (a:Article)<-[:APPEARS_IN]-(c:Concept) "
            "WITH c, count(a) as connections "
            "ORDER BY connections DESC "
            "RETURN c.name as id, c.name as name, 'concept' as type "
            "LIMIT $limit"
        )
        concepts = [dict(record) for record in tx.run(query_concepts, limit=limit)]
        
        # Fetch relationships
        query_rels = (
            "MATCH (c:Concept)-[:APPEARS_IN]->(a:Article) "
            "RETURN c.name as source, a.url as target "
            "LIMIT $limit"
        )
        links = [dict(record) for record in tx.run(query_rels, limit=limit)]
        
        return {"nodes": articles + concepts, "links": links}
    
    def delete_article_node(self, article_url: str):
        """Deletes an Article node and its relationships from the graph."""
        with self.driver.session() as session:
            session.execute_write(self._delete_article_and_orphaned_concepts, article_url)
    
    @staticmethod
    def _delete_article_and_orphaned_concepts(tx, article_url):
        # Delete the article node and its relationships
        # Also delete concepts that are only connected to this article
        query = (
            "MATCH (a:Article {url: $article_url}) "
            "OPTIONAL MATCH (c:Concept)-[r:APPEARS_IN]->(a) "
            "WITH a, c, r, "
            "     [(c)-[:APPEARS_IN]->(other:Article) WHERE other <> a | other] as other_articles "
            "FOREACH (rel IN CASE WHEN r IS NOT NULL THEN [r] ELSE [] END | DELETE rel) "
            "FOREACH (concept IN CASE WHEN c IS NOT NULL AND size(other_articles) = 0 THEN [c] ELSE [] END | DETACH DELETE concept) "
            "DETACH DELETE a"
        )
        tx.run(query, article_url=article_url)

# Singleton instance
graph_service = GraphService()
