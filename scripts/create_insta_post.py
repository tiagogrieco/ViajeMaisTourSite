import os
import json
import base64
import requests
import urllib.parse
import time
import sys

# --- CONFIGURATION ---
GEMINI_API_KEY = "AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw" 

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

def get_gemini_content(prompt):
    if not HAS_GEMINI:
        return "Erro: Biblioteca do Gemini não instalada."
    
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Try multiple models for best results
    models = ['gemini-1.5-pro', 'gemini-2.0-flash-exp', 'gemini-1.5-flash']
    
    for model_name in models:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            return response.text
        except:
            continue
            
    return "Erro IA"

def generate_caption(topic=None):
    if not topic:
        # Generate a trending topic first if none provided
        topic_prompt = "Dê uma ideia de post para Instagram de Agência de Viagens. Responda apenas o tópico em 3 palavras."
        topic = get_gemini_content(topic_prompt).strip()

    prompt = f"""
    Crie uma legenda para Instagram sobre: {topic}.
    
    Contexto: Agência de Viagens "Viaje Mais Tour".
    Modelo de Negócio: Venda de pacotes, passagens e hotéis.
    
    Estilo: Inspirador, wanderlust, com emojis de viagem e hashtags.
    Estrutura:
    - Gancho inicial chamativo ("Já pensou em...", "Destino dos sonhos...")
    - Conteúdo breve (2 frases sobre o destino/promoção)
    - CTA: "Clique no link da bio", "Chame no direct", "Peça seu orçamento". (NUNCA use 'agende seu horário')
    - Hashtags (#viagem #turismo #viajemais)
    """
    
    return get_gemini_content(prompt), topic

def generate_image_pollinations(prompt):
    """Generates an image using Pollinations.ai with fallback to loremflickr."""
    try:
        # Enhanced prompt for TRAVEL
        enhanced_prompt = f"travel photography of {prompt}, cinematic shot, national geographic style, golden hour, 8k, highly detailed, beautiful landscape, wanderlust"
        encoded_prompt = urllib.parse.quote(enhanced_prompt)
        url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1080&height=1350&nologo=true&seed={int(time.time())}"
        
        response = requests.get(url, timeout=30)
        if response.status_code == 200 and len(response.content) > 1000:
            return base64.b64encode(response.content).decode('utf-8')
    except:
        pass
    
    # Fallback to loremflickr
    try:
        prompt_lower = prompt.lower()
        if "praia" in prompt_lower or "beach" in prompt_lower:
            keywords = "beach,tropical,paradise"
        elif "montanha" in prompt_lower or "mountain" in prompt_lower:
            keywords = "mountain,nature,landscape"
        elif "europa" in prompt_lower or "europe" in prompt_lower or "paris" in prompt_lower:
            keywords = "europe,travel,city"
        elif "disney" in prompt_lower or "orlando" in prompt_lower:
            keywords = "theme,park,vacation"
        else:
            keywords = "travel,vacation,destination"
        
        seed = int(time.time())
        fallback_url = f"https://loremflickr.com/1080/1350/{keywords}?lock={seed}"
        response = requests.get(fallback_url, timeout=15)
        if response.status_code == 200:
            return base64.b64encode(response.content).decode('utf-8')
    except:
        pass
    
    return None

def main():
    # If arguments provided, use them
    # Usage: python script.py [topic] [--image-only]
    
    specific_topic = None
    image_only = False
    
    for arg in sys.argv[1:]:
        if arg == "--image-only":
            image_only = True
        elif not arg.startswith("--"):
            specific_topic = arg
            
    caption = ""
    topic = specific_topic
    
    if not image_only:
        # 1. Generate Caption (Only if not image-only)
        caption, topic = generate_caption(specific_topic)
    elif not topic:
        # Edge case: Image only but no topic provided? Fallback to generic
        topic = "Travel Destination"

    # 2. Generate Image (Base64 for frontend preview)
    image_base64 = generate_image_pollinations(topic)
    
    if not image_base64:
        image_base64 = "" 

    # 3. Output JSON
    result = {
        "caption": caption, # Empty if image-only
        "image": f"data:image/jpeg;base64,{image_base64}",
        "topic": topic
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()
