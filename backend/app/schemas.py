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
