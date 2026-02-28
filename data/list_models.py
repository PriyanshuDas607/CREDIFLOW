import google.generativeai as genai
import os

API_KEY = "AIzaSyAakQBm-tWif7wv9qUqgQfVdSlCoQe82Ms"
genai.configure(api_key=API_KEY)

print("Starting list...", flush=True)
try:
    for m in genai.list_models():
        print(f"Model: {m.name}", flush=True)
        if 'generateContent' in m.supported_generation_methods:
             print(f"  -> Supports generateContent", flush=True)
except Exception as e:
    print(f"Error listing models: {e}", flush=True)
