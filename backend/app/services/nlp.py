import spacy
from sentence_transformers import SentenceTransformer
from keybert import KeyBERT
import re
from typing import List, Dict, Any, Set

# Load models
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Initialize sentence transformer & KeyBERT
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
kw_model = KeyBERT(model=embedding_model)

# ─────────────────────────────────────────────────────────
# TECHNOLOGY SUBDOMAIN TAXONOMY
# ─────────────────────────────────────────────────────────
TECH_SUBDOMAINS: Dict[str, Set[str]] = {
    "Artificial Intelligence": {
        "ai", "machine learning", "deep learning", "neural network", "nlp",
        "natural language processing", "computer vision", "reinforcement learning",
        "transformer", "llm", "generative ai", "classification", "regression",
        "supervised", "unsupervised", "convolutional", "recurrent", "gan",
        "diffusion", "attention mechanism", "fine-tuning", "transfer learning",
        "chatbot", "inference", "training", "model", "embedding",
    },
    "Data Science": {
        "data mining", "big data", "analytics", "statistics", "data analysis",
        "visualization", "prediction", "modeling", "dataset", "data pipeline",
        "feature engineering", "data warehouse", "etl", "dashboard", "reporting",
        "correlation", "clustering", "dimensionality reduction",
    },
    "Software Engineering": {
        "software", "web", "app", "api", "backend", "frontend", "database",
        "system design", "architecture", "microservices", "devops", "ci/cd",
        "testing", "agile", "git", "version control", "framework", "library",
        "compiler", "interpreter", "debugging", "refactoring", "rest", "graphql",
        "orm", "sql", "nosql", "mongodb", "postgresql",
    },
    "Cybersecurity": {
        "security", "encryption", "blockchain", "authentication", "cyber",
        "privacy", "cryptography", "secure", "firewall", "vulnerability",
        "malware", "intrusion", "phishing", "ransomware", "penetration testing",
        "zero trust", "ssl", "tls", "hashing", "certificate", "oauth",
    },
    "Networking & Cloud": {
        "network", "cloud", "iot", "distributed", "edge computing", "server",
        "protocol", "wireless", "tcp", "dns", "kubernetes", "docker", "aws",
        "azure", "gcp", "load balancer", "cdn", "proxy", "gateway", "5g",
        "bandwidth", "latency", "routing", "vpn", "containerization",
    },
    "Hardware & Robotics": {
        "embedded systems", "microcontroller", "sensor", "robotics", "hardware",
        "automation", "electronics", "actuator", "fpga", "circuit", "pcb",
        "arduino", "raspberry pi", "lidar", "motor", "servo", "drone",
        "3d printing", "manufacturing", "industrial",
    },
    "Human-Computer Interaction": {
        "ui", "ux", "interface", "user experience", "augmented reality",
        "virtual reality", "interaction", "accessibility", "usability",
        "haptic", "gesture", "wearable", "mixed reality", "ergonomics",
        "responsive design", "user research", "prototype",
    },
    "Emerging Technologies": {
        "quantum computing", "bioinformatics", "digital twin", "metaverse",
        "autonomous systems", "nanotechnology", "brain-computer interface",
        "gene editing", "crispr", "synthetic biology", "space tech",
        "neuromorphic", "photonic", "self-driving",
    },
}

# Build a reverse lookup: keyword → set of subdomains
_KEYWORD_TO_SUBDOMAINS: Dict[str, List[str]] = {}
for _subdomain, _keywords in TECH_SUBDOMAINS.items():
    for _kw in _keywords:
        _KEYWORD_TO_SUBDOMAINS.setdefault(_kw, []).append(_subdomain)

# Flat set of ALL tech keywords for fast membership testing
ALL_TECH_KEYWORDS: Set[str] = set()
for _keywords in TECH_SUBDOMAINS.values():
    ALL_TECH_KEYWORDS.update(_keywords)


def classify_subdomain(concept: str) -> List[str]:
    """
    Classify a concept into one or more Technology subdomains.
    Returns a list of matching subdomains (multi-label), sorted by relevance.
    """
    concept_lower = concept.lower().strip()
    scores: Dict[str, int] = {}

    for subdomain, keywords in TECH_SUBDOMAINS.items():
        match_count = 0
        for keyword in keywords:
            if keyword in concept_lower or concept_lower in keyword:
                match_count += 1
        if match_count > 0:
            scores[subdomain] = match_count

    if not scores:
        # Fallback: check individual tokens
        tokens = set(concept_lower.split())
        for subdomain, keywords in TECH_SUBDOMAINS.items():
            for keyword in keywords:
                kw_tokens = set(keyword.split())
                if tokens & kw_tokens:
                    scores[subdomain] = scores.get(subdomain, 0) + 1

    if scores:
        return sorted(scores, key=scores.get, reverse=True)
    return ["Emerging Technologies"]  # Default fallback


