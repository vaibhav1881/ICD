import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, method, endpoint, data=None):
    """Test a single endpoint and print results"""
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}")
        elif method == "POST":
            response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        
        print(f"✅ Status Code: {response.status_code}")
        print(f"📊 Response: {json.dumps(response.json(), indent=2)}")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

# Test all endpoints
print("\n" + "="*60)
print("🔍 TESTING ALL BACKEND API ENDPOINTS")
print("="*60)

# 1. Health Check
test_endpoint("Health Check", "GET", "/health")

# 2. Database Health Check
test_endpoint("Database Health Check", "GET", "/health/db")

# 3. Dashboard Stats
test_endpoint("Dashboard Stats", "GET", "/dashboard/stats")

# 4. Graph Data
test_endpoint("Graph Data", "GET", "/graph/data")

# 5. List Articles
test_endpoint("List Articles", "GET", "/articles")

# 6. List Collisions
test_endpoint("List Collisions", "GET", "/collisions")

# 7. Ingest Article (if not already exists)
article_data = {
    "title": "Test Article - API Verification",
    "url": "http://test.com/api-verification",
    "text": "This is a test article for API endpoint verification. It contains concepts like machine learning, neural networks, and artificial intelligence."
}
test_endpoint("Ingest Article", "POST", "/ingest/article", article_data)

# 8. Generate Collision
test_endpoint("Generate Collision", "POST", "/collisions/generate")

print("\n" + "="*60)
print("✅ ALL ENDPOINT TESTS COMPLETED")
print("="*60 + "\n")
