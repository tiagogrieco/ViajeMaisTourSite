import os
import sys
import base64
from google import genai
from google.genai import types

GEMINI_API_KEY = "AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw"

def test_gemini():
    print(f"Testing Gemini Image Gen with Key: {GEMINI_API_KEY[:10]}...")
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt="a beautiful flower",
            config=types.GenerateImagesConfig(
                number_of_images=1,
            )
        )
        if response.generated_images:
            print("✅ Gemini Success!")
            return True
        else:
            print("❌ Gemini returned no images.")
            return False
    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        return False

if __name__ == "__main__":
    test_gemini()