def _is_tech_related(text: str) -> bool:
    """Check if a concept string matches any technology keyword."""
    text_lower = text.lower().strip()
    text_tokens = set(text_lower.split())

    # Direct match
    if text_lower in ALL_TECH_KEYWORDS:
        return True

    # Partial match: any tech keyword appears inside the concept
    for keyword in ALL_TECH_KEYWORDS:
        if keyword in text_lower or text_lower in keyword:
            return True

    # Token-level match: any token matches a single-word tech keyword
    single_word_keywords = {kw for kw in ALL_TECH_KEYWORDS if " " not in kw}
    if text_tokens & single_word_keywords:
        return True

    return False


def clean_text(text: str) -> str:
    """Basic text cleaning."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def _is_valid_concept(text_str: str) -> bool:
    """Check if a string is a valid technical concept."""
    text_lower = text_str.lower().strip()

    if len(text_str) < 4:
        return False

    # Blacklist
    blacklist_terms = {
        'doi', 'isbn', 'http', 'www', 'arxiv', 'bibcode', 'pmid',
        'et al', 'pp', 'vol', 'no', 'ed', 'eds', 'retrieved',
        'a b', 'a b c', 'cite', 'reference', 'references',
        'washington', 'dc', 'new york', 'london', 'press',
        'university', 'institute', 'department', 'journal',
        'proceedings', 'conference', 'symposium'
    }
    if any(term in text_lower for term in blacklist_terms):
        return False

    person_indicators = ['jr', 'sr', 'phd', 'md', 'dr', 'prof', 'mr', 'mrs', 'ms']
    if any(indicator in text_lower for indicator in person_indicators):
        return False

    if re.search(r'[0-9]{4}', text_str):
        return False
    if re.search(r'[\[\]()\&]', text_str):
        return False
    if text_str.isupper() and len(text_str) < 6:
        return False
    if ',' in text_str:
        return False

    return True


def extract_concepts(text: str) -> Dict[str, Any]:
    """
    Hybrid concept extraction pipeline:
      Step 1 — spaCy NER
      Step 2 — spaCy Noun Phrases
      Step 3 — KeyBERT keyword extraction
      Step 4 — Combine all terms
      Step 5 — Filter only Technology-related concepts
      Step 6 — Remove duplicates and short words
      Step 7 — Assign subdomain to each concept

    Returns:
        {
            "concepts": [{"name": "...", "subdomain": "..."}, ...],
            "raw_concepts": ["concept1", "concept2", ...]  # flat list for backward compat
        }
    """
    doc = nlp(clean_text(text))
    candidates: List[str] = []

    # ── Step 1: spaCy Named Entity Recognition ──
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT", "WORK_OF_ART", "LAW", "LANGUAGE"]:
            if _is_valid_concept(ent.text):
                candidates.append(ent.text.strip())

    # ── Step 2: spaCy Noun Phrase Extraction ──
    for chunk in doc.noun_chunks:
        phrase = chunk.text.strip()
        words = phrase.split()
        if 2 <= len(words) <= 5:
            if _is_valid_concept(phrase):
                phrase_clean = re.sub(
                    r'^(the|a|an|this|that|these|those)\s+', '', phrase, flags=re.IGNORECASE
                )
                if len(phrase_clean) > 4:
                    candidates.append(phrase_clean.title())

    # ── Step 3: KeyBERT Keyword Extraction ──
    try:
        keybert_keywords = kw_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 3),
            stop_words='english',
            top_n=15,
            use_mmr=True,
            diversity=0.5
        )
        for keyword, score in keybert_keywords:
            if _is_valid_concept(keyword) and score > 0.2:
                candidates.append(keyword.title())
    except Exception as e:
        print(f"⚠️ KeyBERT extraction warning: {e}")

    # Also add single technical nouns from spaCy
    for token in doc:
        if (token.pos_ in ["NOUN", "PROPN"]
                and not token.is_stop
                and len(token.text) > 4
                and token.text.isalpha()
                and token.ent_type_ != "PERSON"):
            if _is_valid_concept(token.text):
                candidates.append(token.text.capitalize())

    # ── Step 4 & 5: Deduplicate + Technology Filter ──
    seen_lower: set = set()
    tech_concepts: List[str] = []

    for concept in candidates:
        concept_normalized = concept.strip()
        cl = concept_normalized.lower()

        if cl in seen_lower:
            continue

        # Check if already a substring of an existing concept
        if any(cl in existing for existing in seen_lower):
            continue

        if _is_tech_related(concept_normalized):
            seen_lower.add(cl)
            tech_concepts.append(concept_normalized)

    # ── Step 6: Final clean ──
    final_concepts = [c for c in tech_concepts if len(c) >= 4][:20]

    # ── Step 7: Assign subdomains ──
    structured_concepts = []
    for concept_name in final_concepts:
        subdomains = classify_subdomain(concept_name)
        structured_concepts.append({
            "name": concept_name,
            "subdomain": subdomains[0],  # Primary subdomain
            "all_subdomains": subdomains,
        })

    return {
        "concepts": structured_concepts,
        "raw_concepts": final_concepts,  # Backward-compatible flat list
    }


def generate_embedding(text: str) -> List[float]:
    """Generates vector embedding for the text."""
    return embedding_model.encode(text).tolist()
