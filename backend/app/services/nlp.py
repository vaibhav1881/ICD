import spacy
from sentence_transformers import SentenceTransformer
import re
from typing import List, Dict, Any

# Load models (lazy loading recommended in production, but global for MVP)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback or instruction to download
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Initialize sentence transformer for embeddings
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def clean_text(text: str) -> str:
    """Basic text cleaning."""
    text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
    return text.strip()

def extract_concepts(text: str) -> Dict[str, Any]:
    """
    Extracts high-quality concepts from text using advanced NLP.
    Prioritizes: Named Entities > Noun Phrases > Important Keywords
    """
    doc = nlp(clean_text(text))
    
    # 1. Extract Named Entities (highest priority - these are concrete concepts)
    entities = []
    for ent in doc.ents:
        # Filter for meaningful entity types
        if ent.label_ in ["PERSON", "ORG", "GPE", "PRODUCT", "EVENT", "WORK_OF_ART", 
                          "LAW", "LANGUAGE", "NORP", "FAC", "LOC"]:
            entities.append(ent.text.strip())
    
    # 2. Extract meaningful noun phrases (2-4 words, not too generic)
    noun_phrases = []
    generic_words = {"thing", "way", "time", "people", "person", "place", "part", 
                     "case", "example", "fact", "point", "number", "lot", "bit"}
    
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip().lower()
        # Filter: length 2-4 words, not starting with generic determiners
        words = phrase.split()
        if (2 <= len(words) <= 4 and 
            not any(generic in phrase for generic in generic_words) and
            not phrase.startswith(("the ", "a ", "an ", "this ", "that "))):
            # Capitalize properly
            noun_phrases.append(chunk.text.strip().title())
    
    # 3. Extract important single keywords (nouns with high importance)
    keywords = []
    for token in doc:
        if (token.pos_ in ["NOUN", "PROPN"] and 
            not token.is_stop and 
            len(token.text) > 3 and  # Avoid very short words
            token.text.lower() not in generic_words):
            keywords.append(token.text.capitalize())
    
    # 4. Combine and rank concepts
    # Priority: Entities > Noun Phrases > Keywords
    all_concepts = []
    
    # Add entities (highest priority)
    all_concepts.extend(list(set(entities)))
    
    # Add noun phrases (medium priority)
    for np in set(noun_phrases):
        if np not in all_concepts:
            all_concepts.append(np)
    
    # Add keywords (lower priority)
    for kw in set(keywords):
        if kw not in all_concepts and not any(kw.lower() in concept.lower() for concept in all_concepts):
            all_concepts.append(kw)
    
    # Return top concepts
    return {
        "entities": list(set(entities)),
        "noun_phrases": list(set(noun_phrases)),
        "keywords": list(set(keywords)),
        "concepts": all_concepts[:15]  # Top 15 most important concepts
    }

def generate_embedding(text: str) -> List[float]:
    """Generates vector embedding for the text."""
    return embedding_model.encode(text).tolist()
