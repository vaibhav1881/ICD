"""
Script to clear all articles and collisions from the database
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal, engine
from app.models import Article, Collision, Base
from app.services.graph import graph_service

def clear_all_data():
    db = SessionLocal()
    try:
        # 1. Delete all collisions
        collision_count = db.query(Collision).count()
        db.query(Collision).delete()
        print(f"✅ Deleted {collision_count} collisions from PostgreSQL")
        
        # 2. Delete all articles
        article_count = db.query(Article).count()
        db.query(Article).delete()
        print(f"✅ Deleted {article_count} articles from PostgreSQL")
        
        db.commit()
        
        # 3. Clear Neo4j graph
        with graph_service.driver.session() as session:
            # Delete all nodes and relationships
            result = session.run("MATCH (n) DETACH DELETE n")
            print(f"✅ Cleared Neo4j graph database")
        
        print("\n🎉 All data cleared successfully!")
        print("Ready for fresh article capture and collision generation.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🗑️  Clearing all data from databases...")
    print("=" * 50)
    clear_all_data()
