import os
import json
import random
import logging
# Updated: 2026-02-04 23:14 - Reverted to stable google-generativeai SDK
from typing import List, Dict, Any

# Load environment variables dhhdhd
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
        Generates a creative collision between multiple concepts using AI.
        """
        # Validate we have actual concepts
        if not concept_pair or len(concept_pair) < 2:
            raise ValueError("Need at least 2 concepts to generate a collision")
        
        print(f"🔄 Generating collision for: {concept_pair}")
        
        # Try Gemini first if available
        if self.use_gemini:
            return self._generate_with_gemini(concept_pair)
        
        # Try OpenAI if available
        elif self.use_gemini == False:
            return self._generate_with_openai(concept_pair)
        
        # Fall back to mock
        else:
            print("⚠️  No API key found, using mock collision")
            return self._generate_mock_collision(concept_pair[0], concept_pair[1])
    
    def _generate_with_gemini(self, concepts: List[str]) -> Dict[str, Any]:
        """Generate collision using Google Gemini API (stable google-generativeai)"""
        try:
            import google.generativeai as genai
            import time
            from google.api_core import exceptions
            
            genai.configure(api_key=self.gemini_api_key)
            
            # Use 'gemini-flash-latest' which is confirmed available for this key
            model_name = 'gemini-flash-latest'
            model = genai.GenerativeModel(model_name)
            
            concepts_str = "\n".join([f"Concept {i+1}: \"{c}\"" for i, c in enumerate(concepts)])
            
            prompt = f"""Generate a creative "idea collision" between these concepts:

{concepts_str}

Find a surprising connection, insight, or application that combines all of them.

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{{
    "insight": "A detailed explanation of the creative connection between these concepts (2-3 sentences)",
    "application": "A concrete real-world application that leverages all concepts (2-3 sentences)",
    "domain_intersection": "Specify the intersection of domains"
}}

Be specific and reference actual properties of the concepts."""
            
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
                "concept_1": concepts[0],
                "concept_2": " x ".join(concepts[1:]),
                "insight": content.get("insight", "No insight generated."),
                "application": content.get("application", "No application generated."),
                "domain_intersection": content.get("domain_intersection", f"{concepts[0]} x {concepts[1]}")
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Gemini API Error: {error_msg}")
            
            # Fall back to mock collision if everything fails
            print(f"🔄 Falling back to mock collision")
            return self._generate_mock_collision(concepts[0], concepts[1])

    def _generate_with_openai(self, concepts: List[str]) -> Dict[str, Any]:
        """Generate collision using OpenAI API"""
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_api_key)
            
            concepts_str = "\n".join([f"Concept {i+1}: \"{c}\"" for i, c in enumerate(concepts)])
            
            prompt = f"""Generate a creative "idea collision" between these concepts:

{concepts_str}

Find a surprising connection, insight, or application that combines all of them.

Return ONLY a valid JSON object with this exact structure:
{{
    "insight": "A detailed explanation of the creative connection between these concepts (2-3 sentences)",
    "application": "A concrete real-world application that leverages all concepts (2-3 sentences)",
    "domain_intersection": "Specify the intersection of domains"
}}

Be specific and reference actual properties of the concepts."""
            
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
                "concept_1": concepts[0],
                "concept_2": " x ".join(concepts[1:]),
                "insight": content.get("insight", "No insight generated."),
                "application": content.get("application", "No application generated."),
                "domain_intersection": content.get("domain_intersection", f"{concepts[0]} x {concepts[1]}")
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ OpenAI API Error: {error_msg}")
            
            # Fall back to mock collision
            print(f"🔄 Falling back to mock collision")
            return self._generate_mock_collision(concepts[0], concepts[1])
    
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

    def expand_collision(self, concept1: str, concept2: str, insight: str, application: str) -> Dict[str, Any]:
        """Deep dive exploration of an existing collision."""
        prompt = f"""You are a visionary product researcher. You previously created this brilliant idea collision:
Concepts involved: {concept1} and {concept2}
Core Insight: {insight}
Proposed Application: {application}

Create a highly detailed, professional research report for this idea. 
Format your response as ONLY a valid JSON object matching exactly this structure:
{{
    "executive_summary": "A powerful 2-3 sentence overview of why this idea matters.",
    "scientific_mechanism": "A detailed paragraph explaining the technical or scientific mechanism behind how this would actually work.",
    "market_validity": "Analysis of the idea's validity, market potential, and target audience.",
    "implementation_challenges": "The harsh real-world challenges, technical hurdles, and risks in implementing it.",
    "societal_impact": "The ultimate societal and market impact if this succeeds.",
    "confidence_score": 85,
    "feasibility_score": 70,
    "market_potential_score": 90
}}
(Provide realistic integer scores out of 100 for confidence, feasibility, and market potential based on the idea's actual validity)."""
        import json
        try:
            if self.use_gemini:
                import google.generativeai as genai
                model = genai.GenerativeModel('gemini-flash-latest')
                response = model.generate_content(prompt)
                text = response.text.strip()
                # Extract pure JSON
                start = text.find('{')
                end = text.rfind('}')
                if start != -1 and end != -1:
                    text = text[start:end+1]
                parsed = json.loads(text)
                # Ensure metrics are present
                parsed.setdefault("confidence_score", 85)
                parsed.setdefault("feasibility_score", 70)
                parsed.setdefault("market_potential_score", 90)
                return parsed
            elif self.use_gemini == False:
                from openai import OpenAI
                client = OpenAI(api_key=self.openai_api_key)
                response = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    max_tokens=1000
                )
                text = response.choices[0].message.content.strip()
                return json.loads(text)
        except Exception as e:
            print(f"❌ Error expanding collision: {e}")
        
        return {
            "executive_summary": "An error occurred while generating the research report.",
            "scientific_mechanism": "...",
            "market_validity": "...",
            "implementation_challenges": "...",
            "societal_impact": "...",
            "confidence_score": 0,
            "feasibility_score": 0,
            "market_potential_score": 0
        }

    def _infer_domain(self, concept: str) -> str:
        """Infer Technology subdomain from concept name using centralized taxonomy."""
        try:
            from .nlp import classify_subdomain
            subdomains = classify_subdomain(concept)
            return subdomains[0] if subdomains else "Emerging Technologies"
        except Exception:
            # Fallback if import fails
            return "Technology"

llm_service = LLMService()

