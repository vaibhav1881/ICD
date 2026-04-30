from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
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
    
    report = relationship("CollisionReport", back_populates="collision", uselist=False)

class CollisionReport(Base):
    __tablename__ = "collision_reports"

    id = Column(Integer, primary_key=True, index=True)
    collision_id = Column(Integer, ForeignKey("collisions.id"), unique=True)
    executive_summary = Column(Text)
    scientific_mechanism = Column(Text)
    market_validity = Column(Text)
    implementation_challenges = Column(Text)
    societal_impact = Column(Text)
    confidence_score = Column(Integer)
    feasibility_score = Column(Integer)
    market_potential_score = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    collision = relationship("Collision", back_populates="report")
