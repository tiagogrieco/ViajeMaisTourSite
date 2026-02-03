import requests
import json

url = "http://localhost:5000/api/publish-post"
data = {
    "id": 999,
    "title": "Test Post Agent",
    "excerpt": "Testing fix",
    "date": "17 Jan, 2026",
    "author": "Agent",
    "category": "Test",
    "image": "/assets/blog/disney.png",
    "content": "Test content"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
