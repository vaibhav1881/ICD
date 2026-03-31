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

    def add_concepts(self, article_url: str, concepts):
        """
        Creates Concept nodes and links them to the Article.
        Accepts EITHER:
          - List[str]          (backward compat: plain concept names)
          - List[Dict]         (new: [{"name": "...", "subdomain": "..."}, ...])
        """
        with self.driver.session() as session:
            # Normalize to list of dicts
            if concepts and isinstance(concepts[0], str):
                concept_dicts = [{"name": c, "subdomain": "Emerging Technologies"} for c in concepts]
            else:
                concept_dicts = concepts
            session.execute_write(self._create_concepts_and_relationships, article_url, concept_dicts)

    @staticmethod
    def _create_concepts_and_relationships(tx, article_url, concept_dicts):
        query = (
            "MATCH (a:Article {url: $article_url}) "
            "UNWIND $concepts as concept "
            "MERGE (c:Concept {name: concept.name}) "
            "ON CREATE SET c.subdomain = concept.subdomain "
            "ON MATCH SET c.subdomain = COALESCE(c.subdomain, concept.subdomain) "
            "MERGE (c)-[:APPEARS_IN]->(a)"
        )
        tx.run(query, article_url=article_url, concepts=concept_dicts)

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

    def get_cross_subdomain_concepts(self, limit: int = 2) -> List[Dict[str, str]]:
        """
        Pick concepts from DIFFERENT subdomains for cross-disciplinary collisions.
        Returns list of dicts: [{"name": "...", "subdomain": "..."}, ...]
        """
        with self.driver.session() as session:
            return session.execute_read(self._get_cross_subdomain_concepts, limit)

    @staticmethod
    def _get_cross_subdomain_concepts(tx, limit):
        query = (
            "MATCH (c:Concept) "
            "WHERE c.subdomain IS NOT NULL "
            "WITH c.subdomain AS subdomain, collect(c) AS concepts "
            "WITH subdomain, concepts, rand() AS r "
            "ORDER BY r "
            "LIMIT $limit "
            "UNWIND concepts AS concept "
            "WITH subdomain, concept, rand() AS r2 "
            "ORDER BY r2 "
            "WITH subdomain, head(collect(concept)) AS picked "
            "RETURN picked.name AS name, subdomain "
        )
        result = tx.run(query, limit=limit)
        return [{"name": record["name"], "subdomain": record["subdomain"]} for record in result]

    def get_concepts_for_articles(self, article_urls: List[str]) -> Dict[str, List[str]]:
        """Fetches concepts grouped by article url."""
        with self.driver.session() as session:
            return session.execute_read(self._get_concepts_for_articles, article_urls)

    @staticmethod
    def _get_concepts_for_articles(tx, article_urls):
        query = (
            "UNWIND $urls AS url "
            "MATCH (a:Article {url: url})<-[:APPEARS_IN]-(c:Concept) "
            "RETURN url, collect(c.name) AS concepts"
        )
        result = tx.run(query, urls=article_urls)
        return {record["url"]: record["concepts"] for record in result}

    def get_concepts_with_subdomains_for_articles(self, article_urls: List[str]) -> List[Dict[str, str]]:
        """Fetches concepts WITH subdomain info for targeted collision generation."""
        with self.driver.session() as session:
            return session.execute_read(self._get_concepts_with_subdomains, article_urls)

    @staticmethod
    def _get_concepts_with_subdomains(tx, article_urls):
        query = (
            "UNWIND $urls AS url "
            "MATCH (a:Article {url: url})<-[:APPEARS_IN]-(c:Concept) "
            "RETURN DISTINCT c.name AS name, COALESCE(c.subdomain, 'Emerging Technologies') AS subdomain"
        )
        result = tx.run(query, urls=article_urls)
        return [{"name": record["name"], "subdomain": record["subdomain"]} for record in result]

    def get_graph_data(self, limit: int = 500) -> Dict[str, List[Any]]:
        """Fetches nodes and relationships for visualization (with subdomain)."""
        with self.driver.session() as session:
            return session.execute_read(self._get_graph_data, limit)

    @staticmethod
    def _get_graph_data(tx, limit):
        # Fetch ALL Article nodes (no limit — articles are always few)
        query_articles = "MATCH (a:Article) RETURN a.url as id, a.title as name, 'article' as type"
        articles = [dict(record) for record in tx.run(query_articles)]
        
        # Fetch Concept nodes attached to those articles (with subdomain)
        query_concepts = (
            "MATCH (a:Article)<-[:APPEARS_IN]-(c:Concept) "
            "WITH c, count(a) as connections "
            "ORDER BY connections DESC "
            "RETURN c.name as id, c.name as name, 'concept' as type, "
            "COALESCE(c.subdomain, 'Emerging Technologies') as subdomain "
            "LIMIT $limit"
        )
        concepts = [dict(record) for record in tx.run(query_concepts, limit=limit)]
        
        # Build a set of valid node IDs so we only return links for nodes we have
        valid_ids = set()
        for a in articles:
            valid_ids.add(a["id"])
        for c in concepts:
            valid_ids.add(c["id"])
        
        # Fetch ALL relationships between the nodes we have
        query_rels = (
            "MATCH (c:Concept)-[:APPEARS_IN]->(a:Article) "
            "RETURN c.name as source, a.url as target"
        )
        all_links = [dict(record) for record in tx.run(query_rels)]
        
        # Filter links to only include nodes that exist in our node lists
        links = [l for l in all_links if l["source"] in valid_ids and l["target"] in valid_ids]
        
        return {"nodes": articles + concepts, "links": links}
    
    def delete_article_node(self, article_url: str):
        """Deletes an Article node and its relationships from the graph."""
        with self.driver.session() as session:
            session.execute_write(self._delete_article_and_orphaned_concepts, article_url)
    
    @staticmethod
    def _delete_article_and_orphaned_concepts(tx, article_url):
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
