from google import genai
import os

GEMINI_API_KEY = "AIzaSyDHwCOTi3ENbzofOZIoFHq7DTFq_K2j7gI"

client = genai.Client(api_key=GEMINI_API_KEY)

print("Attempting to generate image...")

try:
    # Trying the model name we saw earlier
    response = client.models.generate_images(
        model='gemini-2.0-flash-exp', 
        prompt='A beautiful, luxury beauty salon interior with emerald green and gold accents, photorealistic, 4k',
        config={'number_of_images': 1}
    )
    
    if response.generated_images:
        image = response.generated_images[0]
        image.image.save("test_image.png")
        print("✅ Image generated and saved to test_image.png")
    else:
        print("❌ No image returned.")

except Exception as e:
    print(f"❌ Error (gemini-2.0-flash-exp): {e}")

    # Try fallback model name if the above fails
    try:
        print("Trying fallback model: imagen-3.0-generate-001")
        response = client.models.generate_images(
            model='imagen-3.0-generate-001',
            prompt='A luxury beauty salon',
            config={'number_of_images': 1}
        )
        if response.generated_images:
            response.generated_images[0].image.save("test_image_fallback.png")
            print("✅ Image generated with fallback!")
    except Exception as e2:
        print(f"❌ Error (fallback): {e2}")
