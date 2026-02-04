import os
import json
import random
from typing import List, Dict, Any

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    # dotenv not installed; assume env vars are already set
    pass

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
    
    def generate_collision(self, concept_pair: List[str]) -> Dict[str, Any]:
        """
        Generates a creative collision between two concepts.
        """
        if not self.api_key or self.api_key == "your_api_key_here":
            # Generate a dynamic mock collision based on actual concepts
            return self._generate_mock_collision(concept_pair[0], concept_pair[1])
            
        # Implement actual OpenAI call
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.api_key)
            
            prompt = f"""
            Generate a creative "idea collision" between these two concepts: "{concept_pair[0]}" and "{concept_pair[1]}".
            Find a surprising connection, insight, or application that combines them.
            
            Return ONLY a JSON object with this structure:
            {{
                "insight": "The core creative connection...",
                "application": "A concrete real-world application...",
                "domain_intersection": "Domain 1 x Domain 2"
            }}
            """
            
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            
            content = json.loads(response.choices[0].message.content)
            
            return {
                "concept_1": concept_pair[0],
                "concept_2": concept_pair[1],
                "insight": content.get("insight", "No insight generated."),
                "application": content.get("application", "No application generated."),
                "domain_intersection": content.get("domain_intersection", "Unknown")
            }
        except Exception as e:
            # Log the error and fall back to a dynamic mock collision
            print(f"Error calling OpenAI API for collision generation: {e}")
            return self._generate_mock_collision(concept_pair[0], concept_pair[1])
    
    def _generate_mock_collision(self, concept1: str, concept2: str) -> Dict[str, Any]:
        """Generate a dynamic mock collision based on the actual concepts"""
        
        # Templates for generating insights
        insight_templates = [
            f"Both {concept1} and {concept2} share fundamental patterns of organization and adaptation that could inform new approaches to problem-solving.",
            f"The intersection of {concept1} and {concept2} reveals unexpected parallels in how systems evolve and optimize over time.",
            f"Combining principles from {concept1} with {concept2} could lead to breakthrough innovations in how we approach complex challenges.",
            f"{concept1} and {concept2} both demonstrate emergent properties that could be leveraged to create more resilient and adaptive systems.",
            f"The synergy between {concept1} and {concept2} suggests novel frameworks for understanding interconnected phenomena."
        ]
        
        application_templates = [
            f"Develop hybrid systems that apply {concept1} methodologies to {concept2} challenges.",
            f"Create new tools that bridge {concept1} and {concept2} to solve interdisciplinary problems.",
            f"Design educational programs that teach {concept1} through the lens of {concept2}.",
            f"Build platforms that integrate {concept1} insights with {concept2} applications.",
            f"Establish research initiatives exploring the convergence of {concept1} and {concept2}."
        ]
        
        # Infer domains from concepts (simple heuristic)
        domain1 = self._infer_domain(concept1)
        domain2 = self._infer_domain(concept2)
        
        return {
            "concept_1": concept1,
            "concept_2": concept2,
            "insight": random.choice(insight_templates),
            "application": random.choice(application_templates),
            "domain_intersection": f"{domain1} x {domain2}"
        }
    
    def _infer_domain(self, concept: str) -> str:
        """Infer domain from concept name (simple keyword matching)"""
        concept_lower = concept.lower()
        
        tech_keywords = ['ai', 'algorithm', 'computer', 'software', 'data', 'network', 'digital', 'quantum', 'computing', 'technology', 'intelligence', 'machine', 'learning']
        science_keywords = ['biology', 'physics', 'chemistry', 'science', 'molecular', 'genetic', 'neural', 'brain']
        art_keywords = ['art', 'design', 'music', 'creative', 'aesthetic', 'visual', 'architecture']
        social_keywords = ['social', 'society', 'culture', 'human', 'psychology', 'urban', 'planning', 'city']
        business_keywords = ['business', 'market', 'economy', 'finance', 'management', 'strategy']
        
        if any(keyword in concept_lower for keyword in tech_keywords):
            return "Technology"
        elif any(keyword in concept_lower for keyword in science_keywords):
            return "Science"
        elif any(keyword in concept_lower for keyword in art_keywords):
            return "Arts & Design"
        elif any(keyword in concept_lower for keyword in social_keywords):
            return "Social Sciences"
        elif any(keyword in concept_lower for keyword in business_keywords):
            return "Business"
        else:
            return "Interdisciplinary"

llm_service = LLMService()
