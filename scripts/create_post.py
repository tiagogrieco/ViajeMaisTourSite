import os
import json
import datetime
import re
import random
import time
import sys
import requests
import urllib.parse
import base64

# --- CONFIGURATION ---
GEMINI_API_KEY = "AIzaSyA9mytiSTfgWc9I2MSHTYx6r0EaF_aNthw" 

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BLOG_DATA_PATH = os.path.join(SCRIPT_DIR, "../src/data/blogData.ts")

try:
    from google import genai
    HAS_GEMINI = True
    client = genai.Client(api_key=GEMINI_API_KEY)
except ImportError:
    HAS_GEMINI = False
    client = None

def get_input(prompt, default=None):
    if default:
        user_input = input(f"{prompt} [{default}]: ")
        return user_input if user_input.strip() else default
    return input(f"{prompt}: ")

MODELS_TO_TRY = [
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
]

def try_generate_content(prompt, api_key):
    if not HAS_GEMINI: return None

    for model_name in MODELS_TO_TRY:
        max_retries = 2
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt
                )
                return response
            except Exception as e:
                error_str = str(e)
                if "429" in error_str:
                    time.sleep(5)
                    continue 
                elif "404" in error_str:
                    break 
                else:
                    break 
    return None

def generate_stock_image(prompt):
    """Generates a stock image URL based on content theme."""
    prompt_lower = prompt.lower()
    
    # Map topics to relevant keywords for improved matching
    if any(k in prompt_lower for k in ["lua de mel", "romântico", "casal", "amor"]):
        keywords = "honeymoon,romantic,couple,resort,luxury,sunset"
    elif any(k in prompt_lower for k in ["família", "criança", "kids", "diversão"]):
        keywords = "family,vacation,beach,kids,playing,fun"
    elif any(k in prompt_lower for k in ["disney", "orlando", "parque", "magia"]):
        keywords = "disney,theme park,castle,fireworks,mickey"
    elif any(k in prompt_lower for k in ["praia", "nordeste", "mar", "verão", "caribe"]):
        keywords = "tropical beach,ocean,blue water,paradise,island"
    elif any(k in prompt_lower for k in ["europa", "história", "museu", "antigo"]):
        keywords = "europe,architecture,paris,rome,london,old city"
    elif any(k in prompt_lower for k in ["aventura", "trilha", "natureza", "montanha"]):
        keywords = "mountains,hiking,adventure,nature,forest,landscape"
    elif any(k in prompt_lower for k in ["luxo", "resort", "all inclusive", "vip"]):
        keywords = "luxury hotel,infinity pool,champagne,first class"
    else:
        keywords = "travel,vacation,tourist,landmark,airplane,passport"
    
    # Use Pollinations for consistent AI images or Unsplash for stock
    # Let's use Pollinations for better "generated" feel matching the description
    encoded_prompt = urllib.parse.quote(f"cinematic travel photography of {prompt}, {keywords}, 8k")
    seed = int(time.time())
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=800&height=600&nologo=true&seed={seed}&model=flux"
    return url

def get_existing_titles():
    titles = []
    if os.path.exists(BLOG_DATA_PATH):
        try:
            with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
                content = f.read()
            matches = re.findall(r'title:\s*"(.*?)"', content)
            titles = matches
        except Exception as e:
            pass
    return titles

