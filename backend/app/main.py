

# Updated: 2026-02-04 22:47 - Using new NLP with person name filtering
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from backend root (parent of app directory)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
from .services import graph
from .services import llm
import random

# Create tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Idea Collision Generator")

origins = [
    "http://localhost:3000",
    "chrome-extension://*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/ingest/article", response_model=schemas.Article)
async def ingest_article(article: schemas.ArticleCreate, db: Session = Depends(database.get_db)):
    # Check if exists
    db_article = db.query(models.Article).filter(models.Article.url == article.url).first()
    if db_article:
        return db_article
    
    # 1. Save to PostgreSQL
    new_article = models.Article(
        title=article.title,
        url=article.url,
        text=article.text
    )
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    # 2. Run NLP Extraction (Synchronous for MVP, move to Celery later)
    from .services import nlp, graph
    
    extracted_data = nlp.extract_concepts(article.text)
    # Use the new 'concepts' field which prioritizes entities and noun phrases
    concepts = extracted_data.get("concepts", extracted_data["keywords"])[:15]
    
    # 3. Update Knowledge Graph
    try:
        graph.graph_service.create_article_node({
            "url": article.url,
            "title": article.title,
            "timestamp": new_article.created_at
        })
        if concepts:  # Only add if we have concepts
            graph.graph_service.add_concepts(article.url, concepts)
            print(f"Added {len(concepts)} concepts to graph: {concepts[:5]}...")
    except Exception as e:
        print(f"Graph update failed: {e}")
        # Continue even if graph fails, but log it
    
    return new_article

