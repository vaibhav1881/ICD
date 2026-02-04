"""
Clear PostgreSQL database completely
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from backend.app.database import SessionLocal
from backend.app.models import Article, Collision

db = SessionLocal()

try:
    # Delete all collisions
    collision_count = db.query(Collision).count()
    db.query(Collision).delete()
    print(f"✅ Deleted {collision_count} collisions")
    
    # Delete all articles
    article_count = db.query(Article).count()
    db.query(Article).delete()
    print(f"✅ Deleted {article_count} articles")
    
    db.commit()
    
    # Verify
    remaining_articles = db.query(Article).count()
    remaining_collisions = db.query(Collision).count()
    print(f"✅ Remaining articles: {remaining_articles}")
    print(f"✅ Remaining collisions: {remaining_collisions}")
    print("✅ PostgreSQL database is now empty!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    db.rollback()
finally:
    db.close()
