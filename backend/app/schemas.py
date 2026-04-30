from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ArticleBase(BaseModel):
    title: str
    url: str
    text: str
    timestamp: Optional[datetime] = None

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CollisionBase(BaseModel):
    concept1: str
    concept2: str
    insight: str
    application: str
    domain: str
    subdomain1: Optional[str] = None  # NEW: primary subdomain of concept1
    subdomain2: Optional[str] = None  # NEW: primary subdomain of concept2

class Collision(CollisionBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class GenerateCollisionRequest(BaseModel):
    article_ids: Optional[list[int]] = None
    concept_names: Optional[list[str]] = None

class CollisionReportBase(BaseModel):
    executive_summary: str
    scientific_mechanism: str
    market_validity: str
    implementation_challenges: str
    societal_impact: str
    confidence_score: int
    feasibility_score: int
    market_potential_score: int

class CollisionReportCreate(CollisionReportBase):
    collision_id: int

class CollisionReport(CollisionReportBase):
    id: int
    collision_id: int
    created_at: datetime

    class Config:
        from_attributes = True