@app.get("/articles", response_model=list[schemas.Article])
async def list_articles(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    articles = db.query(models.Article).order_by(models.Article.created_at.desc()).offset(skip).limit(limit).all()
    return articles

@app.get("/articles/{article_id}/concepts")
async def get_article_concepts(article_id: int, db: Session = Depends(database.get_db)):
    from .services import graph
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    concepts_dict = graph.graph_service.get_concepts_for_articles([article.url])
    return {"concepts": concepts_dict.get(article.url, [])}

@app.post("/collisions/generate", response_model=schemas.Collision)
async def generate_collisions(request: schemas.GenerateCollisionRequest = None, db: Session = Depends(database.get_db)):
    """
    Trigger generation of collisions from existing concepts.
    If request is empty, picks two random concepts.
    If request has article_ids, picks one random concept per article.
    If request has concept_names, uses those explicitly.
    """
    from .services import llm, graph
    import random
    
    selected_concepts = []
    
    if request and request.concept_names and len(request.concept_names) >= 2:
        selected_concepts = request.concept_names[:5] # limit to 5 concepts

    elif request and request.article_ids:
        # Fetch articles
        articles = db.query(models.Article).filter(models.Article.id.in_(request.article_ids)).all()
        urls = [a.url for a in articles]
        
        # Get concepts mapped by url
        concepts_by_url = graph.graph_service.get_concepts_for_articles(urls)
        
        # Pick 1 concept from each article
        for url, url_concepts in concepts_by_url.items():
            if url_concepts:
                selected_concepts.append(random.choice(url_concepts))
        
        # Ensure unique and at least 2
        selected_concepts = list(set(selected_concepts))
        if len(selected_concepts) < 2:
            # Fill with random concepts from these articles to reach at least 2
            pool = []
            for concepts in concepts_by_url.values():
                pool.extend(concepts)
            pool = list(set(pool))
            if len(pool) >= 2:
                selected_concepts = random.sample(pool, min(len(pool), max(2, len(request.article_ids))))
    
    # 1. Fallback to random concepts from Graph if no request or insufficient concepts found
    if len(selected_concepts) < 2:
        try:
            concepts = graph.graph_service.get_random_concepts(limit=10)
            if len(concepts) >= 2:
                selected_concepts = random.sample(concepts, 2)
        except Exception as e:
            print(f"Error fetching concepts from graph: {e}")
            selected_concepts = []

    if len(selected_concepts) < 2:
        # Final Fallback if graph is empty or error
        selected_concepts = ["Neural Networks", "Urban Planning"]
    
    # Trim to 5 concepts max for LLM sanity
    selected_concepts = selected_concepts[:5]
    
    # 2. Generate Collision
    collision_data = llm.llm_service.generate_collision(selected_concepts)
    
    # 3. Store result
    new_collision = models.Collision(
        concept1=collision_data["concept_1"],
        concept2=collision_data["concept_2"],
        insight=collision_data["insight"],
        application=collision_data["application"],
        domain=collision_data["domain_intersection"]
    )
    db.add(new_collision)
    db.commit()
    db.refresh(new_collision)
    
    return new_collision

@app.get("/collisions", response_model=list[schemas.Collision])
async def list_collisions(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    collisions = db.query(models.Collision).order_by(models.Collision.created_at.desc()).offset(skip).limit(limit).all()
    return collisions

@app.get("/collisions/{collision_id}", response_model=schemas.Collision)
async def get_collision(collision_id: int, db: Session = Depends(database.get_db)):
    collision = db.query(models.Collision).filter(models.Collision.id == collision_id).first()
    if not collision:
        raise HTTPException(status_code=404, detail="Collision not found")
    return collision

@app.post("/collisions/{collision_id}/explore")
async def explore_collision(collision_id: int, db: Session = Depends(database.get_db)):
    """Generates detailed deep-dive for a specific collision dynamically"""
    from .services import llm
    collision = db.query(models.Collision).filter(models.Collision.id == collision_id).first()
    if not collision:
        raise HTTPException(status_code=404, detail="Collision not found")
    
    explanation = llm.llm_service.expand_collision(
        collision.concept1, 
        collision.concept2, 
        collision.insight, 
        collision.application
    )
    return explanation

@app.get("/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(database.get_db)):
    article_count = db.query(models.Article).count()
    collision_count = db.query(models.Collision).count()
    # Mocking concept count for now as it's in Neo4j, or we could query Neo4j here
    # For MVP speed, we'll just return what we have in Postgres + a mock for graph nodes
    return {
        "total_concepts": article_count * 5 + 120, # Mock estimation
        "collisions_found": collision_count,
        "connections": article_count * 8 + 300 # Mock estimation
    }
    
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/health/db")
async def health_db():
    """Simple health check for PostgreSQL connection"""
    from sqlalchemy import text
    try:
        # Use the engine defined in database module
        with database.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok"}
    except Exception as e:
        print(f"DB health check failed: {e}")
        return {"status": "error", "detail": str(e)}


@app.get("/graph/data")
async def get_graph_visualization_data():
    from .services import graph
    try:
        data = graph.graph_service.get_graph_data()
        return data
    except Exception as e:
        print(f"Error fetching graph data: {e}")
        return {"nodes": [], "links": []}

@app.delete("/articles/{article_id}")
async def delete_article(article_id: int, db: Session = Depends(database.get_db)):
    """Delete an article from PostgreSQL and Neo4j"""
    from .services import graph
    
    # Get article first
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Delete from Neo4j graph
    try:
        graph.graph_service.delete_article_node(article.url)
    except Exception as e:
        print(f"Error deleting from Neo4j: {e}")
    
    # Delete from PostgreSQL
    db.delete(article)
    db.commit()
    
    return {"message": "Article deleted successfully"}

@app.delete("/collisions/{collision_id}")
async def delete_collision(collision_id: int, db: Session = Depends(database.get_db)):
    """Delete a collision from PostgreSQL"""
    collision = db.query(models.Collision).filter(models.Collision.id == collision_id).first()
    if not collision:
        raise HTTPException(status_code=404, detail="Collision not found")
    
    db.delete(collision)
    db.commit()
    
    return {"message": "Collision deleted successfully"}
