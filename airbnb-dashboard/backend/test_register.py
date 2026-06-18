import requests

url = "http://localhost:8000/api/auth/register/"
payload = {
    "username": "testuser_" + str(hash("testuser"))[:5],
    "email": "test@example.com",
    "password": "testpassword123"
}

try:
    response = requests.post(url, json=payload)
    print("Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
