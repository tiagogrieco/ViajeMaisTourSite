import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyDHwCOTi3ENbzofOZIoFHq7DTFq_K2j7gI"
genai.configure(api_key=GEMINI_API_KEY)

print("Checking available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
