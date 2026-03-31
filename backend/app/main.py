

# Updated: 2026-03-31 — Hybrid NLP + Subdomain classification pipeline
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
    
    # 2. Run Hybrid NLP Extraction (spaCy + KeyBERT + Subdomain classification)
    from .services import nlp, graph
    
    extracted_data = nlp.extract_concepts(article.text)
    
    # Use structured concepts with subdomain info
    structured_concepts = extracted_data.get("concepts", [])
    raw_concepts = extracted_data.get("raw_concepts", [])
    
    if structured_concepts:
        print(f"🧠 Extracted {len(structured_concepts)} tech concepts:")
        for sc in structured_concepts[:5]:
            print(f"   → {sc['name']} [{sc['subdomain']}]")
    
    # 3. Update Knowledge Graph (with subdomain-aware concept storage)
    try:
        graph.graph_service.create_article_node({
            "url": article.url,
            "title": article.title,
            "timestamp": new_article.created_at
        })
        if structured_concepts:
            # Pass structured dicts: [{"name": "...", "subdomain": "..."}, ...]
            concept_dicts = [{"name": c["name"], "subdomain": c["subdomain"]} for c in structured_concepts]
            graph.graph_service.add_concepts(article.url, concept_dicts)
            print(f"✅ Added {len(concept_dicts)} subdomain-classified concepts to graph")
        elif raw_concepts:
            # Fallback: plain string list (backward compat)
            graph.graph_service.add_concepts(article.url, raw_concepts[:15])
            print(f"Added {len(raw_concepts)} concepts to graph (no subdomain)")
    except Exception as e:
        print(f"Graph update failed: {e}")
    
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
    ENHANCED: Prefers cross-subdomain collisions for better interdisciplinary ideas.
    """
    from .services import llm, graph
    from .services.nlp import classify_subdomain
    import random
    
    selected_concepts = []
    subdomain1 = None
    subdomain2 = None

    if request and request.concept_names and len(request.concept_names) >= 2:
        selected_concepts = request.concept_names[:5]
        # Classify subdomains for the provided concepts
        subdomain1 = classify_subdomain(selected_concepts[0])[0]
        subdomain2 = classify_subdomain(selected_concepts[1])[0] if len(selected_concepts) > 1 else None

    elif request and request.article_ids:
        # Fetch articles
        articles = db.query(models.Article).filter(models.Article.id.in_(request.article_ids)).all()
        urls = [a.url for a in articles]
        
        # Get concepts WITH subdomain info
        concept_pool = graph.graph_service.get_concepts_with_subdomains_for_articles(urls)
        
        if len(concept_pool) >= 2:
            # ── Cross-subdomain selection logic ──
            # Group concepts by subdomain
            by_subdomain = {}
            for c in concept_pool:
                sd = c["subdomain"]
                by_subdomain.setdefault(sd, []).append(c["name"])
            
            subdomain_keys = list(by_subdomain.keys())
            
            if len(subdomain_keys) >= 2:
                # Pick two DIFFERENT subdomains
                chosen_subdomains = random.sample(subdomain_keys, 2)
                c1 = random.choice(by_subdomain[chosen_subdomains[0]])
                c2 = random.choice(by_subdomain[chosen_subdomains[1]])
                selected_concepts = [c1, c2]
                subdomain1 = chosen_subdomains[0]
                subdomain2 = chosen_subdomains[1]
            else:
                # Only one subdomain available; pick two random concepts
                names = [c["name"] for c in concept_pool]
                selected_concepts = random.sample(names, min(len(names), 2))
                subdomain1 = subdomain_keys[0]
                subdomain2 = subdomain_keys[0]
        else:
            # Not enough concepts from selected articles
            concepts_by_url = graph.graph_service.get_concepts_for_articles(urls)
            for url, url_concepts in concepts_by_url.items():
                if url_concepts:
                    selected_concepts.append(random.choice(url_concepts))
            selected_concepts = list(set(selected_concepts))
    
    # Fallback: use cross-subdomain query from the whole graph
    if len(selected_concepts) < 2:
        try:
            cross_concepts = graph.graph_service.get_cross_subdomain_concepts(limit=2)
            if len(cross_concepts) >= 2:
                selected_concepts = [c["name"] for c in cross_concepts]
                subdomain1 = cross_concepts[0]["subdomain"]
                subdomain2 = cross_concepts[1]["subdomain"]
            else:
                # Final fallback: plain random
                concepts = graph.graph_service.get_random_concepts(limit=10)
                if len(concepts) >= 2:
                    selected_concepts = random.sample(concepts, 2)
        except Exception as e:
            print(f"Error fetching concepts from graph: {e}")
            selected_concepts = []

    if len(selected_concepts) < 2:
        selected_concepts = ["Neural Networks", "Urban Planning"]
        subdomain1 = "Artificial Intelligence"
        subdomain2 = "Emerging Technologies"
    
    # Trim to 5 concepts max for LLM sanity
    selected_concepts = selected_concepts[:5]
    
    # Classify subdomains if not yet determined
    if not subdomain1:
        subdomain1 = classify_subdomain(selected_concepts[0])[0]
    if not subdomain2 and len(selected_concepts) > 1:
        subdomain2 = classify_subdomain(selected_concepts[1])[0]
    
    print(f"🔀 Cross-subdomain collision: [{subdomain1}] {selected_concepts[0]} ⚡ [{subdomain2}] {selected_concepts[1] if len(selected_concepts) > 1 else '?'}")
    
    # Generate Collision
    collision_data = llm.llm_service.generate_collision(selected_concepts)
    
    # Store result with subdomain info
    new_collision = models.Collision(
        concept1=collision_data["concept_1"],
        concept2=collision_data["concept_2"],
        insight=collision_data["insight"],
        application=collision_data["application"],
        domain=collision_data["domain_intersection"],
        subdomain1=subdomain1,
        subdomain2=subdomain2,
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
    return {
        "total_concepts": article_count * 5 + 120,
        "collisions_found": collision_count,
        "connections": article_count * 8 + 300
    }

@app.get("/health/db")
async def health_db():
    """Simple health check for PostgreSQL connection"""
    from sqlalchemy import text
    try:
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
    
    article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    try:
        graph.graph_service.delete_article_node(article.url)
    except Exception as e:
        print(f"Error deleting from Neo4j: {e}")
    
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
