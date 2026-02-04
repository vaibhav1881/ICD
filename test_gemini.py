"""
Test if Gemini API is configured correctly
"""
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

gemini_key = os.getenv("GEMINI_API_KEY")
openai_key = os.getenv("OPENAI_API_KEY")

print("=" * 60)
print("API KEY STATUS")
print("=" * 60)

if gemini_key and gemini_key != "your_gemini_api_key_here":
    print(f"✅ Gemini API Key: {gemini_key[:20]}...{gemini_key[-10:]}")
    print("   Status: CONFIGURED")
else:
    print("❌ Gemini API Key: NOT CONFIGURED")

print()

if openai_key and openai_key != "your_api_key_here":
    print(f"⚠️  OpenAI API Key: {openai_key[:20]}...{openai_key[-10:]}")
    print("   Status: CONFIGURED (but quota exceeded)")
else:
    print("❌ OpenAI API Key: NOT CONFIGURED")

print()
print("=" * 60)
print("PRIORITY ORDER")
print("=" * 60)

if gemini_key and gemini_key != "your_gemini_api_key_here":
    print("1. 🤖 Gemini API (WILL BE USED)")
    print("2. ⚠️  OpenAI API (fallback)")
    print("3. 🔄 Mock Collision (last resort)")
elif openai_key and openai_key != "your_api_key_here":
    print("1. ⚠️  OpenAI API (quota exceeded)")
    print("2. 🔄 Mock Collision (WILL BE USED)")
else:
    print("1. 🔄 Mock Collision (WILL BE USED)")

print("=" * 60)

# Test Gemini import
print("\nTesting Gemini SDK...")
try:
    import google.generativeai as genai
    print("✅ google-generativeai is installed")
    
    if gemini_key and gemini_key != "your_gemini_api_key_here":
        genai.configure(api_key=gemini_key)
        print("✅ Gemini API key configured")
        
        # Test API call
        print("\n🧪 Testing Gemini API call...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'Hello from Gemini!' in JSON format: {\"message\": \"...\"}")
        print(f"✅ Gemini API works! Response: {response.text[:100]}")
    else:
        print("⚠️  Gemini API key not set, skipping API test")
        
except ImportError:
    print("❌ google-generativeai NOT installed")
    print("   Run: pip install google-generativeai")
except Exception as e:
    print(f"❌ Gemini API test failed: {e}")

print("\n" + "=" * 60)
print("RECOMMENDATION")
print("=" * 60)

if gemini_key and gemini_key != "your_gemini_api_key_here":
    print("✅ Everything is configured correctly!")
    print("   Restart the backend to use Gemini API.")
else:
    print("⚠️  Add your Gemini API key to backend/.env")
    print("   Get it from: https://aistudio.google.com/apikey")
