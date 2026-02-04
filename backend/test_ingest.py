import requests
import json

url = "http://127.0.0.1:8000/ingest/article"
data = {
    "title": "Test Article",
    "url": "http://test.com/1",
    "text": "Artificial Intelligence is transforming the world. Machine learning and neural networks are key components."
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
