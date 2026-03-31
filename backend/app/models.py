from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Collision(Base):
    __tablename__ = "collisions"

    id = Column(Integer, primary_key=True, index=True)
    concept1 = Column(String)
    concept2 = Column(String)
    insight = Column(Text)
    application = Column(Text)
    domain = Column(String)                     # Kept for backward compatibility
    subdomain1 = Column(String, nullable=True)  # NEW: primary subdomain of concept1
    subdomain2 = Column(String, nullable=True)  # NEW: primary subdomain of concept2
    created_at = Column(DateTime(timezone=True), server_default=func.now())