def generate_full_post_ai():
    if not HAS_GEMINI:
        return None

    existing_titles = get_existing_titles()
    titles_str = ", ".join([f'"{t}"' for t in existing_titles])
    
    prompt = f"""
    Atue como um Sênior em SEO e Copywriting para a Agência de Viagens "Viaje Mais Tour".
    OBJETIVO: Criar um artigo de blog altamente ranqueável no Google Brasil sobre turimo e viagens.
    
    ANO ATUAL: 2026 (Janeiro de 2026). Use este ano nas referências de tempo.
    
    ESTRATÉGIA SEO:
    1. Identifique uma "Palavra-Chave de Cauda Longa" (Long-tail keyword) com alto volume de busca no nicho de viagens (ex: destinos baratos 2026, lua de mel, pacotes, etc).
    2. NÃO use estes tópicos já existentes: [{titles_str}]
    3. O título DEVE conter a palavra-chave principal.
    4. Use o ano 2026 nos títulos quando apropriado.
    
    CONTEXTO DA AGÊNCIA:
    - Viaje Mais Tour: Agência focada em experiências, pacotes personalizados e promoções.
    - Foco: Realizar sonhos, conforto e preço justo.
    
    Sua saída DEVE ser estritamente um JSON válido:
    {{
        "title": "Título Otimizado (Máx 60 chars)",
        "category": "Categoria (Dicas, Destinos, Pacotes)",
        "excerpt": "Meta Description (Máx 150 chars)",
        "content": "Conteúdo HTML rico. Use <h3>, <b>, <ul>."
    }}
    
    """

    response = try_generate_content(prompt, GEMINI_API_KEY)
    
    if not response:
        return None

    try:
        text_response = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text_response)

    except Exception:
        return None

def update_typescript_file(new_post):
    try:
        with open(BLOG_DATA_PATH, "r", encoding="utf-8") as f:
            content = f.read()

        match = re.search(r"export const BLOG_POSTS = \[", content)
        if not match: return

        insert_pos = match.end()
        image_path = new_post['image'] if new_post['image'] else "/assets/blog/post-placeholder.jpg"
        
        safe_title = new_post['title'].replace('"', '\\"')
        safe_excerpt = new_post['excerpt'].replace("\n", " ").replace("\r", "").replace('"', '\\"')
        
        post_str = f"""
    {{
        id: {new_post['id']},
        title: "{safe_title}",
        excerpt: "{safe_excerpt}",
        date: "{new_post['date']}",
        author: "{new_post['author']}",
        category: "{new_post['category']}",
        image: "{image_path}",
        content: `
{new_post['content']}
        `
    }},"""

        new_content = content[:insert_pos] + post_str + content[insert_pos:]
        
        with open(BLOG_DATA_PATH, "w", encoding="utf-8") as f:
            f.write(new_content)
        
    except FileNotFoundError:
        pass

def main():
    if "--preview" in sys.argv:
        data = generate_full_post_ai()
        if data:
            title = data.get('title', 'Sem Título')
            category = data.get('category', 'Dicas')
            
            # USE STOCK IMAGE FALLBACK due to Pollinations Rate limits
            image_url = generate_stock_image(title + " " + category)
            
            preview_data = {
                "id": int(datetime.datetime.now().timestamp()),
                "title": title,
                "excerpt": data.get('excerpt', ''),
                "date": datetime.datetime.now().strftime("%d %b, %Y"),
                "author": "Equipe Viaje Mais",
                "category": category,
                "image": image_url,
                "content": data.get('content', '')
            }
            print(json.dumps(preview_data))
        else:
            print(json.dumps({"error": "Failed to generate content"}))
        return

    # --- MAIN RUN ---
    data = generate_full_post_ai()
    if data:
        title = data.get('title', 'Sem Título')
        category = data.get('category', 'Dicas')
        content = data.get('content', '')
        excerpt = data.get('excerpt', '')
        
        # USE STOCK IMAGE FALLBACK
        image_url = generate_stock_image(title + " " + category)
        
        # Save image locally
        try:
            filename = f"post-{int(time.time())}.jpg"
            save_dir = os.path.join(SCRIPT_DIR, "../public/assets/blog")
            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, filename)
            
            response = requests.get(image_url, timeout=10)
            if response.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(response.content)
                image_local = f"/assets/blog/{filename}"
            else:
                image_local = "/assets/blog/post-placeholder.jpg"
        except:
             image_local = "/assets/blog/post-placeholder.jpg"

        new_post = {
            "id": int(datetime.datetime.now().timestamp()),
            "title": title,
            "excerpt": excerpt,
            "date": datetime.datetime.now().strftime("%d %b, %Y"),
            "author": "Equipe Viaje Mais",
            "category": category,
            "image": image_local,
            "content": content
        }
        
        update_typescript_file(new_post)
        print(json.dumps(new_post))

if __name__ == "__main__":
    main()
