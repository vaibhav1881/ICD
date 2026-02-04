import os
import json
import random
import logging
# Updated: 2026-02-04 23:14 - Reverted to stable google-generativeai SDK
from typing import List, Dict, Any

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Suppress Warnings
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

class LLMService:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY")
        
        # Determine which API to use
        if self.gemini_api_key and self.gemini_api_key != "your_gemini_api_key_here":
            self.use_gemini = True
            print("🤖 Using Google Gemini API for collision generation")
        elif self.openai_api_key and self.openai_api_key != "your_api_key_here":
            self.use_gemini = False
            print("🤖 Using OpenAI API for collision generation")
        else:
            self.use_gemini = None
            print("⚠️  No API key found, using mock collision generation")
    
    def generate_collision(self, concept_pair: List[str]) -> Dict[str, Any]:
        """
        Generates a creative collision between two concepts using AI.
        """
        # Validate we have actual concepts
        if not concept_pair or len(concept_pair) < 2:
            raise ValueError("Need at least 2 concepts to generate a collision")
        
        concept1 = concept_pair[0]
        concept2 = concept_pair[1]
        
        print(f"🔄 Generating collision for: '{concept1}' x '{concept2}'")
        
        # Try Gemini first if available
        if self.use_gemini:
            return self._generate_with_gemini(concept1, concept2)
        
        # Try OpenAI if available
        elif self.use_gemini == False:
            return self._generate_with_openai(concept1, concept2)
        
        # Fall back to mock
        else:
            print("⚠️  No API key found, using mock collision")
            return self._generate_mock_collision(concept1, concept2)
    
    def _generate_with_gemini(self, concept1: str, concept2: str) -> Dict[str, Any]:
        """Generate collision using Google Gemini API (stable google-generativeai)"""
        try:
            import google.generativeai as genai
            import time
            from google.api_core import exceptions
            
            genai.configure(api_key=self.gemini_api_key)
            
            # Use 'gemini-flash-latest' which is confirmed available for this key
            model_name = 'gemini-flash-latest'
            model = genai.GenerativeModel(model_name)
            
            prompt = f"""Generate a creative "idea collision" between these two concepts:

Concept 1: "{concept1}"
Concept 2: "{concept2}"

Find a surprising connection, insight, or application that combines them.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{{
    "insight": "A detailed explanation of the creative connection between these concepts (2-3 sentences)",
    "application": "A concrete real-world application that leverages both concepts (2-3 sentences)",
    "domain_intersection": "Domain of Concept 1 x Domain of Concept 2"
}}

Be specific and reference actual properties of both concepts."""
            
            print(f"📡 Calling Gemini API ({model_name})...")
            
            # Retry logic for Rate Limits (429) and Server Errors
            max_retries = 3
            response = None
            
            for attempt in range(max_retries):
                try:
                    response = model.generate_content(prompt)
                    break # Success!
                except exceptions.ResourceExhausted as e:
                    # Handle 429 Rate Limit
                    wait_time = 5 * (attempt + 1)
                    print(f"⏳ Rate limit hit. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
                    if attempt == max_retries - 1:
                        raise e 
                except Exception as e:
                    # If model not found or other client error, try fallback immediately
                    error_str = str(e).lower()
                    if "404" in error_str or "not found" in error_str:
                        print(f"⚠️  {model_name} not found, trying gemini-pro-latest...")
                        try:
                            model = genai.GenerativeModel('gemini-pro-latest')
                            response = model.generate_content(prompt)
                            break
                        except Exception as fallback_error:
                             print(f"❌ Fallback also failed: {fallback_error}")
                             raise e
                    raise e

            if not response:
                raise Exception("Failed to generate response after retries")

            # Extract text from response
            response_text = response.text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = response_text.split("```")[1]
                if response_text.startswith("json"):
                    response_text = response_text[4:]
                response_text = response_text.strip()
            
            content = json.loads(response_text)
            print(f"✅ Gemini collision generated successfully")
            
            return {
                "concept_1": concept1,
                "concept_2": concept2,
                "insight": content.get("insight", "No insight generated."),
                "application": content.get("application", "No application generated."),
                "domain_intersection": content.get("domain_intersection", f"{concept1} x {concept2}")
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini API Error: {error_msg}")
            
            # Fall back to mock collision
            print(f"🔄 Falling back to mock collision")
            return self._generate_mock_collision(concept1, concept2)
    
    def _generate_with_openai(self, concept1: str, concept2: str) -> Dict[str, Any]:
        """Generate collision using OpenAI API"""
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_api_key)
            
            prompt = f"""Generate a creative "idea collision" between these two concepts:

Concept 1: "{concept1}"
Concept 2: "{concept2}"

Find a surprising connection, insight, or application that combines them.

Return ONLY a valid JSON object with this exact structure:
{{
    "insight": "A detailed explanation of the creative connection between these concepts (2-3 sentences)",
    "application": "A concrete real-world application that leverages both concepts (2-3 sentences)",
    "domain_intersection": "Domain of Concept 1 x Domain of Concept 2"
}}

Be specific and reference actual properties of both concepts."""
            
            print(f"📡 Calling OpenAI API...")
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.8,
                max_tokens=500
            )
            
            content = json.loads(response.choices[0].message.content)
            print(f"✅ OpenAI collision generated successfully")
            
            return {
                "concept_1": concept1,
                "concept_2": concept2,
                "insight": content.get("insight", "No insight generated."),
                "application": content.get("application", "No application generated."),
                "domain_intersection": content.get("domain_intersection", f"{concept1} x {concept2}")
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ OpenAI API Error: {error_msg}")
            
            # Fall back to mock collision
            print(f"🔄 Falling back to mock collision")
            return self._generate_mock_collision(concept1, concept2)
    
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
        
        # Infer domains from concepts
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
        
        tech_keywords = ['ai', 'algorithm', 'computer', 'software', 'data', 'network', 'digital', 'quantum', 'computing', 'technology', 'intelligence', 'machine', 'learning', 'blockchain', 'cryptography']
        science_keywords = ['biology', 'physics', 'chemistry', 'science', 'molecular', 'genetic', 'neural', 'brain', 'ecology', 'fungal', 'myco']
        art_keywords = ['art', 'design', 'music', 'creative', 'aesthetic', 'visual', 'architecture', 'biomimicry']
        social_keywords = ['social', 'society', 'culture', 'human', 'psychology', 'urban', 'planning', 'city', 'cognitive', 'game', 'theory']
        business_keywords = ['business', 'market', 'economy', 'finance', 'management', 'strategy', 'circular', 'sustainable']
        
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
