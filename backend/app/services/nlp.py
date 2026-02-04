import spacy
from sentence_transformers import SentenceTransformer
import re
from typing import List, Dict, Any

# Load models - UPDATED VERSION WITH AGGRESSIVE FILTERING
# This version excludes ALL person names and citations
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Initialize sentence transformer
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def clean_text(text: str) -> str:
    """Basic text cleaning."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_concepts(text: str) -> Dict[str, Any]:
    """
    Extracts high-quality technical concepts from text.
    STRICTLY filters out: Person names, citations, generic terms, references
    """
    doc = nlp(clean_text(text))
    
    # Blacklist of terms to ALWAYS exclude
    blacklist_terms = {
        'doi', 'isbn', 'http', 'www', 'arxiv', 'bibcode', 'pmid',
        'et al', 'pp', 'vol', 'no', 'ed', 'eds', 'retrieved',
        'a b', 'a b c', 'cite', 'reference', 'references',
        'washington', 'dc', 'new york', 'london', 'press',
        'university', 'institute', 'department', 'journal',
        'proceedings', 'conference', 'symposium'
    }
    
    # Common person name patterns to exclude
    person_indicators = ['jr', 'sr', 'phd', 'md', 'dr', 'prof', 'mr', 'mrs', 'ms']
    
    def is_valid_concept(text_str: str) -> bool:
        """Check if a string is a valid technical concept"""
        text_lower = text_str.lower().strip()
        
        # Too short
        if len(text_str) < 4:
            return False
        
        # Contains blacklisted terms
        if any(term in text_lower for term in blacklist_terms):
            return False
        
        # Contains person indicators
        if any(indicator in text_lower for indicator in person_indicators):
            return False
        
        # Contains numbers/symbols (likely a citation)
        if re.search(r'[0-9]{4}', text_str):  # Year pattern
            return False
        if re.search(r'[\[\]()&]', text_str):  # Citation brackets
            return False
        
        # All caps (likely acronym without context)
        if text_str.isupper() and len(text_str) < 6:
            return False
        
        # Contains comma (likely "LastName, FirstName")
        if ',' in text_str:
            return False
        
        return True
    
    # 1. Extract ONLY technical entities (NO PERSONS!)
    entities = []
    for ent in doc.ents:
        # STRICTLY exclude PERSON, DATE, TIME, MONEY, PERCENT, ORDINAL, CARDINAL
        if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART", "LAW", "LANGUAGE"]:
            if is_valid_concept(ent.text):
                entities.append(ent.text.strip())
    
    # 2. Extract technical noun phrases
    noun_phrases = []
    technical_keywords = {
        'algorithm', 'system', 'network', 'computing', 'technology',
        'intelligence', 'learning', 'quantum', 'neural', 'data',
        'processing', 'optimization', 'theory', 'model', 'framework',
        'architecture', 'design', 'analysis', 'method', 'approach',
        'blockchain', 'cryptography', 'protocol', 'security',
        'ecology', 'biology', 'psychology', 'economy', 'urban',
        'cognitive', 'swarm', 'circular', 'sustainable', 'smart'
    }
    
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip()
        phrase_lower = phrase.lower()
        
        # Must contain at least one technical keyword
        has_technical_term = any(keyword in phrase_lower for keyword in technical_keywords)
        
        # Length check: 2-5 words
        words = phrase.split()
        if 2 <= len(words) <= 5 and has_technical_term:
            if is_valid_concept(phrase):
                # Remove leading articles
                phrase_clean = re.sub(r'^(the|a|an|this|that|these|those)\s+', '', phrase, flags=re.IGNORECASE)
                if len(phrase_clean) > 4:
                    noun_phrases.append(phrase_clean.title())
    
    # 3. Extract single technical keywords
    keywords = []
    for token in doc:
        if (token.pos_ in ["NOUN", "PROPN"] and 
            not token.is_stop and 
            len(token.text) > 4 and
            token.text.isalpha()):
            
            # MUST NOT be a person name
            if token.ent_type_ == "PERSON":
                continue
            
            # Check if it's a technical term
            if token.text.lower() in technical_keywords or token.pos_ == "NOUN":
                if is_valid_concept(token.text):
                    keywords.append(token.text.capitalize())
    
    # 4. Combine with priority
    all_concepts = []
    
    # Add entities first
    all_concepts.extend(list(set(entities)))
    
    # Add noun phrases
    for np in set(noun_phrases):
        if np not in all_concepts:
            all_concepts.append(np)
    
    # Add keywords
    for kw in set(keywords):
        if kw not in all_concepts and not any(kw.lower() in c.lower() for c in all_concepts):
            all_concepts.append(kw)
    
    # Final validation
    final_concepts = [c for c in all_concepts if is_valid_concept(c)]
    
    return {
        "entities": list(set(entities)),
        "noun_phrases": list(set(noun_phrases))[:15],
        "keywords": list(set(keywords))[:15],
        "concepts": final_concepts[:15]  # Top 15 technical concepts only
    }

def generate_embedding(text: str) -> List[float]:
    """Generates vector embedding for the text."""
    return embedding_model.encode(text).tolist()
