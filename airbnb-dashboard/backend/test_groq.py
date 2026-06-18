import os
import requests
from dotenv import load_dotenv

load_dotenv()

groq_api_key = os.environ.get('GROQ_API_KEY', '')
print("API Key:", groq_api_key)

headers = {
    "Authorization": f"Bearer {groq_api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama-3.1-8b-instant",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "hi"}
    ]
}

try:
    response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
    print("Status Code:", response.status_code)
    print("Response Content:", response.text)
except Exception as e:
    print("Error:", e)
