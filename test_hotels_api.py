import requests
import sys

BASE_URL = 'http://127.0.0.1:8000'

response = requests.post(f"{BASE_URL}/auth/login", data={
    "username": "admin",
    "password": "password"
})
if response.status_code != 200:
    print("Login failed:", response.text)
    sys.exit(1)

token = response.json().get("access_token")
headers = {"Authorization": f"Bearer {token}"}

res = requests.get(f"{BASE_URL}/master-data/hotels?active_only=true", headers=headers)
print("Hotels:", res.status_code, res.text)
