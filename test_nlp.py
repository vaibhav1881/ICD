"""Quick smoke test for the upgraded NLP pipeline."""
import sys
sys.path.insert(0, ".")

from backend.app.services.nlp import extract_concepts, classify_subdomain

print("=" * 60)
print("  HYBRID NLP + SUBDOMAIN PIPELINE TEST")
print("=" * 60)

test_text = """
Deep learning and neural networks are transforming cybersecurity 
with blockchain-based encryption and IoT edge computing for 
distributed cloud architectures. Machine learning models help 
detect malware and intrusion attempts while quantum computing 
poses new challenges for cryptography. Microcontrollers and 
embedded systems enable edge AI. Modern software engineering 
uses Docker, Kubernetes, and microservices with REST APIs.
"""

result = extract_concepts(test_text)

print("\n--- Structured Concepts ---")
for c in result["concepts"]:
    print(f"  {c['name']:40s} -> [{c['subdomain']}]")

print(f"\nTotal extracted: {len(result['concepts'])} concepts")
print(f"Raw list: {result['raw_concepts'][:5]}...")

print("\n--- Subdomain Classification Test ---")
test_concepts = [
    "Neural Network", "Docker", "Blockchain", "IoT", 
    "Quantum Computing", "UX Design", "Robotics", "Big Data"
]
for concept in test_concepts:
    subs = classify_subdomain(concept)
    print(f"  {concept:25s} -> {subs}")

print("\n✅ Pipeline test complete!")
