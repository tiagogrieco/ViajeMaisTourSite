from google import genai
import os

GEMINI_API_KEY = "AIzaSyDHwCOTi3ENbzofOZIoFHq7DTFq_K2j7gI"
client = genai.Client(api_key=GEMINI_API_KEY)

MODELS_TO_TEST = [
    'gemini-2.0-flash-exp-image-generation', # Exact name from user list
    'imagen-3.0-generate-001'
]

print("Testing Image Models...")

for model in MODELS_TO_TEST:
    print(f"\n🤖 Testing {model}...")
    try:
        response = client.models.generate_images(
            model=model,
            prompt='A small red box',
            config={'number_of_images': 1}
        )
        if response.generated_images:
            print(f"✅ SUCCESS with {model}!")
            response.generated_images[0].image.save(f"success_{model}.png")
            break # Stop if one works
    except Exception as e:
        print(f"❌ Failed {model}: {e}")
